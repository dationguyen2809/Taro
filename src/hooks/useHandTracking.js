import { useCallback, useEffect, useRef, useState } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

/* ============================================================
   useHandTracking — bật webcam + MediaPipe HandLandmarker.
   Trả về:
     - status: 'idle' | 'loading' | 'requesting' | 'ready' | 'denied' | 'error'
     - cursor: { x, y } theo toạ độ chuẩn hoá [0..1] đã LẬT GƯƠNG (selfie)
     - isPinching: ngón cái + ngón trỏ chụm lại (hành vi "click")
     - handPresent: có phát hiện bàn tay hay không
     - error: thông điệp lỗi
     - start(), stop()
   Tham số callback:
     - onPinchStart, onPinchEnd: kích hoạt theo cạnh (edge-triggered)
   ============================================================ */

// Tải wasm + model từ CDN — chạy được trên GitHub Pages mà không cần bundle.
const WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

// Ngưỡng chụm ngón: tỉ lệ (khoảng cách ngón cái–trỏ) / (kích thước bàn tay).
const PINCH_ON = 0.42 // dưới mức này: bắt đầu chụm
const PINCH_OFF = 0.6 // trên mức này: nhả ra (có hysteresis chống rung)

export function useHandTracking({ onPinchStart, onPinchEnd } = {}) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [isPinching, setIsPinching] = useState(false)
  const [handPresent, setHandPresent] = useState(false)

  // Con trỏ để trong REF (không setState mỗi frame) → không re-render App ~30fps.
  // Đây là tối ưu chống lag quan trọng nhất khi bật camera.
  const cursorRef = useRef(null)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const landmarkerRef = useRef(null)
  const rafRef = useRef(0)
  const pinchingRef = useRef(false)
  const lastVideoTimeRef = useRef(-1)
  const cbRef = useRef({ onPinchStart, onPinchEnd })

  // Giữ callback mới nhất mà không cần restart loop.
  useEffect(() => {
    cbRef.current = { onPinchStart, onPinchEnd }
  }, [onPinchStart, onPinchEnd])

  const detectLoop = useCallback(() => {
    const video = videoRef.current
    const landmarker = landmarkerRef.current
    if (!video || !landmarker) return

    if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime
      let results
      try {
        results = landmarker.detectForVideo(video, performance.now())
      } catch {
        // bỏ qua frame lỗi, thử frame sau
      }

      const hand = results?.landmarks?.[0]
      if (hand) {
        setHandPresent(true) // boolean: React tự bỏ qua nếu không đổi
        // Landmark 8 = đầu ngón trỏ → vị trí con trỏ.
        const tip = hand[8]
        // Lật gương trục x; làm mượt bằng EMA để bớt rung và cho phép
        // chạy nhận diện thưa hơn mà con trỏ vẫn êm.
        const nx = 1 - tip.x
        const ny = tip.y
        const prev = cursorRef.current
        cursorRef.current = prev
          ? { x: prev.x + (nx - prev.x) * 0.55, y: prev.y + (ny - prev.y) * 0.55 }
          : { x: nx, y: ny }

        // Tính tỉ lệ chụm: |thumb_tip - index_tip| / |wrist - middle_mcp|
        const thumb = hand[4]
        const index = hand[8]
        const wrist = hand[0]
        const middleMcp = hand[9]
        const pinchDist = dist(thumb, index)
        const handSize = dist(wrist, middleMcp) || 1e-6
        const ratio = pinchDist / handSize

        const wasPinching = pinchingRef.current
        if (!wasPinching && ratio < PINCH_ON) {
          pinchingRef.current = true
          setIsPinching(true)
          cbRef.current.onPinchStart?.({ x: 1 - tip.x, y: tip.y })
        } else if (wasPinching && ratio > PINCH_OFF) {
          pinchingRef.current = false
          setIsPinching(false)
          cbRef.current.onPinchEnd?.({ x: 1 - tip.x, y: tip.y })
        }
      } else {
        setHandPresent(false)
        cursorRef.current = null
        if (pinchingRef.current) {
          pinchingRef.current = false
          setIsPinching(false)
        }
      }
    }
    rafRef.current = requestAnimationFrame(detectLoop)
  }, [])

  const start = useCallback(async () => {
    if (status === 'loading' || status === 'requesting' || status === 'ready')
      return
    setError(null)
    try {
      // 1) Tải model
      setStatus('loading')
      if (!landmarkerRef.current) {
        const fileset = await FilesetResolver.forVisionTasks(WASM_URL)
        landmarkerRef.current = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 1,
        })
      }

      // 2) Xin quyền camera
      setStatus('requesting')
      // Độ phân giải thấp → detectForVideo nhanh hơn nhiều (nhận diện tay không
      // cần độ nét cao). Đây là một phần quan trọng để hết lag.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current
      if (!video) throw new Error('Thiếu phần tử video')
      video.srcObject = stream
      await video.play()

      setStatus('ready')
      lastVideoTimeRef.current = -1
      rafRef.current = requestAnimationFrame(detectLoop)
    } catch (err) {
      console.error('[useHandTracking] start error:', err)
      if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') {
        setStatus('denied')
        setError('Bạn đã từ chối quyền truy cập camera.')
      } else if (err?.name === 'NotFoundError') {
        setStatus('error')
        setError('Không tìm thấy camera trên thiết bị.')
      } else {
        setStatus('error')
        setError(err?.message || 'Không khởi tạo được nhận diện tay.')
      }
      stopStream()
    }
  }, [status, detectLoop])

  const stopStream = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const stop = useCallback(() => {
    stopStream()
    setStatus('idle')
    cursorRef.current = null
    setHandPresent(false)
    setIsPinching(false)
    pinchingRef.current = false
  }, [stopStream])

  // Dọn dẹp khi unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      landmarkerRef.current?.close?.()
      landmarkerRef.current = null
    }
  }, [])

  return {
    videoRef,
    status,
    error,
    cursorRef,
    isPinching,
    handPresent,
    start,
    stop,
  }
}

function dist(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = (a.z ?? 0) - (b.z ?? 0)
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
