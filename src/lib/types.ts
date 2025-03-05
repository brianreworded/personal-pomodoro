export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt?: number
}

export interface Workout {
  id?: string
  type: 'stretches' | 'yoga' | 'calisthenics'
  exercise: string
  reps: number
  duration?: number // Duration in seconds (for timed exercises like yoga)
  completed: boolean
  createdAt?: number
  completedAt?: number
  feedback?: 'easy' | 'just-right' | 'hard'
}

export interface UserPreferences {
  stretchesDifficulty: number
  yogaDifficulty: number
  calisthenicsDifficulty: number
  enabledWorkoutTypes: {
    stretches: boolean
    yoga: boolean
    calisthenics: boolean
  }
  targetBodyParts: {
    upper: boolean
    core: boolean
    lower: boolean
    full: boolean
  }
}

export type ColorTheme = 'blue' | 'teal' | 'purple' | 'amber' | 'rose' | 'emerald' | 'indigo' | 'lime' | 'cyan' | 'pink' | 'orange' | 'green'

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  colorTheme: ColorTheme
  soundEnabled: boolean
  confettiDensity: 'low' | 'medium' | 'high'
  baseWorkoutDifficulty: 'easy' | 'medium' | 'hard'
}

export interface Stats {
  tasksCompleted: number
  tasksCompletedToday: number
  workoutsCompleted: number
  workoutsByType: {
    stretches: number
    yoga: number
    calisthenics: number
  }
  pomodoroSessionsCompleted: number
}

export interface TimerState {
  timeLeft: number
  duration: number
  isActive: boolean
  isCompleted: boolean
}

export interface AppState {
  timerState: TimerState
  currentWorkouts: Workout[]
  isWorkoutActive: boolean
}