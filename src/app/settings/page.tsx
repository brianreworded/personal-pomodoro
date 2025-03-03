'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaCheck } from 'react-icons/fa'
import { useTheme } from '@/components/ui/ThemeProvider'
import { ColorTheme } from '@/lib/types'
import { cookieService } from '@/lib/cookieService'

export default function SettingsPage() {
  const { settings, updateSettings, colorThemeClasses } = useTheme()
  
  const [taskStats, setTaskStats] = useState({
    total: 0,
    today: 0
  })
  
  const [workoutStats, setWorkoutStats] = useState({
    total: 0,
    stretches: 0,
    yoga: 0,
    calisthenics: 0
  })
  
  const [pomodoroStats, setPomodoroStats] = useState({
    total: 0
  })
  
  // Load stats from cookies on initial render
  useEffect(() => {
    try {
      const tasks = cookieService.getTasks()
      const completedTasks = tasks.filter(task => task.completed)
      const todayStart = new Date().setHours(0, 0, 0, 0)
      const todayTasks = completedTasks.filter(task => {
        // This is a simplification as we'd need proper date tracking in tasks
        return true // placeholder for actual date comparison
      })
      
      setTaskStats({
        total: completedTasks.length,
        today: todayTasks.length
      })
    } catch (e) {
      console.error('Failed to load tasks')
    }
    
    try {
      const workouts = cookieService.getWorkoutHistory()
      setWorkoutStats({
        total: workouts.length,
        stretches: workouts.filter(w => w.type === 'stretches').length,
        yoga: workouts.filter(w => w.type === 'yoga').length,
        calisthenics: workouts.filter(w => w.type === 'calisthenics').length
      })
    } catch (e) {
      console.error('Failed to load workout history')
    }
    
    try {
      const pomodoroCount = cookieService.getPomodoroCount()
      setPomodoroStats({
        total: pomodoroCount
      })
    } catch (e) {
      console.error('Failed to load pomodoro count')
    }
  }, [])
  
  const colorOptions: { value: ColorTheme; label: string; bgClass: string }[] = [
    { value: 'blue', label: 'Blue', bgClass: 'bg-blue-500' },
    { value: 'teal', label: 'Teal', bgClass: 'bg-teal-500' },
    { value: 'purple', label: 'Purple', bgClass: 'bg-purple-500' },
    { value: 'amber', label: 'Amber', bgClass: 'bg-amber-500' },
    { value: 'rose', label: 'Rose', bgClass: 'bg-rose-500' },
    { value: 'emerald', label: 'Emerald', bgClass: 'bg-emerald-500' },
  ]
  
  return (
    <main className="p-6 max-w-5xl mx-auto pt-16">
      <div className="flex items-center mb-8">
        <Link href="/" className={`flex items-center ${colorThemeClasses.accent} hover:opacity-80 mr-4`}>
          <FaArrowLeft className="mr-2" />
          Back
        </Link>
        <h1 className={`text-2xl font-bold ${colorThemeClasses.primary}`}>Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <section className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className={`text-xl font-semibold mb-5 ${colorThemeClasses.primary}`}>Statistics Dashboard</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-1">Tasks Completed</h3>
                <p className="text-2xl font-bold">{taskStats.total}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Today: {taskStats.today}</p>
              </div>
              
              <div className="p-4 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-1">Workouts Completed</h3>
                <p className="text-2xl font-bold">{workoutStats.total}</p>
              </div>
              
              <div className="p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-1">Pomodoro Sessions</h3>
                <p className="text-2xl font-bold">{pomodoroStats.total}</p>
              </div>
              
              <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Workout Minutes</h3>
                <p className="text-2xl font-bold">{workoutStats.total * 3}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Workout Breakdown</h3>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{ 
                    width: `${workoutStats.total ? (workoutStats.stretches / workoutStats.total) * 100 : 0}%` 
                  }}></div>
                </div>
                <span className="ml-2 text-sm">{workoutStats.stretches} Stretches</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div className="bg-green-500 h-4 rounded-full" style={{ 
                    width: `${workoutStats.total ? (workoutStats.yoga / workoutStats.total) * 100 : 0}%` 
                  }}></div>
                </div>
                <span className="ml-2 text-sm">{workoutStats.yoga} Yoga</span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div className="bg-amber-500 h-4 rounded-full" style={{ 
                    width: `${workoutStats.total ? (workoutStats.calisthenics / workoutStats.total) * 100 : 0}%` 
                  }}></div>
                </div>
                <span className="ml-2 text-sm">{workoutStats.calisthenics} Calisthenics</span>
              </div>
            </div>
          </section>
          
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className={`text-xl font-semibold mb-5 ${colorThemeClasses.primary}`}>History Logs</h2>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Recent Tasks</h3>
              <div className="max-h-32 overflow-y-auto">
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  History logs will appear here as you complete tasks and workouts.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Workouts</h3>
              <div className="max-h-32 overflow-y-auto">
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  History logs will appear here as you complete tasks and workouts.
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <div>
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
            <h2 className={`text-xl font-semibold mb-5 ${colorThemeClasses.primary}`}>Appearance</h2>
            
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-3">Theme Mode</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => updateSettings({ theme: 'light' })} 
                  className={`p-4 rounded-lg border ${settings.theme === 'light' 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.theme === 'light' && <FaCheck className={colorThemeClasses.accent} />}
                  <span>Light</span>
                </button>
                <button 
                  onClick={() => updateSettings({ theme: 'dark' })} 
                  className={`p-4 rounded-lg border ${settings.theme === 'dark' 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.theme === 'dark' && <FaCheck className={colorThemeClasses.accent} />}
                  <span>Dark</span>
                </button>
                <button 
                  onClick={() => updateSettings({ theme: 'system' })} 
                  className={`p-4 rounded-lg border ${settings.theme === 'system' 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.theme === 'system' && <FaCheck className={colorThemeClasses.accent} />}
                  <span>System</span>
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-3">Color Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateSettings({ colorTheme: color.value })}
                    className={`p-3 rounded-lg border flex flex-col items-center ${
                      settings.colorTheme === color.value
                        ? colorThemeClasses.active
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${color.bgClass} mb-1`}></div>
                    <span>{color.label}</span>
                    {settings.colorTheme === color.value && (
                      <FaCheck className={`mt-1 ${colorThemeClasses.accent}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className={`text-xl font-semibold mb-5 ${colorThemeClasses.primary}`}>App Settings</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Sound Notifications</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => updateSettings({ soundEnabled: true })} 
                  className={`p-4 rounded-lg border ${settings.soundEnabled === true 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.soundEnabled === true && <FaCheck className={colorThemeClasses.accent} />}
                  <span>On</span>
                </button>
                <button 
                  onClick={() => updateSettings({ soundEnabled: false })} 
                  className={`p-4 rounded-lg border ${settings.soundEnabled === false 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.soundEnabled === false && <FaCheck className={colorThemeClasses.accent} />}
                  <span>Off</span>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Confetti Density</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => updateSettings({ confettiDensity: 'low' })} 
                  className={`p-4 rounded-lg border ${settings.confettiDensity === 'low' 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.confettiDensity === 'low' && <FaCheck className={colorThemeClasses.accent} />}
                  <span>Low</span>
                </button>
                <button 
                  onClick={() => updateSettings({ confettiDensity: 'medium' })} 
                  className={`p-4 rounded-lg border ${settings.confettiDensity === 'medium' 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.confettiDensity === 'medium' && <FaCheck className={colorThemeClasses.accent} />}
                  <span>Medium</span>
                </button>
                <button 
                  onClick={() => updateSettings({ confettiDensity: 'high' })} 
                  className={`p-4 rounded-lg border ${settings.confettiDensity === 'high' 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.confettiDensity === 'high' && <FaCheck className={colorThemeClasses.accent} />}
                  <span>High</span>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Base Workout Difficulty</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => updateSettings({ baseWorkoutDifficulty: 'easy' })} 
                  className={`p-4 rounded-lg border ${settings.baseWorkoutDifficulty === 'easy' 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.baseWorkoutDifficulty === 'easy' && <FaCheck className={colorThemeClasses.accent} />}
                  <span>Easy</span>
                </button>
                <button 
                  onClick={() => updateSettings({ baseWorkoutDifficulty: 'medium' })} 
                  className={`p-4 rounded-lg border ${settings.baseWorkoutDifficulty === 'medium' 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.baseWorkoutDifficulty === 'medium' && <FaCheck className={colorThemeClasses.accent} />}
                  <span>Medium</span>
                </button>
                <button 
                  onClick={() => updateSettings({ baseWorkoutDifficulty: 'hard' })} 
                  className={`p-4 rounded-lg border ${settings.baseWorkoutDifficulty === 'hard' 
                    ? colorThemeClasses.active
                    : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {settings.baseWorkoutDifficulty === 'hard' && <FaCheck className={colorThemeClasses.accent} />}
                  <span>Hard</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}