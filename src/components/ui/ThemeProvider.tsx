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
  indigo: {
    primary: 'text-indigo-600 dark:text-indigo-500',
    accent: 'text-indigo-500 dark:text-indigo-400',
    progress: 'bg-indigo-500 dark:bg-indigo-600',
    button: 'bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700',
    active: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  lime: {
    primary: 'text-lime-600 dark:text-lime-500',
    accent: 'text-lime-500 dark:text-lime-400',
    progress: 'bg-lime-500 dark:bg-lime-600',
    button: 'bg-lime-500 hover:bg-lime-600 text-white dark:bg-lime-600 dark:hover:bg-lime-700',
    active: 'border-lime-500 bg-lime-50 dark:bg-lime-900/30 text-lime-500',
    border: 'border-lime-200 dark:border-lime-800',
  },
  cyan: {
    primary: 'text-cyan-600 dark:text-cyan-500',
    accent: 'text-cyan-500 dark:text-cyan-400',
    progress: 'bg-cyan-500 dark:bg-cyan-600',
    button: 'bg-cyan-500 hover:bg-cyan-600 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700',
    active: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-500',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  pink: {
    primary: 'text-pink-600 dark:text-pink-500',
    accent: 'text-pink-500 dark:text-pink-400',
    progress: 'bg-pink-500 dark:bg-pink-600',
    button: 'bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-600 dark:hover:bg-pink-700',
    active: 'border-pink-500 bg-pink-50 dark:bg-pink-900/30 text-pink-500',
    border: 'border-pink-200 dark:border-pink-800',
  },
  orange: {
    primary: 'text-orange-600 dark:text-orange-500',
    accent: 'text-orange-500 dark:text-orange-400',
    progress: 'bg-orange-500 dark:bg-orange-600',
    button: 'bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700',
    active: 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-500',
    border: 'border-orange-200 dark:border-orange-800',
  },
  green: {
    primary: 'text-green-600 dark:text-green-500',
    accent: 'text-green-500 dark:text-green-400',
    progress: 'bg-green-500 dark:bg-green-600',
    button: 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700',
    active: 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-500',
    border: 'border-green-200 dark:border-green-800',
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