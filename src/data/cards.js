/* ============================================================
   Bộ bài Tarot 78 lá — dữ liệu tiếng Việt
   - 22 lá Ẩn Chính (Major Arcana): viết chi tiết.
   - 56 lá Ẩn Phụ (Minor Arcana): sinh từ chủ đề của 4 chất
     (Wands/Cups/Swords/Pentacles) kết hợp ý nghĩa cấp bậc.
   Mỗi lá: { id, name, arcana, suit?, number, keywords, upright, reversed }
   ============================================================ */

export const MAJOR_ARCANA = [
  {
    id: 'major-00',
    name: 'The Fool — Gã Khờ',
    number: 0,
    keywords: ['khởi đầu', 'tự do', 'phiêu lưu', 'ngây thơ'],
    upright:
      'Một khởi đầu mới mẻ đầy tự do. Hãy nhảy vào hành trình với tâm thế cởi mở, tin vào vũ trụ và bước đi nhẹ nhõm không vướng bận.',
    reversed:
      'Sự liều lĩnh thiếu cân nhắc hoặc nỗi sợ thay đổi. Bạn có thể đang chần chừ hoặc hành động bốc đồng mà chưa nhìn rõ đường đi.',
  },
  {
    id: 'major-01',
    name: 'The Magician — Nhà Ảo Thuật',
    number: 1,
    keywords: ['ý chí', 'sáng tạo', 'biểu hiện', 'kỹ năng'],
    upright:
      'Bạn có đủ công cụ và năng lực để biến ý tưởng thành hiện thực. Đây là lúc tập trung ý chí và hành động một cách chủ động.',
    reversed:
      'Tiềm năng bị lãng phí, thao túng hoặc thiếu tự tin. Năng lượng đang phân tán, mục tiêu chưa rõ ràng.',
  },
  {
    id: 'major-02',
    name: 'The High Priestess — Nữ Tư Tế',
    number: 2,
    keywords: ['trực giác', 'tiềm thức', 'bí ẩn', 'tĩnh lặng'],
    upright:
      'Hãy lắng nghe trực giác và tiếng nói nội tâm. Câu trả lời nằm bên trong, trong sự tĩnh lặng và quan sát.',
    reversed:
      'Mất kết nối với trực giác, bị lý trí lấn át hoặc che giấu điều gì đó. Bạn đang phớt lờ tín hiệu bên trong.',
  },
  {
    id: 'major-03',
    name: 'The Empress — Nữ Hoàng',
    number: 3,
    keywords: ['nuôi dưỡng', 'phong nhiêu', 'vẻ đẹp', 'sáng tạo'],
    upright:
      'Sự sung túc, sáng tạo và nuôi dưỡng nở rộ. Đây là thời điểm của tình yêu, vẻ đẹp và những thành quả đang lớn dần.',
    reversed:
      'Tắc nghẽn sáng tạo, phụ thuộc hoặc bỏ bê việc chăm sóc bản thân. Năng lượng nuôi dưỡng đang mất cân bằng.',
  },
  {
    id: 'major-04',
    name: 'The Emperor — Hoàng Đế',
    number: 4,
    keywords: ['quyền lực', 'cấu trúc', 'kỷ luật', 'ổn định'],
    upright:
      'Sự ổn định đến từ cấu trúc, kỷ luật và khả năng lãnh đạo. Hãy thiết lập trật tự và nắm quyền kiểm soát tình hình.',
    reversed:
      'Sự kiểm soát thái quá, cứng nhắc hoặc thiếu kỷ luật. Quyền lực bị lạm dụng hoặc vắng mặt khi cần.',
  },
  {
    id: 'major-05',
    name: 'The Hierophant — Giáo Hoàng',
    number: 5,
    keywords: ['truyền thống', 'niềm tin', 'dẫn dắt', 'học hỏi'],
    upright:
      'Tìm đến truyền thống, người thầy hoặc hệ giá trị đã được kiểm chứng. Sự dẫn dắt và học hỏi mang lại nền tảng vững.',
    reversed:
      'Phá vỡ khuôn mẫu, nổi loạn với quy ước hoặc giáo điều gò bó. Bạn cần tìm con đường của riêng mình.',
  },
  {
    id: 'major-06',
    name: 'The Lovers — Tình Nhân',
    number: 6,
    keywords: ['tình yêu', 'lựa chọn', 'hòa hợp', 'giá trị'],
    upright:
      'Một mối liên kết sâu sắc hoặc một lựa chọn quan trọng theo tiếng gọi con tim. Sự hòa hợp đến khi bạn sống đúng giá trị mình.',
    reversed:
      'Bất hòa, lựa chọn sai lệch hoặc mất cân bằng trong mối quan hệ. Có sự giằng co giữa mong muốn và trách nhiệm.',
  },
  {
    id: 'major-07',
    name: 'The Chariot — Cỗ Xe',
    number: 7,
    keywords: ['quyết tâm', 'chiến thắng', 'ý chí', 'kiểm soát'],
    upright:
      'Chiến thắng nhờ quyết tâm và sự tập trung. Hãy nắm chặt dây cương, hướng ý chí về một mục tiêu duy nhất và tiến lên.',
    reversed:
      'Mất phương hướng, thiếu tự chủ hoặc bị các lực đối nghịch kéo lệch. Bạn cần lấy lại sự kiểm soát.',
  },
  {
    id: 'major-08',
    name: 'Strength — Sức Mạnh',
    number: 8,
    // Bộ Korean Rider–Waite dùng hệ đánh số cũ (Justice=8, Strength=11),
    // nên ảnh của Strength nằm ở 11.jpg và Justice ở 08.jpg.
    img: 11,
    keywords: ['can đảm', 'kiên nhẫn', 'dịu dàng', 'nội lực'],
    upright:
      'Sức mạnh thật sự đến từ sự dịu dàng, lòng can đảm và kiên nhẫn. Bạn chế ngự khó khăn bằng nội lực chứ không bằng vũ lực.',
    reversed:
      'Nghi ngờ bản thân, mất kiên nhẫn hoặc để cảm xúc lấn át. Nội lực đang bị bào mòn.',
  },
  {
    id: 'major-09',
    name: 'The Hermit — Ẩn Sĩ',
    number: 9,
    keywords: ['nội quan', 'tìm kiếm', 'cô độc', 'trí tuệ'],
    upright:
      'Một giai đoạn lui về bên trong để soi sáng câu hỏi của mình. Sự cô tịch mang lại trí tuệ và câu trả lời sâu sắc.',
    reversed:
      'Cô lập quá mức, lạc lối hoặc né tránh thế giới. Bạn cần kết nối lại thay vì rút lui hoàn toàn.',
  },
  {
    id: 'major-10',
    name: 'Wheel of Fortune — Bánh Xe Số Phận',
    number: 10,
    keywords: ['chu kỳ', 'vận may', 'bước ngoặt', 'định mệnh'],
    upright:
      'Bánh xe vận mệnh đang xoay theo hướng có lợi. Một bước ngoặt, một cơ hội mới đến đúng lúc — hãy đón nhận dòng chảy.',
    reversed:
      'Vận xui, kháng cự lại thay đổi hoặc cảm giác mọi thứ ngoài tầm kiểm soát. Chu kỳ cũ chưa chịu khép lại.',
  },
  {
    id: 'major-11',
    name: 'Justice — Công Lý',
    number: 11,
    img: 8, // xem ghi chú ở lá Strength
    keywords: ['công bằng', 'sự thật', 'nhân quả', 'trách nhiệm'],
    upright:
      'Sự thật và công bằng sẽ được phân định. Mọi hành động đều có hệ quả — hãy hành động ngay thẳng và chịu trách nhiệm.',
    reversed:
      'Bất công, trốn tránh trách nhiệm hoặc thiên vị. Có điều gì đó chưa được nhìn nhận thẳng thắn.',
  },
  {
    id: 'major-12',
    name: 'The Hanged Man — Người Treo Ngược',
    number: 12,
    keywords: ['buông bỏ', 'góc nhìn mới', 'tạm dừng', 'hi sinh'],
    upright:
      'Một khoảng dừng cần thiết để nhìn mọi thứ bằng góc nhìn khác. Buông bỏ kiểm soát đôi khi là cách tiến lên.',
    reversed:
      'Trì hoãn vô ích, mắc kẹt hoặc hi sinh mà không đem lại ý nghĩa. Đã đến lúc hành động trở lại.',
  },
  {
    id: 'major-13',
    name: 'Death — Cái Chết',
    number: 13,
    keywords: ['kết thúc', 'chuyển hóa', 'tái sinh', 'buông'],
    upright:
      'Một chương khép lại để chương mới mở ra. Đây là sự chuyển hóa sâu sắc — hãy để cái cũ ra đi để được tái sinh.',
    reversed:
      'Cưỡng lại thay đổi tất yếu, bám víu vào quá khứ. Sự chuyển hóa bị trì hoãn khiến bạn mắc kẹt.',
  },
  {
    id: 'major-14',
    name: 'Temperance — Tiết Độ',
    number: 14,
    keywords: ['cân bằng', 'điều hòa', 'kiên nhẫn', 'dung hòa'],
    upright:
      'Sự cân bằng và điều độ mang lại bình an. Hãy dung hòa các thái cực, kiên nhẫn pha trộn đúng liều lượng cho cuộc sống.',
    reversed:
      'Mất cân bằng, thái quá hoặc thiếu kiên nhẫn. Các phần trong cuộc sống đang xung đột với nhau.',
  },
  {
    id: 'major-15',
    name: 'The Devil — Ác Quỷ',
    number: 15,
    keywords: ['ràng buộc', 'cám dỗ', 'phụ thuộc', 'bóng tối'],
    upright:
      'Bạn đang bị trói buộc bởi cám dỗ, thói quen hoặc nỗi sợ. Hãy nhận ra xiềng xích này phần lớn là tự nguyện và có thể tháo gỡ.',
    reversed:
      'Giải phóng khỏi ràng buộc, nhận ra sự thật và lấy lại quyền tự do. Bạn đang cắt đứt những gì kìm hãm mình.',
  },
  {
    id: 'major-16',
    name: 'The Tower — Tòa Tháp',
    number: 16,
    keywords: ['biến động', 'đổ vỡ', 'giải phóng', 'sự thật'],
    upright:
      'Một biến động bất ngờ phá vỡ những gì xây trên nền móng giả. Dù chấn động, nó dọn đường cho sự thật và khởi đầu vững hơn.',
    reversed:
      'Né tránh tai họa, trì hoãn sự sụp đổ tất yếu hoặc đau đớn kéo dài. Thay đổi đang bị kìm nén.',
  },
  {
    id: 'major-17',
    name: 'The Star — Ngôi Sao',
    number: 17,
    keywords: ['hi vọng', 'chữa lành', 'cảm hứng', 'thanh thản'],
    upright:
      'Sau giông bão là hi vọng và chữa lành. Hãy tin tưởng vào tương lai — nguồn cảm hứng và sự thanh thản đang trở lại.',
    reversed:
      'Mất niềm tin, nản lòng hoặc cảm thấy lạc lối. Hãy nuôi dưỡng lại hi vọng từ những điều nhỏ.',
  },
  {
    id: 'major-18',
    name: 'The Moon — Mặt Trăng',
    number: 18,
    keywords: ['ảo ảnh', 'tiềm thức', 'mơ hồ', 'sợ hãi'],
    upright:
      'Mọi thứ chưa rõ ràng như vẻ ngoài. Hãy thận trọng với ảo ảnh và lắng nghe giấc mơ cùng trực giác để soi sáng nỗi sợ.',
    reversed:
      'Sương mù đang tan, sự thật dần lộ ra. Bạn vượt qua hoang mang và lo âu để nhìn rõ hơn.',
  },
  {
    id: 'major-19',
    name: 'The Sun — Mặt Trời',
    number: 19,
    keywords: ['niềm vui', 'thành công', 'sức sống', 'rõ ràng'],
    upright:
      'Niềm vui, thành công và sự ấm áp tỏa sáng. Đây là khoảnh khắc rạng rỡ — hãy tận hưởng sức sống và sự rõ ràng.',
    reversed:
      'Niềm vui tạm bị che mờ, lạc quan thái quá hoặc trì hoãn thành công. Ánh sáng vẫn ở đó, chỉ cần kiên nhẫn.',
  },
  {
    id: 'major-20',
    name: 'Judgement — Phán Xét',
    number: 20,
    keywords: ['thức tỉnh', 'tha thứ', 'tái sinh', 'quyết định'],
    upright:
      'Một sự thức tỉnh và lời mời bước sang chương mới. Hãy nhìn lại, tha thứ và đáp lại tiếng gọi cao hơn của chính mình.',
    reversed:
      'Tự phán xét gay gắt, chối bỏ tiếng gọi hoặc trốn tránh bài học. Bạn đang chần chừ trước một quyết định lớn.',
  },
  {
    id: 'major-21',
    name: 'The World — Thế Giới',
    number: 21,
    keywords: ['hoàn thành', 'viên mãn', 'trọn vẹn', 'thành tựu'],
    upright:
      'Một chu kỳ hoàn tất trọn vẹn và viên mãn. Bạn đã đạt được điều mình theo đuổi — hãy ăn mừng và bước vào hành trình mới.',
    reversed:
      'Việc còn dang dở, thiếu khép kín hoặc mục tiêu trì hoãn. Một mảnh ghép cuối cùng vẫn đang chờ.',
  },
]

