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
    try {
      const tasksJson = Cookies.get(COOKIE_KEYS.TASKS)
      return tasksJson ? JSON.parse(tasksJson) : []
    } catch (error) {
      console.error('Error parsing tasks from cookies:', error)
      return []
    }
  },
  
  saveTasks: (tasks: Task[]): void => {
    try {
      Cookies.set(COOKIE_KEYS.TASKS, JSON.stringify(tasks), { expires: COOKIE_EXPIRY })
    } catch (error) {
      console.error('Error saving tasks to cookies:', error)
    }
  },
  
  // Workouts
  getWorkoutHistory: (): Workout[] => {
    try {
      const historyJson = Cookies.get(COOKIE_KEYS.WORKOUT_HISTORY)
      return historyJson ? JSON.parse(historyJson) : []
    } catch (error) {
      console.error('Error parsing workout history from cookies:', error)
      return []
    }
  },
  
  saveWorkoutHistory: (workouts: Workout[]): void => {
    try {
      Cookies.set(COOKIE_KEYS.WORKOUT_HISTORY, JSON.stringify(workouts), { expires: COOKIE_EXPIRY })
    } catch (error) {
      console.error('Error saving workout history to cookies:', error)
    }
  },
  
  // User Preferences
  getUserPreferences: (): UserPreferences => {
    try {
      const preferencesJson = Cookies.get(COOKIE_KEYS.USER_PREFERENCES)
      const defaultPrefs = {
        stretchesDifficulty: 1,
        yogaDifficulty: 1,
        calisthenicsDifficulty: 1,
        enabledWorkoutTypes: {
          stretches: true,
          yoga: true,
          calisthenics: true
        },
        targetBodyParts: {
          upper: true,
          core: true,
          lower: true,
          full: true
        }
      };
      
      if (!preferencesJson) {
        return defaultPrefs;
      }
      
      // Parse the saved preferences
      const savedPrefs = JSON.parse(preferencesJson);
      
      // If the saved preferences are from before the update, add the new fields
      if (!savedPrefs.enabledWorkoutTypes) {
        savedPrefs.enabledWorkoutTypes = defaultPrefs.enabledWorkoutTypes;
      }
      
      if (!savedPrefs.targetBodyParts) {
        savedPrefs.targetBodyParts = defaultPrefs.targetBodyParts;
      }
      
      return savedPrefs;
    } catch (error) {
      console.error('Error parsing user preferences from cookies:', error)
      return {
        stretchesDifficulty: 1,
        yogaDifficulty: 1,
        calisthenicsDifficulty: 1,
        enabledWorkoutTypes: {
          stretches: true,
          yoga: true,
          calisthenics: true
        },
        targetBodyParts: {
          upper: true,
          core: true,
          lower: true,
          full: true
        }
      }
    }
  },
  
  saveUserPreferences: (preferences: UserPreferences): void => {
    try {
      Cookies.set(COOKIE_KEYS.USER_PREFERENCES, JSON.stringify(preferences), { expires: COOKIE_EXPIRY })
    } catch (error) {
      console.error('Error saving user preferences to cookies:', error)
    }
  },
  
  // App Settings
  getAppSettings: (): AppSettings => {
    try {
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
    } catch (error) {
      console.error('Error parsing app settings from cookies:', error)
      return {
        theme: 'system',
        colorTheme: 'blue',
        soundEnabled: true,
        confettiDensity: 'medium',
        baseWorkoutDifficulty: 'medium'
      }
    }
  },
  
  saveAppSettings: (settings: AppSettings): void => {
    try {
      Cookies.set(COOKIE_KEYS.APP_SETTINGS, JSON.stringify(settings), { expires: COOKIE_EXPIRY })
    } catch (error) {
      console.error('Error saving app settings to cookies:', error)
    }
  },
  
  // Pomodoro Count
  getPomodoroCount: (): number => {
    try {
      const countStr = Cookies.get(COOKIE_KEYS.POMODORO_COUNT)
      return countStr ? parseInt(countStr) : 0
    } catch (error) {
      console.error('Error parsing pomodoro count from cookies:', error)
      return 0
    }
  },
  
  incrementPomodoroCount: (): void => {
    try {
      const current = cookieService.getPomodoroCount()
      Cookies.set(COOKIE_KEYS.POMODORO_COUNT, (current + 1).toString(), { expires: COOKIE_EXPIRY })
    } catch (error) {
      console.error('Error incrementing pomodoro count:', error)
    }
  }
}