/* Thanh điều hướng dạng "đảo" pill nổi — đúng đặc trưng design system:
   nền tối Graphite Night, bo tròn ~50px, đổ bóng nhẹ, căn giữa. */

const STATUS_TEXT = {
  idle: 'Camera chưa bật',
  loading: 'Đang tải mô hình…',
  requesting: 'Đang xin quyền…',
  ready: 'Đã sẵn sàng',
  denied: 'Bị từ chối camera',
  error: 'Lỗi camera',
}

export default function PillNav({
  phase,
  inputMode,
  handStatus,
  handPresent,
  showCamera,
  onToggleCamera,
  onHome,
}) {
  const statusLabel =
    inputMode === 'mouse'
      ? 'Chế độ chuột'
      : handStatus === 'ready' && handPresent
        ? 'Thấy bàn tay'
        : STATUS_TEXT[handStatus] || ''
  const dotState =
    inputMode === 'mouse' ? 'ready' : handPresent ? 'ready' : handStatus

  return (
    <nav className="pill-nav" aria-label="Điều hướng">
      <span className="pill-nav__brand">
        <svg className="pill-nav__mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 3a9 9 0 0 0 0 18 6 6 0 0 1 0-18Z" fill="currentColor" opacity="0.9" />
        </svg>
        Taro
      </span>

      {phase !== 'welcome' && (
        <>
          <span className="pill-nav__divider" />
          <span className="pill-nav__status">
            <span className="pill-nav__dot" data-state={dotState} />
            {statusLabel}
          </span>

          {inputMode === 'hand' && handStatus === 'ready' && (
            <button className="pill-nav__btn" onClick={onToggleCamera} type="button">
              {showCamera ? 'Ẩn camera' : 'Hiện camera'}
            </button>
          )}

          <button className="pill-nav__btn" onClick={onHome} type="button">
            Trang đầu
          </button>
        </>
      )}
    </nav>
  )
}