/* ---------- Ẩn Phụ (Minor Arcana) ---------- */
const SUITS = [
  {
    suit: 'wands',
    label: 'Gậy',
    theme: 'đam mê, hành động, sáng tạo và ý chí',
    upright: 'năng lượng, cảm hứng và động lực tiến tới',
    reversed: 'sự trì trệ, nóng vội hoặc cạn kiệt nhiệt huyết',
  },
  {
    suit: 'cups',
    label: 'Cốc',
    theme: 'cảm xúc, tình yêu, mối quan hệ và trực giác',
    upright: 'sự kết nối, đồng cảm và đời sống nội tâm phong phú',
    reversed: 'tổn thương cảm xúc, xa cách hoặc mất cân bằng tình cảm',
  },
  {
    suit: 'swords',
    label: 'Kiếm',
    theme: 'lý trí, suy nghĩ, sự thật và xung đột',
    upright: 'sự minh bạch, quyết đoán và sức mạnh tư duy',
    reversed: 'lo âu, mâu thuẫn hoặc suy nghĩ tiêu cực',
  },
  {
    suit: 'pentacles',
    label: 'Tiền',
    theme: 'vật chất, tài chính, công việc và sự ổn định',
    upright: 'thành quả thực tế, an toàn và phát triển bền vững',
    reversed: 'bất ổn tài chính, trì hoãn hoặc bám víu vật chất',
  },
]

