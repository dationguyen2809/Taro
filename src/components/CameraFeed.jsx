/* Khung camera mờ ở nền — chỉ để tạo cảm giác hiện diện, không nổi bật.
   videoRef do hook useHandTracking quản lý. */
export default function CameraFeed({ videoRef, visible, active }) {
  return (
    <div className="camera-feed" data-visible={visible && active ? 'true' : 'false'}>
      <video ref={videoRef} muted playsInline aria-hidden="true" />
    </div>
  )
}
