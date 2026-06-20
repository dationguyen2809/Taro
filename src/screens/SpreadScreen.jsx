import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TarotCard from '../components/TarotCard.jsx'
import { CARD_BACK_URL, TAROT_DECK } from '../data/cards.js'
import '../styles/cards.css'

/* ----- Carousel ARC 2.5D -----
   Mỗi lá đặt trên một CUNG cố định hình ∪ (giữa thấp, hai bên cao & nghiêng ra),
   xoay = cho các lá trôi dọc theo cung (góc φ = ringAngle + i*STEP). Cả cung
   nảy lên xuống (bob) khi xoay. Cho đúng cảm giác như reference.
   Luồng: 'deck' (xếp chồng giữa) → chụm/bấm TRÁO → 'ring' (bài toả ra cung). */
const RING_SIZE = TAROT_DECK.length // đủ 78 lá
const STEP = 360 / RING_SIZE
// Trụ panorama: camera nằm trên trục (perspective = RADIUS) → mỗi lá tự HƯỚNG
// MẶT về phía người xem (ry = đúng góc φ), lá rìa to hơn theo 1/cosφ (chiều sâu thật).
const RADIUS = 2050 // bán kính trụ (px) = perspective — cách nhau & chiều sâu
const V = 320 // độ cong DỌC (px) — hai bên cong xuống
const VISIBLE_SPAN = 54 // |φ| > góc này → ẩn (tránh lá quá nghiêng/edge-on)

const IDLE_SPEED = 0.16 // tự xoay nhẹ khi tay ở giữa (deg/frame)
const MAX_SPEED = 2.8 // tốc độ tối đa khi tay lệch hẳn ra rìa (deg/frame)
const SPEED_POWER = 1.4 // đường cong: gần giữa nhạy nhẹ, ra rìa tăng mạnh
const DEADZONE = 0.06 // vùng chết quanh giữa để khỏi rung
const BOB_BASE = 5 // biên độ nảy lên xuống khi đứng yên (px)
const BOB_GAIN = 4.5 // biên độ tăng thêm theo tốc độ xoay
const BOB_SPEED = 0.05 // nhịp nảy (rad/frame)

const wrap = (deg) => {
  let d = ((deg % 360) + 360) % 360
  return d > 180 ? d - 360 : d // [-180, 180]
}

// Lá trên trụ tại góc φ: rotateY(φ) cho lá HƯỚNG MẶT về tâm (người xem),
// translateZ(-R) đặt lên thành trụ, translateY thêm độ cong dọc. translateY nằm
// SAU rotateY nhưng rotateY giữ nguyên trục Y → dịch vẫn theo chiều dọc thế giới.
// Cùng CẤU TRÚC với deckTransform để CSS nội suy mượt khi tráo.
function arcTransform(phiDeg) {
  const phi = (phiDeg * Math.PI) / 180
  const curveY = (1 - Math.cos(phi)) * V // hai bên cong xuống
  return `rotateY(${phiDeg.toFixed(2)}deg) translateZ(-${RADIUS}px) translateY(${curveY.toFixed(1)}px)`
}
function deckTransform(i) {
  const t = i / (RING_SIZE - 1) - 0.5 // -0.5..0.5 → quạt chồng nhẹ
  const ry = (t * 14).toFixed(2)
  const dy = (t * -34).toFixed(1)
  return `rotateY(${ry}deg) translateZ(-${RADIUS}px) translateY(${dy}px)`
}

