import Cookies from 'js-cookie'
import { Task, Workout, UserPreferences, AppSettings } from './types'

const COOKIE_KEYS = {
  TASKS: 'tasks',
  WORKOUT_HISTORY: 'workoutHistory',
  USER_PREFERENCES: 'userPreferences',
  APP_SETTINGS: 'appSettings',
  POMODORO_COUNT: 'pomodoroCount'
}

const COOKIE_EXPIRY = 365 // days

export const cookieService = {
  // Tasks
  getTasks: (): Task[] => {
    const tasksJson = Cookies.get(COOKIE_KEYS.TASKS)
    return tasksJson ? JSON.parse(tasksJson) : []
  },
  
  saveTasks: (tasks: Task[]): void => {
    Cookies.set(COOKIE_KEYS.TASKS, JSON.stringify(tasks), { expires: COOKIE_EXPIRY })
  },
  
  // Workouts
  getWorkoutHistory: (): Workout[] => {
    const historyJson = Cookies.get(COOKIE_KEYS.WORKOUT_HISTORY)
    return historyJson ? JSON.parse(historyJson) : []
  },
  
  saveWorkoutHistory: (workouts: Workout[]): void => {
    Cookies.set(COOKIE_KEYS.WORKOUT_HISTORY, JSON.stringify(workouts), { expires: COOKIE_EXPIRY })
  },
  
  // User Preferences
  getUserPreferences: (): UserPreferences => {
    const preferencesJson = Cookies.get(COOKIE_KEYS.USER_PREFERENCES)
    return preferencesJson 
      ? JSON.parse(preferencesJson) 
      : {
          stretchesDifficulty: 1,
          yogaDifficulty: 1,
          calisthenicsDifficulty: 1
        }
  },
  
  saveUserPreferences: (preferences: UserPreferences): void => {
    Cookies.set(COOKIE_KEYS.USER_PREFERENCES, JSON.stringify(preferences), { expires: COOKIE_EXPIRY })
  },
  
  // App Settings
  getAppSettings: (): AppSettings => {
    const settingsJson = Cookies.get(COOKIE_KEYS.APP_SETTINGS)
    return settingsJson
      ? JSON.parse(settingsJson)
      : {
          theme: 'system',
          colorTheme: 'blue',
          soundEnabled: true,
          confettiDensity: 'medium',
          baseWorkoutDifficulty: 'medium'
        }
  },
  
  saveAppSettings: (settings: AppSettings): void => {
    Cookies.set(COOKIE_KEYS.APP_SETTINGS, JSON.stringify(settings), { expires: COOKIE_EXPIRY })
  },
  
  // Pomodoro Count
  getPomodoroCount: (): number => {
    const countStr = Cookies.get(COOKIE_KEYS.POMODORO_COUNT)
    return countStr ? parseInt(countStr) : 0
  },
  
  incrementPomodoroCount: (): void => {
    const current = cookieService.getPomodoroCount()
    Cookies.set(COOKIE_KEYS.POMODORO_COUNT, (current + 1).toString(), { expires: COOKIE_EXPIRY })
  }
}