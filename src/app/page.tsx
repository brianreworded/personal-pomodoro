'use client'

import { useState } from 'react'
import TimerPanel from '@/components/timer/TimerPanel'
import TaskPanel from '@/components/tasks/TaskPanel'
import WorkoutPanel from '@/components/workout/WorkoutPanel'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function Home() {
  const [isTimerCompleted, setIsTimerCompleted] = useState(false)
  const { colorThemeClasses } = useTheme()
  
  const handleTimerComplete = () => {
    setIsTimerCompleted(true)
  }
  
  const handleNewPomodoroStart = () => {
    setIsTimerCompleted(false)
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