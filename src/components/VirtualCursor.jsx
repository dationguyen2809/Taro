import { useEffect, useRef, useState } from 'react'

/* Con trỏ ảo bám theo pointer (đọc qua getPointer() trong rAF riêng).
   Cập nhật transform trực tiếp trên DOM → mượt, không gây re-render App. */
export default function VirtualCursor({ getPointer, pressed, mode }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf = 0
    let shown = false
    const loop = () => {
      const el = ref.current
      const p = getPointer?.()
      if (el) {
        if (p) {
          el.style.transform = `translate3d(${p.x * window.innerWidth}px, ${
            p.y * window.innerHeight
          }px, 0)`
          if (!shown) {
            shown = true
            setVisible(true)
          }
        } else if (shown) {
          shown = false
          setVisible(false)
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [getPointer])

  return (
    <div
      ref={ref}
      className="virtual-cursor"
      data-pressed={pressed ? 'true' : 'false'}
      data-mode={mode}
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  )
}