export default function SpreadScreen({
  reading,
  spread,
  getPointer,
  pressed,
  inputMode,
  handStatus,
  handPresent,
  cardsToPick,
  onComplete,
}) {
  const positions = spread?.positions ?? []
  const showTrayLabels = cardsToPick <= 5
  const slots = useMemo(() => Array.from({ length: RING_SIZE }, (_, i) => i), [])
  const [selectedSlots, setSelectedSlots] = useState([])
  const [stage, setStage] = useState('deck') // 'deck' → 'ring'

  const ringRef = useRef(null)
  const slotRefs = useRef([])
  const ringAngleRef = useRef(0)
  const velRef = useRef(0)
  const getPointerRef = useRef(getPointer)
  getPointerRef.current = getPointer
  const selectedRef = useRef(selectedSlots)
  selectedRef.current = selectedSlots
  const stageRef = useRef(stage)
  stageRef.current = stage
  const frontIndexRef = useRef(0)
  const hiddenRef = useRef([])
  const bobPhaseRef = useRef(0)
  const fanDoneRef = useRef(false) // đã fan-out xong → rAF tiếp quản transform
  const tookOverRef = useRef(false)
  const completedRef = useRef(false)

  // ----- Vòng lặp -----
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = () => {
      const ring = ringRef.current
      // Giai đoạn xếp bài / đang fan-out: để CSS transition lo, rAF không ghi.
      if (stageRef.current === 'deck' || !fanDoneRef.current) {
        if (ring) ring.style.transform = `translateZ(${RADIUS}px)`
        raf = requestAnimationFrame(tick)
        return
      }

      // Lần đầu tiếp quản: tắt transition để cập nhật mỗi frame không bị trễ.
      if (!tookOverRef.current) {
        tookOverRef.current = true
        slotRefs.current.forEach((el) => el && (el.style.transition = 'none'))
      }

      // Tốc độ xoay theo tay/chuột.
      const p = getPointerRef.current?.()
      const dev = p ? p.x - 0.5 : 0
      const mag = Math.min(1, Math.abs(dev) * 2)
      let target = reduced ? 0 : IDLE_SPEED
      if (p && mag > DEADZONE) {
        target = Math.sign(dev) * Math.pow(mag, SPEED_POWER) * MAX_SPEED
      }
      velRef.current += (target - velRef.current) * 0.12
      ringAngleRef.current += velRef.current
      const angle = ringAngleRef.current

      // Cả cung NẢY lên xuống — biên độ tăng theo tốc độ xoay.
      bobPhaseRef.current += BOB_SPEED
      const amp = BOB_BASE + Math.min(Math.abs(velRef.current), MAX_SPEED) * BOB_GAIN
      const bob = Math.sin(bobPhaseRef.current) * amp
      if (ring) ring.style.transform = `translateY(${bob.toFixed(1)}px) translateZ(${RADIUS}px)`

      // Mỗi lá trôi dọc theo CUNG; ẩn lá ngoài tầm; tìm lá ở giữa.
      let front = -1
      let bestAbs = Infinity
      for (let i = 0; i < RING_SIZE; i++) {
        const phi = wrap(angle + i * STEP)
        const absPhi = Math.abs(phi)
        const el = slotRefs.current[i]
        const hide = absPhi > VISIBLE_SPAN
        if (hiddenRef.current[i] !== hide) {
          hiddenRef.current[i] = hide
          if (el) el.style.visibility = hide ? 'hidden' : 'visible'
        }
        if (!hide && el) {
          el.style.transform = arcTransform(phi)
        }
        if (!selectedRef.current.includes(i) && absPhi < bestAbs) {
          bestAbs = absPhi
          front = i
        }
      }
      if (front >= 0 && front !== frontIndexRef.current) {
        const prev = slotRefs.current[frontIndexRef.current]
        const next = slotRefs.current[front]
        if (prev) prev.classList.remove('is-front')
        if (next) next.classList.add('is-front')
        frontIndexRef.current = front
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const selectSlot = useCallback(
    (slot) => {
      if (slot == null || slot < 0) return
      setSelectedSlots((prev) => {
        if (prev.includes(slot) || prev.length >= cardsToPick) return prev
        return [...prev, slot]
      })
    },
    [cardsToPick]
  )

  // Tráo bài: từ deck → ring (bài bay toả ra theo CSS transition, rồi rAF tiếp quản).
  const shuffle = useCallback(() => {
    if (stageRef.current !== 'deck') return
    setStage('ring')
    fanDoneRef.current = false
    tookOverRef.current = false
    window.setTimeout(() => {
      fanDoneRef.current = true
    }, 950)
  }, [])

  // Cạnh lên "pressed": deck → tráo bài; ring → rút lá ở giữa.
  const prevPressed = useRef(false)
  useEffect(() => {
    if (pressed && !prevPressed.current) {
      if (stageRef.current === 'deck') shuffle()
      else selectSlot(frontIndexRef.current)
    }
    prevPressed.current = pressed
  }, [pressed, shuffle, selectSlot])

  useEffect(() => {
    if (selectedSlots.length >= cardsToPick && !completedRef.current) {
      completedRef.current = true
      const t = setTimeout(onComplete, 1000)
      return () => clearTimeout(t)
    }
  }, [selectedSlots, cardsToPick, onComplete])

  const remaining = cardsToPick - selectedSlots.length

  // Nội dung gợi ý theo giai đoạn
  let hint
  if (stage === 'deck') {
    hint =
      inputMode === 'hand'
        ? handStatus === 'ready'
          ? handPresent
            ? 'Chụm ngón cái + ngón trỏ để tráo bài, rồi thả tay ra.'
            : 'Đưa bàn tay vào khung hình…'
          : 'Đang khởi tạo camera…'
        : 'Bấm vào bộ bài để tráo và trải ra.'
  } else if (remaining > 0) {
    hint = (
      <>
        <strong>Chọn {remaining} lá nữa.</strong>{' '}
        {inputMode === 'hand'
          ? 'Đưa tay lệch trái/phải để xoay vòng bài, chụm ngón để rút lá ở giữa.'
          : 'Đưa chuột lệch trái/phải để xoay, bấm để rút lá ở giữa.'}
      </>
    )
  } else {
    hint = <strong>Đã đủ {cardsToPick} lá. Đang luận giải…</strong>
  }

  return (
    <section className={`screen spread spread--${stage}`}>
      <div className="spread__counter" aria-live="polite">
        <b>{selectedSlots.length}</b>
        <span>/ {cardsToPick} lá</span>
      </div>

      <div className="spread__hint">
        {stage === 'deck' && <strong>Tráo bài để bắt đầu. </strong>}
        {hint}
      </div>

      {/* Vòng bài 3D */}
      <div className="carousel" onClick={stage === 'deck' ? shuffle : undefined}>
        <div className="carousel__rays" aria-hidden="true" />
        {stage === 'ring' && (
          <div className="carousel__indicator" aria-hidden="true">
            <svg width="30" height="17" viewBox="0 0 30 17" fill="none">
              <path d="M15 17L4 4h22L15 17Z" fill="currentColor" />
            </svg>
          </div>
        )}
        <div className="carousel__stage" style={{ perspective: `${RADIUS}px` }}>
          <div className="carousel__ring" ref={ringRef}>
            {slots.map((i) => {
              const isSelected = selectedSlots.includes(i)
              const phi0 = wrap(i * STEP)
              return (
                <div
                  key={i}
                  ref={(el) => (slotRefs.current[i] = el)}
                  className={`carousel__tile ${isSelected ? 'is-picked' : ''}`}
                  style={{
                    transform: stage === 'deck' ? deckTransform(i) : arcTransform(phi0),
                    backgroundImage: `url(${CARD_BACK_URL})`,
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Khay các vị trí (chỉ hiện khi đã trải ra) */}
      {stage === 'ring' && (
        <div className={`spread__tray ${cardsToPick > 6 ? 'is-dense' : ''}`}>
          {positions.map((pos, idx) => {
            const filled = idx < selectedSlots.length
            return (
              <div className="spread__tray-slot" key={pos.key}>
                <div className={`spread__tray-card ${filled ? 'is-filled' : ''}`}>
                  {filled ? (
                    <TarotCard card={null} faceUp={false} />
                  ) : (
                    <span className="tarot-card__num">{idx + 1}</span>
                  )}
                </div>
                {showTrayLabels && (
                  <span className="spread__tray-label">{pos.label}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
