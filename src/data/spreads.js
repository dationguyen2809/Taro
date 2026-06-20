/* ============================================================
   Thư viện kiểu trải bài (Tarot spreads)
   Mỗi spread:
     { id, name, subtitle, category, layout, positions:[...] }
   - layout: 'row' | 'grid' | 'cross' | 'pentagram'
       row/grid → xếp theo dòng/lưới (linh hoạt số lá).
       cross/pentagram → xếp tuyệt đối theo toạ độ % (x,y[,rotate]).
   - position: { key, label, hint, x?, y?, rotate? }
   - cardCount suy ra từ positions.length (trừ free-form).
   Nguồn cảm hứng: số học, hình học thiêng, chiêm tinh, tâm lý,
   logic giải quyết vấn đề (xem ghi chú từng nhóm).
   ============================================================ */

export const SPREADS = [
  // ---------- 1 lá ----------
  {
    id: 'daily-1',
    name: 'Lá bài hôm nay',
    subtitle: 'Một thông điệp ngắn cho ngày mới',
    category: 'Cơ bản',
    layout: 'row',
    positions: [
      { key: 'today', label: 'Thông điệp', hint: 'Điều bạn cần lưu tâm hôm nay' },
    ],
  },

  // ---------- 3 lá (số 3: thời gian & chuyển dịch) ----------
  {
    id: 'ppf-3',
    name: 'Quá khứ · Hiện tại · Tương lai',
    subtitle: 'Trải bài 3 lá kinh điển theo dòng thời gian',
    category: 'Cơ bản',
    layout: 'row',
    positions: [
      { key: 'past', label: 'Quá khứ', hint: 'Nền tảng đã dẫn bạn tới đây' },
      { key: 'present', label: 'Hiện tại', hint: 'Năng lượng đang bao quanh bạn' },
      { key: 'future', label: 'Tương lai', hint: 'Hướng đi đang mở ra phía trước' },
    ],
  },
  {
    id: 'mbs-3',
    name: 'Thân · Tâm · Trí',
    subtitle: 'Cân bằng cơ thể, cảm xúc và lý trí',
    category: 'Cơ bản',
    layout: 'row',
    positions: [
      { key: 'body', label: 'Thân', hint: 'Trạng thái cơ thể, sức khoẻ, hành động' },
      { key: 'heart', label: 'Tâm', hint: 'Cảm xúc và đời sống tình cảm' },
      { key: 'mind', label: 'Trí', hint: 'Suy nghĩ và niềm tin chi phối' },
    ],
  },
  {
    id: 'situation-3',
    name: 'Tình huống · Hành động · Kết quả',
    subtitle: 'Bóc tách một vấn đề theo nhân quả',
    category: 'Cơ bản',
    layout: 'row',
    positions: [
      { key: 'situation', label: 'Tình huống', hint: 'Bản chất cốt lõi lúc này' },
      { key: 'action', label: 'Hành động', hint: 'Việc nên làm / năng lượng cần dùng' },
      { key: 'outcome', label: 'Kết quả', hint: 'Xu hướng nếu đi theo hướng đó' },
    ],
  },

  // ---------- 4 lá (số 4: ổn định, vật chất) ----------
  {
    id: 'elements-4',
    name: 'Tứ đại nguyên tố',
    subtitle: 'Đất · Nước · Khí · Lửa — bốn mặt của vấn đề',
    category: 'Nâng cao',
    layout: 'grid',
    positions: [
      { key: 'earth', label: 'Đất', hint: 'Vật chất, tài chính, nền tảng thực tế' },
      { key: 'water', label: 'Nước', hint: 'Cảm xúc, các mối quan hệ' },
      { key: 'air', label: 'Khí', hint: 'Suy nghĩ, giao tiếp, kế hoạch' },
      { key: 'fire', label: 'Lửa', hint: 'Đam mê, ý chí, hành động' },
    ],
  },
  {
    id: 'swot-4',
    name: 'SWOT',
    subtitle: 'Điểm mạnh · Yếu · Cơ hội · Thách thức',
    category: 'Nâng cao',
    layout: 'grid',
    positions: [
      { key: 'strength', label: 'Điểm mạnh', hint: 'Lợi thế bạn đang nắm' },
      { key: 'weakness', label: 'Điểm yếu', hint: 'Điều cần lưu ý ở bản thân' },
      { key: 'opportunity', label: 'Cơ hội', hint: 'Khả năng đang mở ra' },
      { key: 'threat', label: 'Thách thức', hint: 'Rào cản cần vượt qua' },
    ],
  },

  // ---------- 5 lá (số 5: thay đổi, vượt thoát) ----------
  {
    id: 'pentagram-5',
    name: 'Ngũ giác (Pentagram)',
    subtitle: 'Bốn yếu tố vật chất quy về đỉnh Tinh thần',
    category: 'Nâng cao',
    layout: 'pentagram',
    positions: [
      { key: 'spirit', label: 'Tinh thần', hint: 'Cốt lõi / lối thoát', x: 50, y: 8 },
      { key: 'air', label: 'Khí', hint: 'Tư duy, kế hoạch', x: 90, y: 40 },
      { key: 'fire', label: 'Lửa', hint: 'Ý chí, hành động', x: 74, y: 90 },
      { key: 'water', label: 'Nước', hint: 'Cảm xúc', x: 26, y: 90 },
      { key: 'earth', label: 'Đất', hint: 'Thực tế, vật chất', x: 10, y: 40 },
    ],
  },
  {
    id: 'problem-5',
    name: 'Giải quyết vấn đề',
    subtitle: 'Hiện trạng → Tác động → Tiềm năng → Giải pháp → Kết quả',
    category: 'Nâng cao',
    layout: 'row',
    positions: [
      { key: 'now', label: 'Hiện trạng', hint: 'Năng lượng cốt lõi lúc này' },
      { key: 'cause', label: 'Tác động', hint: 'Nguyên nhân / rào cản' },
      { key: 'potential', label: 'Tiềm năng', hint: 'Hướng phát triển nếu giữ nguyên' },
      { key: 'advice', label: 'Giải pháp', hint: 'Lời khuyên hành động' },
      { key: 'result', label: 'Kết quả', hint: 'Đích đến khả dĩ' },
    ],
  },
  {
    id: 'relationship-5',
    name: 'Tình yêu 5 lá',
    subtitle: 'Soi chiếu một mối quan hệ',
    category: 'Chủ đề',
    layout: 'row',
    positions: [
      { key: 'you', label: 'Bạn', hint: 'Năng lượng của bạn trong mối quan hệ' },
      { key: 'them', label: 'Đối phương', hint: 'Năng lượng của người kia' },
      { key: 'bond', label: 'Nền tảng', hint: 'Điều gắn kết hai người' },
      { key: 'challenge', label: 'Thử thách', hint: 'Mâu thuẫn / điều cần vượt qua' },
      { key: 'direction', label: 'Hướng đi', hint: 'Xu hướng sắp tới' },
    ],
  },

  // ---------- 6 lá: sự nghiệp ----------
  {
    id: 'career-6',
    name: 'Sự nghiệp 6 lá',
    subtitle: 'Định hướng công việc và phát triển',
    category: 'Chủ đề',
    layout: 'grid',
    positions: [
      { key: 'current', label: 'Hiện tại', hint: 'Tình hình công việc lúc này' },
      { key: 'obstacle', label: 'Trở ngại', hint: 'Rào cản lớn nhất' },
      { key: 'strength', label: 'Thế mạnh', hint: 'Lợi thế của bạn' },
      { key: 'growth', label: 'Cần cải thiện', hint: 'Kỹ năng nên tập trung' },
      { key: 'chance', label: 'Cơ hội', hint: 'Khả năng thăng tiến sắp tới' },
      { key: 'outcome', label: 'Kết quả', hint: 'Xu hướng trong vài tháng tới' },
    ],
  },

  // ---------- 10 lá: Celtic Cross (hình học thiêng) ----------
  {
    id: 'celtic-cross-10',
    name: 'Thập tự Celtic',
    subtitle: 'Trải bài 10 lá nổi tiếng của A. E. Waite (1911)',
    category: 'Chuyên sâu',
    layout: 'cross',
    positions: [
      { key: 'heart', label: '1. Hiện tại', hint: 'Trọng tâm vấn đề', x: 28, y: 50 },
      { key: 'cross', label: '2. Thử thách', hint: 'Điều cản trở/hỗ trợ', x: 28, y: 50, rotate: 90 },
      { key: 'foundation', label: '3. Nền tảng', hint: 'Gốc rễ quá khứ xa', x: 28, y: 83 },
      { key: 'past', label: '4. Vừa qua', hint: 'Điều đang rời đi', x: 9, y: 50 },
      { key: 'crown', label: '5. Mục tiêu', hint: 'Điều hướng tới', x: 28, y: 17 },
      { key: 'future', label: '6. Sắp tới', hint: 'Điều đang đến gần', x: 47, y: 50 },
      { key: 'self', label: '7. Bản thân', hint: 'Thái độ của bạn', x: 82, y: 86 },
      { key: 'environment', label: '8. Xung quanh', hint: 'Ảnh hưởng bên ngoài', x: 82, y: 62 },
      { key: 'hopes', label: '9. Hi vọng/Sợ hãi', hint: 'Nội tâm bạn', x: 82, y: 38 },
      { key: 'outcome', label: '10. Kết cục', hint: 'Đỉnh điểm khả dĩ', x: 82, y: 14 },
    ],
  },
]

/* Bàn trống / tự do — số lá tuỳ chọn (sinh positions động). */
export const FREE_SPREAD = {
  id: 'free',
  name: 'Bàn trống (tự do)',
  subtitle: 'Tự chọn số lá và đọc theo trực giác',
  category: 'Tự do',
  layout: 'row',
  free: true,
  minCards: 1,
  maxCards: 7,
  defaultCards: 4,
}

export function makeFreeSpread(count) {
  const n = Math.max(FREE_SPREAD.minCards, Math.min(FREE_SPREAD.maxCards, count))
  return {
    ...FREE_SPREAD,
    positions: Array.from({ length: n }, (_, i) => ({
      key: `card-${i + 1}`,
      label: `Lá ${i + 1}`,
      hint: 'Đọc theo trực giác của bạn',
    })),
  }
}

export const ALL_SPREADS = [...SPREADS, FREE_SPREAD]

export function getSpread(id) {
  return ALL_SPREADS.find((s) => s.id === id) || SPREADS[1] // mặc định: 3 lá
}

export function spreadCardCount(spread) {
  return spread?.positions?.length ?? spread?.defaultCards ?? 3
}
