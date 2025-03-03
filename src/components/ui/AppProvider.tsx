'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AppState, TimerState, Workout, Task } from '@/lib/types'
import { cookieService } from '@/lib/cookieService'

type AppContextType = {
  appState: AppState
  updateTimerState: (newState: Partial<TimerState>) => void
  setTimerCompleted: (completed: boolean) => void
  updateCurrentWorkouts: (workouts: Workout[]) => void
  setWorkoutActive: (active: boolean) => void
  tasks: Task[]
  updateTasks: (tasks: Task[]) => void
  workoutHistory: Workout[]
  updateWorkoutHistory: (history: Workout[]) => void
}

const initialTimerState: TimerState = {
  timeLeft: 25 * 60, // 25 minutes in seconds
  duration: 25 * 60,
  isActive: false,
  isCompleted: false
}

const initialAppState: AppState = {
  timerState: initialTimerState,
  currentWorkouts: [],
  isWorkoutActive: false
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [appState, setAppState] = useState<AppState>(initialAppState)
  const [tasks, setTasks] = useState<Task[]>([])
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([])

  // Load all data on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load app state from sessionStorage
      const savedState = sessionStorage.getItem('appState')
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          setAppState(parsedState)
        } catch (error) {
          console.error('Failed to parse app state:', error)
        }
      }
      
      // Load tasks from cookies
      try {
        const savedTasks = cookieService.getTasks()
        setTasks(savedTasks)
      } catch (error) {
        console.error('Failed to load tasks:', error)
      }
      
      // Load workout history from cookies
      try {
        const savedWorkoutHistory = cookieService.getWorkoutHistory()
        setWorkoutHistory(savedWorkoutHistory)
      } catch (error) {
        console.error('Failed to load workout history:', error)
      }
    }
  }, [])
  
  // Re-fetch all data when visibility changes or page is focused
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const refreshAllData = () => {
      // Refresh app state from sessionStorage
      const savedState = sessionStorage.getItem('appState')
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          setAppState(parsedState)
        } catch (error) {
          console.error('Failed to parse app state:', error)
        }
      }
      
      // Refresh tasks from cookies
      try {
        const savedTasks = cookieService.getTasks()
        setTasks(savedTasks)
      } catch (error) {
        console.error('Failed to load tasks:', error)
      }
      
      // Refresh workout history from cookies
      try {
        const savedWorkoutHistory = cookieService.getWorkoutHistory()
        setWorkoutHistory(savedWorkoutHistory)
      } catch (error) {
        console.error('Failed to load workout history:', error)
      }
    }
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAllData()
      }
    }
    
    const handlePageFocus = () => {
      refreshAllData()
    }
    
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handlePageFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handlePageFocus)
    }
  }, [])

  // Save app state to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('appState', JSON.stringify(appState))
    }
  }, [appState])
  
  // Save tasks to cookies whenever they change
  useEffect(() => {
    if (tasks.length > 0 || workoutHistory.length > 0) {
      cookieService.saveTasks(tasks)
    }
  }, [tasks])
  
  // Save workout history to cookies whenever it changes
  useEffect(() => {
    if (workoutHistory.length > 0) {
      cookieService.saveWorkoutHistory(workoutHistory)
    }
  }, [workoutHistory])

  const updateTimerState = (newState: Partial<TimerState>) => {
    setAppState(prevState => ({
      ...prevState,
      timerState: {
        ...prevState.timerState,
        ...newState
      }
    }))
  }

  const setTimerCompleted = (completed: boolean) => {
    setAppState(prevState => ({
      ...prevState,
      timerState: {
        ...prevState.timerState,
        isCompleted: completed
      },
      isWorkoutActive: completed
    }))
  }

  const updateCurrentWorkouts = (workouts: Workout[]) => {
    setAppState(prevState => ({
      ...prevState,
      currentWorkouts: workouts
    }))
  }

  const setWorkoutActive = (active: boolean) => {
    setAppState(prevState => ({
      ...prevState,
      isWorkoutActive: active
    }))
  }
  
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    // Save to cookies immediately
    cookieService.saveTasks(newTasks)
  }
  
  const updateWorkoutHistory = (newHistory: Workout[]) => {
    setWorkoutHistory(newHistory)
    // Save to cookies immediately
    cookieService.saveWorkoutHistory(newHistory)
  }

  return (
    <AppContext.Provider 
      value={{ 
        appState, 
        updateTimerState, 
        setTimerCompleted,
        updateCurrentWorkouts,
        setWorkoutActive,
        tasks,
        updateTasks,
        workoutHistory,
        updateWorkoutHistory
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppState = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider')
  }
  return context
}