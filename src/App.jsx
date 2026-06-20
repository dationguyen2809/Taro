import { useCallback, useEffect, useRef, useState } from 'react'
import { ReadingProvider, useReading } from './context/ReadingContext.jsx'
import { useHandTracking } from './hooks/useHandTracking.js'
import { spreadCardCount } from './data/spreads.js'
import PillNav from './components/PillNav.jsx'
import Background from './components/Background.jsx'
import VirtualCursor from './components/VirtualCursor.jsx'
import CameraFeed from './components/CameraFeed.jsx'
import WelcomeScreen from './screens/WelcomeScreen.jsx'
import SpreadPicker from './screens/SpreadPicker.jsx'
import SpreadScreen from './screens/SpreadScreen.jsx'
import ReadingScreen from './screens/ReadingScreen.jsx'
import './styles/app.css'

function AppInner() {
  // Luồng SPA: welcome → picker → spread → reading
  const [phase, setPhase] = useState('welcome')
  const [inputMode, setInputMode] = useState('hand') // 'hand' | 'mouse'
  const [showCamera, setShowCamera] = useState(true)

  const {
    reading,
    selectedSpread,
    selectedTheme,
    question,
    setQuestion,
    chooseSpread,
    prepareReading,
    resetReading,
  } = useReading()

  const cardsToPick = spreadCardCount(selectedSpread)

  // ----- Nhận diện tay -----
  const hand = useHandTracking()

  // ----- Con trỏ chuột (ref, không setState mỗi frame) -----
  const mouseCursorRef = useRef(null)
  const [mousePressed, setMousePressed] = useState(false)
  useEffect(() => {
    if (inputMode !== 'mouse') return
    const onMove = (e) => {
      mouseCursorRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    const onDown = () => setMousePressed(true)
    const onUp = () => setMousePressed(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [inputMode])

  // ----- Con trỏ hợp nhất: đọc qua hàm (ref) → không re-render mỗi frame -----
  const inputModeRef = useRef(inputMode)
  inputModeRef.current = inputMode
  const getPointer = useCallback(
    () =>
      inputModeRef.current === 'hand'
        ? hand.cursorRef.current
        : mouseCursorRef.current,
    [hand.cursorRef]
  )
  const pressed = inputMode === 'hand' ? hand.isPinching : mousePressed

  // ----- Bắt đầu phiên sau khi chọn xong spread + chủ đề -----
  const start = useCallback(
    async (mode) => {
      const chosen = mode || inputMode
      setInputMode(chosen)
      prepareReading(spreadCardCount(selectedSpread))
      if (chosen === 'hand') await hand.start()
      setPhase('spread')
    },
    [hand, inputMode, prepareReading, selectedSpread]
  )

  const handleComplete = useCallback(() => setPhase('reading'), [])

  const replay = useCallback(() => {
    resetReading()
    setPhase('picker')
  }, [resetReading])

  const goHome = useCallback(() => {
    hand.stop()
    resetReading()
    setPhase('welcome')
  }, [hand, resetReading])

  return (
    <>
      <Background phase={phase} />

      {inputMode === 'hand' && (
        <CameraFeed
          videoRef={hand.videoRef}
          visible={showCamera && phase === 'spread'}
          active={hand.status === 'ready'}
        />
      )}

      <PillNav
        phase={phase}
        inputMode={inputMode}
        handStatus={hand.status}
        handPresent={hand.handPresent}
        showCamera={showCamera}
        onToggleCamera={() => setShowCamera((v) => !v)}
        onHome={goHome}
      />

      <main className="stage">
        {phase === 'welcome' && (
          <WelcomeScreen onContinue={() => setPhase('picker')} />
        )}

        {phase === 'picker' && (
          <SpreadPicker
            selectedSpread={selectedSpread}
            selectedTheme={selectedTheme}
            question={question}
            onQuestionChange={setQuestion}
            onChoose={chooseSpread}
            onStart={start}
            handStatus={hand.status}
            handError={hand.error}
          />
        )}

        {phase === 'spread' && (
          <SpreadScreen
            reading={reading}
            spread={selectedSpread}
            getPointer={getPointer}
            pressed={pressed}
            inputMode={inputMode}
            handStatus={hand.status}
            handPresent={hand.handPresent}
            cardsToPick={cardsToPick}
            onComplete={handleComplete}
          />
        )}

        {phase === 'reading' && (
          <ReadingScreen
            reading={reading}
            spread={selectedSpread}
            theme={selectedTheme}
            question={question}
            onReplay={replay}
          />
        )}
      </main>

      {phase === 'spread' && (
        <VirtualCursor getPointer={getPointer} pressed={pressed} mode={inputMode} />
      )}
    </>
  )
}

export default function App() {
  return (
    <ReadingProvider>
      <AppInner />
    </ReadingProvider>
  )
}
