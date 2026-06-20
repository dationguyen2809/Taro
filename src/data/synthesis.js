/* Tổng hợp luận giải — sinh một đoạn "đọc tổng thể" nối các lá lại với nhau
   theo câu hỏi + chủ đề + kiểu trải bài. Hoàn toàn client-side (không gọi AI),
   dựa trên từ khoá & trạng thái xuôi/ngược của các lá đã rút. */

function shortName(c) {
  return c.name.split(' — ')[1] || c.name
}
function kw(c, n = 2) {
  return (c.keywords || []).slice(0, n).join(' và ')
}

export function buildSynthesis(reading, spread, theme, question) {
  if (!reading?.length) return null
  const n = reading.length
  const positions = spread?.positions ?? []
  const posLabel = (i) => positions[i]?.label ?? `Lá ${i + 1}`
  const reversed = reading.filter((c) => c.isReversed)
  const majors = reading.filter((c) => c.arcana === 'major')
  const first = reading[0]
  const last = reading[n - 1]
  const heavyReversed = reversed.length > n / 2

  const q = question?.trim()
  const lines = []

  // Mở đầu
  if (q) {
    lines.push(
      `Với câu hỏi "${q}", trải bài ${spread.name} mở ra một bức tranh ${
        heavyReversed
          ? 'còn nhiều điều cần soi lại bên trong'
          : 'với dòng năng lượng khá rõ ràng'
      }.`
    )
  } else {
    lines.push(
      `Theo lăng kính ${theme?.label?.toLowerCase() || 'tổng quan'}, trải bài ${
        spread.name
      } cho thấy ${
        heavyReversed
          ? 'một vài khía cạnh đang chờ được điều chỉnh'
          : 'một mạch chuyển động tương đối thuận'
      }.`
    )
  }

  // Điểm khởi
  lines.push(
    `Ở vị trí "${posLabel(0)}", ${shortName(first)}${
      first.isReversed ? ' (ngược)' : ''
    } là điểm khởi — nói về ${kw(first)}.`
  )

  // Hướng tới / kết
  if (n > 1) {
    lines.push(
      `Hướng tới "${posLabel(n - 1)}", ${shortName(last)}${
        last.isReversed ? ' (ngược)' : ''
      } gợi ý ${kw(last)}.`
    )
  }

  // Ẩn Chính
  if (majors.length) {
    lines.push(
      `Sự xuất hiện của ${majors.length} lá Ẩn Chính (${majors
        .map((m) => shortName(m))
        .join(', ')}) cho thấy đây là những chuyển động mang tính bước ngoặt, đáng để bạn lưu tâm.`
    )
  }

  // Lá ngược
  if (reversed.length) {
    lines.push(
      `Hãy chú ý ${reversed.length} lá ngược — chúng nhắc bạn ${
        reversed.length > 1 ? 'một vài điểm' : 'một điểm'
      } cần nhìn lại, điều chỉnh hoặc buông bớt.`
    )
  }

  // Kết
  lines.push(
    `Tổng thể, hãy đọc ${n} lá như một dòng chảy liên tục thay vì tách rời, và để trực giác của bạn nối chúng lại với điều bạn đang quan tâm.`
  )

  const takeaways = [
    ...new Set(reading.flatMap((c) => c.keywords || []).filter(Boolean)),
  ].slice(0, 6)

  return { text: lines.join(' '), takeaways }
}
