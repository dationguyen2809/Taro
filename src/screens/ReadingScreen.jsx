import { useEffect, useMemo, useState } from 'react'
import TarotCard from '../components/TarotCard.jsx'
import { buildSynthesis } from '../data/synthesis.js'
import '../styles/cards.css'

/* Màn kết quả — render theo layout của kiểu trải bài:
   - row / grid  → "flow": mỗi lá kèm luận giải.
   - cross / pentagram → "board": bàn bài theo toạ độ + danh sách luận giải.
   Cuối cùng: phần TỔNG HỢP nối các lá lại theo câu hỏi. */
export default function ReadingScreen({ reading, spread, theme, question, onReplay }) {
  const positions = spread?.positions ?? []
  const isBoard = spread?.layout === 'cross' || spread?.layout === 'pentagram'
  const [revealed, setRevealed] = useState(0)

  const synthesis = useMemo(
    () => buildSynthesis(reading, spread, theme, question),
    [reading, spread, theme, question]
  )

  useEffect(() => {
    setRevealed(0)
    const step = isBoard ? 300 : 560
    const timers = reading.map((_, i) =>
      setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), 400 + i * step)
    )
    return () => timers.forEach(clearTimeout)
  }, [reading, isBoard])

  const allRevealed = revealed >= reading.length

  return (
    <section className="screen reading">
      <header className="reading__head">
        <h1>{spread?.name ?? 'Trải bài của bạn'}</h1>
        {question?.trim() ? (
          <p className="reading__question">“{question.trim()}”</p>
        ) : null}
        <p>
          {theme?.emoji} {theme?.label} — {theme?.framing}
        </p>
      </header>

      {isBoard ? (
        <BoardLayout
          reading={reading}
          positions={positions}
          layout={spread.layout}
          revealed={revealed}
        />
      ) : (
        <FlowLayout reading={reading} positions={positions} revealed={revealed} />
      )}

      {synthesis && (
        <div
          className="reading__synthesis"
          style={{
            opacity: allRevealed ? 1 : 0,
            transform: allRevealed ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity .6s ease, transform .6s ease',
          }}
        >
          <h2>✦ Tổng hợp</h2>
          <p>{synthesis.text}</p>
          {synthesis.takeaways.length > 0 && (
            <div className="reading__takeaways">
              {synthesis.takeaways.map((k) => (
                <span key={k}>{k}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="reading__actions">
        <button className="btn-gold" type="button" onClick={onReplay}>
          Trải bài khác
        </button>
      </div>
    </section>
  )
}

/* ---------- Flow: row / grid ---------- */
function FlowLayout({ reading, positions, revealed }) {
  return (
    <div className="reading__flow" data-count={reading.length}>
      {reading.map((card, idx) => {
        const pos = positions[idx] ?? { label: `Lá ${idx + 1}`, hint: '' }
        const isUp = idx < revealed
        const text = card.isReversed ? card.reversed : card.upright
        return (
          <article className="reading__col" key={card.id + idx}>
            <div className="reading__pos">{pos.label}</div>
            <div
              className="cardstage"
              style={{ animationDelay: `${(idx % 4) * 0.5}s` }}
            >
              <TarotCard card={card} faceUp={isUp} reversed={card.isReversed} eager />
              <span className="cardstage__shadow" />
              {isUp && (
                <>
                  <span className="sparkle sparkle--1" />
                  <span className="sparkle sparkle--2" />
                  <span className="sparkle sparkle--3" />
                </>
              )}
            </div>
            <div
              className="reading__card-meaning"
              style={{
                opacity: isUp ? 1 : 0,
                transform: isUp ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity .5s ease, transform .5s ease',
              }}
            >
              <div className="reading__card-name">{card.name}</div>
              <div className="reading__card-dir">
                {card.isReversed ? '⟲ Lá ngược' : '↑ Lá xuôi'} · {pos.hint}
              </div>
              <div className="reading__keywords">
                {card.keywords.slice(0, 4).map((k) => (
                  <span key={k}>{k}</span>
                ))}
              </div>
              <p className="reading__card-text">{text}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/* ---------- Board: cross / pentagram ---------- */
function BoardLayout({ reading, positions, layout, revealed }) {
  return (
    <>
      <div className={`reading__board reading__board--${layout}`}>
        {reading.map((card, idx) => {
          const pos = positions[idx] ?? { x: 50, y: 50, label: `${idx + 1}` }
          const isUp = idx < revealed
          return (
            <div
              key={card.id + idx}
              className="reading__board-card"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) rotate(${pos.rotate ?? 0}deg)`,
                zIndex: pos.rotate ? 5 : 1,
              }}
            >
              <span className="reading__board-num">{idx + 1}</span>
              <TarotCard card={card} faceUp={isUp} reversed={card.isReversed} eager />
            </div>
          )
        })}
      </div>

      <ol className="reading__list">
        {reading.map((card, idx) => {
          const pos = positions[idx] ?? { label: `Lá ${idx + 1}`, hint: '' }
          const isUp = idx < revealed
          const text = card.isReversed ? card.reversed : card.upright
          return (
            <li
              className="reading__list-item"
              key={card.id + idx}
              style={{ opacity: isUp ? 1 : 0.25, transition: 'opacity .4s ease' }}
            >
              <div className="reading__list-pos">{pos.label}</div>
              <div className="reading__list-body">
                <div className="reading__card-name">
                  {card.name}{' '}
                  <span className="reading__card-dir">
                    {card.isReversed ? '⟲ ngược' : '↑ xuôi'}
                  </span>
                </div>
                <div className="reading__list-hint">{pos.hint}</div>
                <p className="reading__card-text">{text}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </>
  )
}
