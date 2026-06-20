import '../styles/screens.css'

/* Màn chào — frosted hero card giới thiệu, dẫn sang màn chọn kiểu trải bài. */
export default function WelcomeScreen({ onContinue }) {
  return (
    <section className="screen welcome">
      <div className="frosted-hero">
        <span className="frosted-hero__eyebrow">
          <span className="pill-nav__dot" data-state="ready" />
          Trải bài bằng cử chỉ
        </span>
        <h1>
          Đưa tay lên trước camera để <em>lắng nghe</em> các lá bài.
        </h1>
        <p>
          Không cần chạm. Di chuyển bàn tay để xoay vòng bài, chụm ngón cái và
          ngón trỏ để rút những lá dành cho bạn — hoặc dùng chuột nếu muốn.
        </p>

        <div className="frosted-hero__actions">
          <button className="btn-primary" type="button" onClick={onContinue}>
            Chọn kiểu trải bài
            <Arrow />
          </button>
        </div>

        <ul className="frosted-hero__steps">
          <li>
            <b>1.</b> Chọn kiểu trải bài và chủ đề bạn muốn hỏi.
          </li>
          <li>
            <b>2.</b> Xoay vòng bài bằng tay (hoặc chuột) tới lá ở giữa.
          </li>
          <li>
            <b>3.</b> Chụm ngón / bấm để rút đủ số lá, rồi đọc luận giải.
          </li>
        </ul>
      </div>
    </section>
  )
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
