import { useEffect, useRef } from 'react'

/* Nền vũ trụ "bụi sao vàng":
   - Lớp tối + quầng vàng tĩnh nằm trong CSS (.bg-wash).
   - Canvas vẽ rất nhiều hạt bụi sao vàng li ti (twinkle, trôi nhẹ) cộng vài
     ngôi sao lớn có quầng sáng (glow sprite) — pha trộn additive ('lighter')
     cho cảm giác lung linh. Nhẹ: chỉ vẽ hạt, không vẽ gradient lớn mỗi frame. */

const GOLD = ['#ffe9a8', '#ffd86b', '#fff4cf', '#ffcf5a', '#ffffff']

export default function Background({ phase }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let w = 0
    let h = 0
    let dpr = 1
    let dust = []
    let stars = []

    // Sprite quầng sáng vàng (vẽ 1 lần, dùng lại bằng drawImage → rẻ).
    const glow = document.createElement('canvas')
    const G = 64
    glow.width = glow.height = G
    const gx = glow.getContext('2d')
    const grad = gx.createRadialGradient(G / 2, G / 2, 0, G / 2, G / 2, G / 2)
    grad.addColorStop(0, 'rgba(255,240,190,0.95)')
    grad.addColorStop(0.25, 'rgba(255,210,110,0.55)')
    grad.addColorStop(1, 'rgba(255,200,90,0)')
    gx.fillStyle = grad
    gx.fillRect(0, 0, G, G)

    const rand = (a, b) => a + Math.random() * (b - a)

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      w = canvas.width = Math.floor(window.innerWidth * dpr)
      h = canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'

      const area = window.innerWidth * window.innerHeight
      const dustCount = Math.min(420, Math.round(area / 4200))
      const starCount = Math.min(22, Math.round(area / 90000))

      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.4, 1.7) * dpr,
        vx: rand(-0.05, 0.05) * dpr,
        vy: rand(-0.04, 0.06) * dpr,
        a: rand(0.1, 0.7),
        tw: rand(0.005, 0.03),
        ph: Math.random() * Math.PI * 2,
        c: GOLD[Math.floor(Math.random() * GOLD.length)],
      }))
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: rand(0.5, 1.6) * dpr,
        a: rand(0.35, 0.9),
        tw: rand(0.01, 0.035),
        ph: Math.random() * Math.PI * 2,
        spike: Math.random() < 0.6,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // Bụi sao
      for (const p of dust) {
        p.x += p.vx
        p.y += p.vy
        p.ph += p.tw
        if (p.x < 0) p.x = w
        else if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        else if (p.y > h) p.y = 0
        const a = p.a * (0.55 + 0.45 * Math.sin(p.ph))
        ctx.globalAlpha = a
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Sao lớn có quầng + tia sáng
      for (const s of stars) {
        s.ph += s.tw
        const a = s.a * (0.5 + 0.5 * Math.sin(s.ph))
        const size = G * s.s
        ctx.globalAlpha = a
        ctx.drawImage(glow, s.x - size / 2, s.y - size / 2, size, size)
        if (s.spike) {
          ctx.globalAlpha = a * 0.9
          ctx.strokeStyle = 'rgba(255,240,200,0.9)'
          ctx.lineWidth = 1 * dpr
          const len = 7 * s.s * dpr
          ctx.beginPath()
          ctx.moveTo(s.x - len, s.y)
          ctx.lineTo(s.x + len, s.y)
          ctx.moveTo(s.x, s.y - len)
          ctx.lineTo(s.x, s.y + len)
          ctx.stroke()
        }
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(draw)
    }

    resize()
    if (prefersReduced) {
      // vẽ tĩnh một lần
      const once = draw
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (const p of dust) {
        ctx.globalAlpha = p.a
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const s of stars) {
        const size = G * s.s
        ctx.globalAlpha = s.a
        ctx.drawImage(glow, s.x - size / 2, s.y - size / 2, size, size)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      void once
    } else {
      raf = requestAnimationFrame(draw)
    }
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <div className="bg-wash" data-phase={phase} />
      <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />
    </>
  )
}
