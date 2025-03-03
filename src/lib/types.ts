export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt?: number
}

export interface Workout {
  id: string
  type: 'stretches' | 'yoga' | 'calisthenics'
  exercise: string
  reps: number
  sets: number
  completed: boolean
  createdAt: number
  completedAt?: number
  feedback?: 'easy' | 'just-right' | 'hard'
}

export interface UserPreferences {
  stretchesDifficulty: number
  yogaDifficulty: number
  calisthenicsDifficulty: number
}

export type ColorTheme = 'blue' | 'teal' | 'purple' | 'amber' | 'rose' | 'emerald'

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