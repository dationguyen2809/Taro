import { forwardRef } from 'react'
import { cardImageUrl, CARD_BACK_URL } from '../data/cards.js'

/* Lá bài hai mặt: úp (back) và ngửa (front), dùng ảnh bộ Korean Rider–Waite.
   Lớp SVG bên dưới đóng vai trò dự phòng nếu ảnh chưa/không tải được.
   - faceUp: lật để lộ mặt trước
   - card: dữ liệu lá (null → chỉ mặt sau)
   - reversed: lá ngược (xoay ảnh 180°)
   - eager: tải ảnh ngay (mặt trước lá kết quả) thay vì lazy */
const TarotCard = forwardRef(function TarotCard(
  { card, faceUp = false, reversed = false, eager = false, className = '', style },
  ref
) {
  const frontSrc = cardImageUrl(card)
  return (
    <div
      ref={ref}
      className={`tarot-card ${faceUp ? 'is-faceup' : ''} ${
        reversed ? 'is-reversed' : ''
      } ${className}`}
      style={style}
    >
      {/* Mặt sau */}
      <div className="tarot-card__face tarot-card__back">
        <svg className="tarot-card__back-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <path d="M32 8a24 24 0 0 0 0 48 14 14 0 0 1 0-48Z" fill="currentColor" opacity="0.85" />
        </svg>
        <img
          className="tarot-card__img"
          src={CARD_BACK_URL}
          alt=""
          draggable="false"
          loading="lazy"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      </div>

      {/* Mặt trước */}
      <div className="tarot-card__face tarot-card__front">
        <div className="tarot-card__front-art">
          <CardArt card={card} />
        </div>
        {frontSrc && (
          <img
            className={`tarot-card__img ${reversed ? 'is-reversed-img' : ''}`}
            src={frontSrc}
            alt={card?.name || ''}
            draggable="false"
            loading={eager ? 'eager' : 'lazy'}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}
      </div>
    </div>
  )
})

/* Hình minh hoạ SVG tối giản — chỉ hiện khi ảnh chưa tải (lớp nền). */
function CardArt({ card }) {
  if (!card) return null
  const suit = card.arcana === 'major' ? 'major' : card.suit
  const art = SUIT_ART[suit] || SUIT_ART.major
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {art}
    </svg>
  )
}

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
  fill: 'none',
}

const SUIT_ART = {
  major: (
    <>
      <circle cx="32" cy="32" r="14" {...stroke} />
      <path d="M32 6v8M32 50v8M6 32h8M50 32h8M14 14l6 6M44 44l6 6M50 14l-6 6M20 44l-6 6" {...stroke} />
    </>
  ),
  wands: (
    <>
      <path d="M22 54L42 14" {...stroke} />
      <path d="M42 14l-6 2 2-6" {...stroke} />
    </>
  ),
  cups: (
    <>
      <path d="M20 16h24l-3 16a9 9 0 0 1-18 0z" {...stroke} />
      <path d="M32 48v6M24 54h16" {...stroke} />
    </>
  ),
  swords: (
    <>
      <path d="M32 8v34" {...stroke} />
      <path d="M24 42h16M32 42v10" {...stroke} />
    </>
  ),
  pentacles: (
    <>
      <circle cx="32" cy="32" r="18" {...stroke} />
      <path d="M32 16l4.7 9.5 10.5 1.5-7.6 7.4 1.8 10.4L32 41.5 22.6 46.2l1.8-10.4L16.8 28l10.5-1.5z" {...stroke} />
    </>
  ),
}

export default TarotCard