const RANKS = [
  { number: 1, name: 'Ace', label: 'Át', seed: 'hạt mầm khởi đầu thuần khiết của' },
  { number: 2, name: 'Two', label: 'Hai', seed: 'sự cân bằng và lựa chọn trong' },
  { number: 3, name: 'Three', label: 'Ba', seed: 'sự tăng trưởng và hợp tác về' },
  { number: 4, name: 'Four', label: 'Bốn', seed: 'sự ổn định và củng cố trong' },
  { number: 5, name: 'Five', label: 'Năm', seed: 'thử thách và mất mát liên quan đến' },
  { number: 6, name: 'Six', label: 'Sáu', seed: 'sự hồi phục và hài hòa của' },
  { number: 7, name: 'Seven', label: 'Bảy', seed: 'sự đánh giá lại và kiên trì với' },
  { number: 8, name: 'Eight', label: 'Tám', seed: 'chuyển động nhanh và làm chủ về' },
  { number: 9, name: 'Nine', label: 'Chín', seed: 'sự gần hoàn tất và độc lập trong' },
  { number: 10, name: 'Ten', label: 'Mười', seed: 'đỉnh điểm và sự trọn vẹn của' },
  { number: 11, name: 'Page', label: 'Tiểu Đồng', seed: 'tin tức mới và sự học hỏi về' },
  { number: 12, name: 'Knight', label: 'Hiệp Sĩ', seed: 'hành động dấn thân theo đuổi' },
  { number: 13, name: 'Queen', label: 'Nữ Hoàng', seed: 'sự thấu hiểu và làm chủ nội tâm về' },
  { number: 14, name: 'King', label: 'Đức Vua', seed: 'sự dẫn dắt trưởng thành trong' },
]

