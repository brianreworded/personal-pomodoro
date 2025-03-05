'use client'

import { useEffect } from 'react'
import { useAppState } from './AppProvider'

export const DynamicTitle = () => {
  const { appState } = useAppState()
  const { timerState } = appState
  const { timeLeft, isActive, isCompleted } = timerState
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    let title = 'Pomodoro Wellness App'
    
    if (isActive && timeLeft > 0) {
      title = `(${formatTime(timeLeft)}) Pomodoro Running`
    } else if (isCompleted) {
      title = `✓ Break Time! - Pomodoro Wellness App`
    }
    
    document.title = title
  }, [timeLeft, isActive, isCompleted])

  return null
}

export default DynamicTitle