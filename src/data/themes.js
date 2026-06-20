/* Chủ đề xem bài — đổi "lăng kính" luận giải. Giữ tinh thần câu hỏi mở
   (định hướng / thấu hiểu bản thân), tránh dự đoán y tế/pháp lý/tài chính. */
export const THEMES = [
  {
    id: 'general',
    label: 'Tổng quan',
    emoji: '🌙',
    framing: 'Điều bạn cần nhìn thấy rõ ngay lúc này.',
  },
  {
    id: 'love',
    label: 'Tình yêu & Mối quan hệ',
    emoji: '💞',
    framing: 'Cách năng lượng này thể hiện trong tình cảm và sự kết nối.',
  },
  {
    id: 'work',
    label: 'Công việc & Sự nghiệp',
    emoji: '💼',
    framing: 'Định hướng, thách thức và cơ hội trong công việc.',
  },
  {
    id: 'creativity',
    label: 'Sáng tạo',
    emoji: '🎨',
    framing: 'Nguồn cảm hứng và cách khơi thông rào cản tư duy.',
  },
  {
    id: 'home',
    label: 'Nhà cửa & Đời sống',
    emoji: '🏡',
    framing: 'Không gian sống, năng lượng gia đình và sự ổn định.',
  },
]

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0]
}
