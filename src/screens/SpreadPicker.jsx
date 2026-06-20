import { useMemo } from 'react'
import {
  SPREADS,
  FREE_SPREAD,
  makeFreeSpread,
  spreadCardCount,
} from '../data/spreads.js'
import { THEMES } from '../data/themes.js'
import '../styles/picker.css'

const QUESTION_SUGGESTIONS = [
  'Tôi cần biết điều gì lúc này?',
  'Năng lượng quanh tôi đang thế nào?',
  'Điều gì đang cản trở tôi?',
  'Tôi nên tập trung vào đâu?',
]

/* Màn chọn kiểu trải bài + chủ đề + chế độ điều khiển.
   Mọi lựa chọn đẩy lên context qua onChoose; onStart(mode) khởi động phiên. */
export default function SpreadPicker({
  selectedSpread,
  selectedTheme,
  question,
  onQuestionChange,
  onChoose,
  onStart,
  handStatus,
  handError,
}) {
  const busy = handStatus === 'loading' || handStatus === 'requesting'
  const isFree = selectedSpread?.id === 'free'
  const freeCount = isFree
    ? spreadCardCount(selectedSpread)
    : FREE_SPREAD.defaultCards

  // Nhóm theo category để hiển thị có lớp lang.
  const groups = useMemo(() => {
    const map = new Map()
    for (const s of SPREADS) {
      if (!map.has(s.category)) map.set(s.category, [])
      map.get(s.category).push(s)
    }
    return [...map.entries()]
  }, [])

  const pickSpread = (spread) => onChoose(spread, selectedTheme.id)
  const pickFree = (n) => onChoose(makeFreeSpread(n), selectedTheme.id)
  const pickTheme = (themeId) => onChoose(selectedSpread, themeId)

  const statusText =
    handStatus === 'loading'
      ? 'Đang tải mô hình nhận diện tay…'
      : handStatus === 'requesting'
        ? 'Hãy cho phép truy cập camera…'
        : handError || ''

  return (
    <section className="screen picker">
      <div className="picker__scroll">
        <header className="picker__head">
          <h1>Đặt câu hỏi & chọn cách trải bài</h1>
          <p>
            Hãy giữ trong tâm điều bạn muốn hỏi. Câu hỏi mở (định hướng, thấu
            hiểu) sẽ cho lời giải sâu hơn câu hỏi đúng/sai.
          </p>
        </header>

        {/* Ô đặt câu hỏi */}
        <div className="picker__question">
          <label htmlFor="q">Câu hỏi của bạn</label>
          <input
            id="q"
            type="text"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="Ví dụ: Tôi cần biết điều gì lúc này về…"
            maxLength={140}
            autoComplete="off"
          />
          <div className="picker__question-hints">
            {QUESTION_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className="q-chip"
                onClick={() => onQuestionChange(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Chủ đề */}
        <div className="picker__themes">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`theme-chip ${selectedTheme.id === t.id ? 'is-active' : ''}`}
              onClick={() => pickTheme(t.id)}
            >
              <span aria-hidden="true">{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Danh sách kiểu trải bài */}
        {groups.map(([cat, items]) => (
          <div className="picker__group" key={cat}>
            <div className="picker__group-label">{cat}</div>
            <div className="picker__grid">
              {items.map((s) => (
                <SpreadTile
                  key={s.id}
                  spread={s}
                  active={selectedSpread.id === s.id}
                  onClick={() => pickSpread(s)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Bàn trống / tự do */}
        <div className="picker__group">
          <div className="picker__group-label">{FREE_SPREAD.category}</div>
          <div
            className={`spread-tile spread-tile--free ${isFree ? 'is-active' : ''}`}
            onClick={() => pickFree(freeCount)}
          >
            <div className="spread-tile__top">
              <span className="spread-tile__name">{FREE_SPREAD.name}</span>
              <span className="spread-tile__count">{freeCount} lá</span>
            </div>
            <p className="spread-tile__sub">{FREE_SPREAD.subtitle}</p>
            {isFree && (
              <div className="free-stepper" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => pickFree(freeCount - 1)}
                  disabled={freeCount <= FREE_SPREAD.minCards}
                  aria-label="Bớt một lá"
                >
                  −
                </button>
                <b>{freeCount}</b>
                <button
                  type="button"
                  onClick={() => pickFree(freeCount + 1)}
                  disabled={freeCount >= FREE_SPREAD.maxCards}
                  aria-label="Thêm một lá"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thanh bắt đầu */}
      <footer className="picker__footer">
        <div className="picker__summary">
          <b>{selectedSpread.name}</b>
          <span>
            · {spreadCardCount(selectedSpread)} lá · {selectedTheme.label}
          </span>
        </div>
        <div className="picker__start">
          <button
            className="btn-gold"
            type="button"
            onClick={() => onStart('hand')}
            disabled={busy}
          >
            {busy ? <span className="spinner" /> : null}
            {busy ? 'Đang chuẩn bị…' : 'Bắt đầu bằng camera'}
          </button>
          <button
            className="btn-ghost-gold"
            type="button"
            onClick={() => onStart('mouse')}
            disabled={busy}
          >
            Dùng chuột
          </button>
        </div>
        {statusText && <div className="picker__status">{statusText}</div>}
      </footer>
    </section>
  )
}

function SpreadTile({ spread, active, onClick }) {
  return (
    <button
      type="button"
      className={`spread-tile ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      <div className="spread-tile__top">
        <span className="spread-tile__name">{spread.name}</span>
        <span className="spread-tile__count">{spread.positions.length} lá</span>
      </div>
      <p className="spread-tile__sub">{spread.subtitle}</p>
      <MiniLayout spread={spread} />
    </button>
  )
}

/* Sơ đồ thu nhỏ minh hoạ vị trí các lá (theo layout). */
function MiniLayout({ spread }) {
  const n = spread.positions.length
  if (spread.layout === 'cross' || spread.layout === 'pentagram') {
    return (
      <div className="mini mini--abs">
        {spread.positions.map((p, i) => (
          <span
            key={i}
            className="mini__dot"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        ))}
      </div>
    )
  }
  return (
    <div className={`mini ${spread.layout === 'grid' ? 'mini--grid' : 'mini--row'}`}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="mini__cell" />
      ))}
    </div>
  )
}
