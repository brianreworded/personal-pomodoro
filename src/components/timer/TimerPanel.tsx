'use client'

import { useState, useEffect, useRef } from 'react'
import useSound from 'use-sound'
import { useTheme } from '@/components/ui/ThemeProvider'
import { useAppState } from '@/components/ui/AppProvider'

interface TimerPanelProps {
  onTimerComplete: () => void
}

const TimerPanel: React.FC<TimerPanelProps> = ({ onTimerComplete }) => {
  const { appState, updateTimerState, setTimerCompleted } = useAppState()
  const { timerState } = appState
  const { timeLeft, duration, isActive } = timerState
  
  const [progress, setProgress] = useState(100)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { colorThemeClasses } = useTheme()
  
  // We'll handle the sound later when we have a proper sound file
  const [playAlarm] = useSound('/sounds/alarm.mp3')
  
  // Initialize progress
  useEffect(() => {
    setProgress((timeLeft / duration) * 100)
  }, [timeLeft, duration])
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        updateTimerState({ timeLeft: timeLeft - 1 })
        setProgress((timeLeft - 1) / duration * 100)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      playAlarm()
      setTimerCompleted(true)
      onTimerComplete()
      updateTimerState({ isActive: false })
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isActive, timeLeft, duration, onTimerComplete, playAlarm, updateTimerState, setTimerCompleted])
  
  const toggleTimer = () => {
    updateTimerState({ isActive: !isActive })
  }
  
  const resetTimer = () => {
    updateTimerState({ 
      isActive: false,
      timeLeft: duration
    })
    setProgress(100)
  }
  
  const changeDuration = (minutes: number) => {
    const newDuration = minutes * 60
    updateTimerState({
      duration: newDuration,
      timeLeft: newDuration,
      isActive: false
    })
    setProgress(100)
  }
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className={`text-xl font-semibold mb-5 ${colorThemeClasses.primary}`}>Pomodoro Timer</h2>
      
      <div className="flex gap-4 mb-6">
        <button 
          className={`px-4 py-2 rounded-md transition-all ${
            duration === 25 * 60 
              ? colorThemeClasses.button 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => changeDuration(25)}
        >
          25 min
        </button>
        <button 
          className={`px-4 py-2 rounded-md transition-all ${
            duration === 50 * 60 
              ? colorThemeClasses.button
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => changeDuration(50)}
        >
          50 min
        </button>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
          <div 
            className={`h-full rounded-full ${colorThemeClasses.progress}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className={`text-4xl font-bold mb-6 ${colorThemeClasses.primary}`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex gap-4">
          <button 
            className={`px-6 py-3 rounded-md transition-all ${colorThemeClasses.button}`}
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimerPanel