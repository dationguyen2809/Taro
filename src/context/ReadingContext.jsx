import { createContext, useContext, useState, useCallback } from 'react'
import { drawCards } from '../data/cards.js'
import { SPREADS } from '../data/spreads.js'
import { THEMES, getTheme } from '../data/themes.js'

/* Bối cảnh (context) cho phiên trải bài hiện tại:
   - selectedSpread: kiểu trải bài đang dùng
   - selectedTheme: chủ đề (lăng kính luận giải)
   - reading: các lá đã rút (mỗi lá gắn sẵn cờ isReversed)
   Tách riêng để sau này Journal / lịch sử đọc lại dễ dàng. */

const ReadingContext = createContext(null)

// Giữ lại cho tương thích cũ (một số chỗ import) — 3 lá Quá-Hiện-Tương-lai.
export const SPREAD_POSITIONS = [
  { key: 'past', label: 'Quá khứ', hint: 'Nền tảng đã dẫn bạn tới đây' },
  { key: 'present', label: 'Hiện tại', hint: 'Năng lượng đang bao quanh bạn' },
  { key: 'future', label: 'Tương lai', hint: 'Hướng đi đang mở ra phía trước' },
]

export function ReadingProvider({ children }) {
  const [selectedSpread, setSelectedSpread] = useState(SPREADS[1]) // 3 lá mặc định
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0])
  const [question, setQuestion] = useState('')
  const [reading, setReading] = useState([])

  const chooseSpread = useCallback((spread, themeId) => {
    setSelectedSpread(spread)
    if (themeId) setSelectedTheme(getTheme(themeId))
  }, [])

  // Rút sẵn kết quả cho `count` vị trí (chưa lộ cho người dùng).
  const prepareReading = useCallback((count = 3) => {
    setReading(drawCards(count))
  }, [])

  const resetReading = useCallback(() => setReading([]), [])

  return (
    <ReadingContext.Provider
      value={{
        selectedSpread,
        selectedTheme,
        question,
        setQuestion,
        chooseSpread,
        reading,
        prepareReading,
        resetReading,
      }}
    >
      {children}
    </ReadingContext.Provider>
  )
}

export function useReading() {
  const ctx = useContext(ReadingContext)
  if (!ctx) throw new Error('useReading phải nằm trong <ReadingProvider>')
  return ctx
}