function buildMinorArcana() {
  const cards = []
  // Chỉ số ảnh toàn cục: Wands 22–35, Cups 36–49, Swords 50–63, Pentacles 64–77.
  // SUITS đang theo đúng thứ tự đó → base = 22 + suitIdx*14.
  SUITS.forEach((s, suitIdx) => {
    for (const r of RANKS) {
      cards.push({
        id: `${s.suit}-${String(r.number).padStart(2, '0')}`,
        name: `${r.name} of ${capitalize(s.suit)} — ${r.label} ${s.label}`,
        arcana: 'minor',
        suit: s.suit,
        suitLabel: s.label,
        number: r.number,
        img: 22 + suitIdx * 14 + (r.number - 1),
        keywords: [s.label, r.label, ...s.theme.split(', ').slice(0, 2)],
        upright: `${capitalize(r.seed)} ${s.theme}. Lá bài gợi ý ${s.upright}.`,
        reversed: `Mặt ngược của ${r.seed} ${s.theme}: ${s.reversed}.`,
      })
    }
  })
  return cards
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const MINOR_ARCANA = buildMinorArcana()

export const TAROT_DECK = [
  // Major: chỉ số ảnh = số lá (0..21), trừ Strength/Justice có img gán đè.
  ...MAJOR_ARCANA.map((c) => ({ ...c, arcana: 'major', img: c.img ?? c.number })),
  ...MINOR_ARCANA,
]

/* ---------- Ảnh bài (bộ Korean Rider–Waite trong /public/cards) ---------- */
const BASE = import.meta.env.BASE_URL // './' (cấu hình ở vite.config)
export const CARD_BACK_URL = `${BASE}cards/back.jpg`

export function cardImageUrl(card) {
  if (!card || card.img == null) return null
  return `${BASE}cards/${String(card.img).padStart(2, '0')}.jpg`
}

/** Trả về `count` lá ngẫu nhiên, mỗi lá kèm hướng (xuôi/ngược). */
export function drawCards(count = 3, deck = TAROT_DECK) {
  const pool = [...deck]
  // Fisher–Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count).map((card) => ({
    ...card,
    isReversed: Math.random() < 0.35, // ~35% khả năng ngược (giữ nguyên text upright/reversed)
  }))
}
