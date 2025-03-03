'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { cookieService } from '@/lib/cookieService'
import { AppSettings, ColorTheme } from '@/lib/types'

type ThemeContextType = {
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
  colorThemeClasses: {
    primary: string
    accent: string
    progress: string
    button: string
    active: string
    border: string
  }
}

const colorThemeMap: Record<ColorTheme, ThemeContextType['colorThemeClasses']> = {
  blue: {
    primary: 'text-blue-600 dark:text-blue-500',
    accent: 'text-blue-500 dark:text-blue-400',
    progress: 'bg-blue-500 dark:bg-blue-600',
    button: 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700',
    active: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-500',
    border: 'border-blue-200 dark:border-blue-800',
  },
  teal: {
    primary: 'text-teal-600 dark:text-teal-500',
    accent: 'text-teal-500 dark:text-teal-400',
    progress: 'bg-teal-500 dark:bg-teal-600',
    button: 'bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-600 dark:hover:bg-teal-700',
    active: 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-500',
    border: 'border-teal-200 dark:border-teal-800',
  },
  purple: {
    primary: 'text-purple-600 dark:text-purple-500',
    accent: 'text-purple-500 dark:text-purple-400',
    progress: 'bg-purple-500 dark:bg-purple-600',
    button: 'bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700',
    active: 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-500',
    border: 'border-purple-200 dark:border-purple-800',
  },
  amber: {
    primary: 'text-amber-600 dark:text-amber-500',
    accent: 'text-amber-500 dark:text-amber-400',
    progress: 'bg-amber-500 dark:bg-amber-600',
    button: 'bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-700',
    active: 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-500',
    border: 'border-amber-200 dark:border-amber-800',
  },
  rose: {
    primary: 'text-rose-600 dark:text-rose-500',
    accent: 'text-rose-500 dark:text-rose-400',
    progress: 'bg-rose-500 dark:bg-rose-600',
    button: 'bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-600 dark:hover:bg-rose-700',
    active: 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-500',
    border: 'border-rose-200 dark:border-rose-800',
  },
  emerald: {
    primary: 'text-emerald-600 dark:text-emerald-500',
    accent: 'text-emerald-500 dark:text-emerald-400',
    progress: 'bg-emerald-500 dark:bg-emerald-600',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700',
    active: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    colorTheme: 'blue',
    soundEnabled: true,
    confettiDensity: 'medium',
    baseWorkoutDifficulty: 'medium',
  })

  useEffect(() => {
    // Load settings from cookies
    const savedSettings = cookieService.getAppSettings()
    setSettings(savedSettings)

    // Apply theme (light/dark)
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    
    if (savedSettings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(savedSettings.theme)
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (savedSettings.theme === 'system') {
        root.classList.remove('light', 'dark')
        root.classList.add(mediaQuery.matches ? 'dark' : 'light')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Whenever settings change, update cookie and apply theme
  useEffect(() => {
    cookieService.saveAppSettings(settings)
    
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(settings.theme)
    }
  }, [settings])

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings({
      ...settings,
      ...newSettings,
    })
  }

  const colorThemeClasses = colorThemeMap[settings.colorTheme]

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, colorThemeClasses }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}