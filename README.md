# Taro — Trải bài tarot bằng cử chỉ tay

Web app trải bài tarot điều khiển bằng **cử chỉ tay qua camera** (MediaPipe Hand
Landmarker), giao diện editorial frosted-glass theo design system *General
Intelligence Company*. Chạy hoàn toàn client-side — deploy được lên GitHub Pages.

## Tính năng

- **Nhận diện tay (MediaPipe):** webcam → track bàn tay → con trỏ ảo theo ngón trỏ.
- **Chụm ngón để chọn:** chụm ngón cái + ngón trỏ = "chạm" chọn lá bài.
- **Chế độ chuột dự phòng:** không có/không cho camera vẫn chơi được bằng chuột/cảm ứng.
- **Luồng SPA:** Chào & cấp quyền → Trải bài (chọn 3/3) → Luận giải → Trải lại.
- **Bộ bài 78 lá** đồ họa thật (Korean Rider–Waite) + nghĩa xuôi/ngược tiếng Việt.
- **Carousel 3D panorama** nhìn từ tâm: vòng bài quay quanh người xem, nghiêng tay/di
  chuột (càng lệch càng nhanh) để xoay, chụm ngón/bấm để rút lá ở chính giữa.
- **12+ kiểu trải bài** (1/3/4/5/6 lá, **Celtic Cross** 10 lá, Ngũ giác, SWOT, Tứ đại…)
  + **bàn trống tự do** + **5 chủ đề** (Tình yêu/Sự nghiệp/Sáng tạo/Nhà cửa/Tổng quan).
  Màn kết quả render theo layout: *flow* (hàng/lưới) hoặc *board* (đặt theo toạ độ).
- **Nền vũ trụ bụi sao vàng** + VFX bling: tia sáng chiếu rọi, glow quanh lá, lật so le.
- **Tối ưu hiệu năng:** con trỏ tay đọc qua ref (không re-render mỗi frame), camera
  640×480, bỏ blur video — mượt cả khi bật camera.

## Ảnh bài (asset pipeline)

Ảnh đã nén sẵn nằm trong `public/cards/` (`00.jpg`–`77.jpg` + `back.jpg`, ~7MB).
Để tái tạo từ ảnh gốc: giải nén các bộ vào `_assets_raw/` rồi chạy:

```bash
node scripts/build-cards.mjs   # resize về max 620px, jpeg q82 (cần devDep `sharp`)
```

Chỉ số ảnh toàn cục: `00–21` Major · `22–35` Wands · `36–49` Cups · `50–63` Swords
· `64–77` Pentacles. Bộ Korean dùng hệ số cũ (**Justice=8, Strength=11**) nên hai lá
này được gán đè `img` trong [cards.js](src/data/cards.js) cho khớp ảnh.

## Chạy dự án

```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # build production vào dist/
npm run preview  # xem thử bản build
```

> Camera yêu cầu **HTTPS** hoặc **localhost**. `npm run dev` chạy trên localhost
> nên dùng được camera ngay.

## Cấu trúc

```
src/
  data/cards.js              78 lá tarot + hàm rút bài
  hooks/useHandTracking.js   webcam + MediaPipe + phát hiện chụm ngón
  context/ReadingContext.jsx state kết quả trải bài (sẵn cho Journal sau này)
  components/                PillNav, Background, CameraFeed, VirtualCursor, TarotCard
  screens/                   WelcomeScreen, SpreadScreen, ReadingScreen
  styles/                    tokens.css (design system) + global/app/cards/screens
  App.jsx                    state machine + con trỏ hợp nhất (tay/chuột)
```

## Hướng mở rộng (theo Moonlight)

Kiến trúc đã tách lớp sẵn để bổ sung dần: Daily Spread, Journal (lịch sử trải
bài), thư viện tra cứu 78 lá, phòng realtime (Socket.io/WebRTC). `ReadingContext`
là điểm khởi đầu để lưu lịch sử.

## Công nghệ

React 18 · Vite 5 · @mediapipe/tasks-vision · CSS thuần (design tokens).
