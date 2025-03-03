'use client'

import { useEffect } from 'react'
import TimerPanel from '@/components/timer/TimerPanel'
import TaskPanel from '@/components/tasks/TaskPanel'
import WorkoutPanel from '@/components/workout/WorkoutPanel'
import { useTheme } from '@/components/ui/ThemeProvider'
import { useAppState } from '@/components/ui/AppProvider'

export default function Home() {
  const { appState, setTimerCompleted } = useAppState()
  const { timerState } = appState
  const { isCompleted: isTimerCompleted } = timerState
  const { colorThemeClasses } = useTheme()
  
  // This additional useEffect helps ensure state is reloaded when the page becomes visible
  useEffect(() => {
    // This is a no-op but forces React to rerender and pull latest state when visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Force a re-render to get the latest state
        setTimerCompleted(appState.timerState.isCompleted)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [appState.timerState.isCompleted, setTimerCompleted])
  
  const handleTimerComplete = () => {
    setTimerCompleted(true)
  }
  
  const handleNewPomodoroStart = () => {
    // Reset timer completion state to start a new Pomodoro session
    setTimerCompleted(false)
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-6 pt-16">
      <h1 className={`text-3xl font-bold mb-8 ${colorThemeClasses.primary}`}>
        Pomodoro Fitness App
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="space-y-8">
          <TimerPanel onTimerComplete={handleTimerComplete} />
          <TaskPanel />
        </div>
        
        <div>
          <WorkoutPanel 
            isActive={isTimerCompleted} 
            onWorkoutComplete={handleNewPomodoroStart}
          />
        </div>
      </div>
    </main>
  )
}