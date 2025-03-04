'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaCheck } from 'react-icons/fa'
import { useTheme } from '@/components/ui/ThemeProvider'
import { useAppState } from '@/components/ui/AppProvider'
import { ColorTheme, UserPreferences } from '@/lib/types'
import { cookieService } from '@/lib/cookieService'

// Import workout exercise data
import { workoutExercises } from '@/lib/workoutData'

export default function SettingsPage() {
  const { settings, updateSettings, colorThemeClasses } = useTheme()
  const { tasks, workoutHistory } = useAppState()
  
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
  
  const [workoutPreferences, setWorkoutPreferences] = useState<UserPreferences>({
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
  })
  
  // Function to update stats from current app state
  const updateStats = useCallback(() => {
    // Calculate task stats from the centralized state
    const completedTasks = tasks.filter((task) => task.completed)
    const todayTasks = completedTasks.filter((task) => {
      // This is a simplification as we'd need proper date tracking in tasks
      if (task){
        return true; // placeholder for actual date comparison
      } else {
        return false;
      }
    })
    
    setTaskStats({
      total: completedTasks.length,
      today: todayTasks.length
    })
    
    // Calculate workout stats from the centralized state
    setWorkoutStats({
      total: workoutHistory.length,
      stretches: workoutHistory.filter(w => w.type === 'stretches').length,
      yoga: workoutHistory.filter(w => w.type === 'yoga').length,
      calisthenics: workoutHistory.filter(w => w.type === 'calisthenics').length
    })
    
    // Load pomodoro count (still from cookies since we're not tracking that in global state)
    try {
      const pomodoroCount = cookieService.getPomodoroCount()
      setPomodoroStats({
        total: pomodoroCount
      })
      
      // Load workout preferences from cookies
      const prefs = cookieService.getUserPreferences()
      setWorkoutPreferences(prefs)
    } catch (error) {
      console.error('Failed to load stats or preferences', error)
    }
  }, [tasks, workoutHistory])

  // Update stats whenever tasks or workout history changes
  useEffect(() => {
    updateStats()
  }, [updateStats])
  
  // Load workout preferences on mount and when they might change
  useEffect(() => {
    try {
      const prefs = cookieService.getUserPreferences();
      setWorkoutPreferences(prefs);
    } catch (error) {
      console.error('Failed to load workout preferences', error);
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
                {taskStats.total > 0 ? (
                  <ul className="space-y-1">
                    {tasks
                      .filter(task => task.completed)
                      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
                      .slice(0, 5)
                      .map((task, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${colorThemeClasses.progress}`}></span>
                          <span className="font-medium">{task.text}</span>
                          <span className="text-gray-400 ml-auto text-xs">
                            {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ''}
                          </span>
                        </li>
                      ))
                    }
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    Complete tasks to see your history here.
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Workouts</h3>
              <div className="max-h-32 overflow-y-auto">
                {workoutStats.total > 0 ? (
                  <ul className="space-y-1">
                    {workoutHistory
                      .slice(-5)
                      .reverse()
                      .map((workout, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center group relative">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            workout.type === 'stretches' ? 'bg-blue-500' : 
                            workout.type === 'yoga' ? 'bg-emerald-500' : 
                            'bg-amber-500'
                          }`}></span>
                          <span className="font-medium cursor-help">{workout.exercise}</span>
                          <div className={`ml-1 w-4 h-4 rounded-full ${colorThemeClasses.accent} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center text-xs cursor-help`}>
                            <span className="text-xs font-bold">?</span>
                          </div>
                          <span className="text-gray-400 ml-1">
                            ({workout.type.charAt(0).toUpperCase() + workout.type.slice(1)})
                          </span>
                          <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 p-3 rounded shadow-lg border border-gray-200 dark:border-gray-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                            <h4 className="font-bold mb-1">{workout.exercise}:</h4>
                            {workoutExercises[workout.type].find(ex => ex.name === workout.exercise)?.description || 'No description available.'}
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    Complete workouts to see your history here.
                  </p>
                )}
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
          
          <section className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className={`text-xl font-semibold mb-5 ${colorThemeClasses.primary}`}>Workout Settings</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Workout Types</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select which workout types to include:</p>
              
              <div className="grid grid-cols-3 gap-3">
                <label className={`flex items-center cursor-pointer p-3 border rounded-lg ${
                    workoutPreferences.enabledWorkoutTypes?.stretches ? 
                    `border-${settings.colorTheme}-500 dark:border-${settings.colorTheme}-700 bg-${settings.colorTheme}-50 dark:bg-${settings.colorTheme}-900/20` : 
                    'border-gray-200 dark:border-gray-700'
                  }`}>
                  <input 
                    type="checkbox" 
                    className={`h-5 w-5 mr-2 text-${settings.colorTheme}-500 rounded focus:ring-${settings.colorTheme}-500`}
                    checked={!!workoutPreferences.enabledWorkoutTypes?.stretches} 
                    onChange={() => {
                      // Enable/disable stretches
                      const enabledTypes = {...(workoutPreferences.enabledWorkoutTypes || { stretches: true, yoga: true, calisthenics: true })};
                      
                      // Toggle the current setting
                      enabledTypes.stretches = !enabledTypes.stretches;
                      
                      // Update preferences
                      const newPrefs = {
                        ...workoutPreferences,
                        enabledWorkoutTypes: enabledTypes
                      };
                      cookieService.saveUserPreferences(newPrefs);
                      setWorkoutPreferences(newPrefs);
                    }}
                  />
                  <span>Stretches</span>
                </label>
                
                <label className={`flex items-center cursor-pointer p-3 border rounded-lg ${
                    workoutPreferences.enabledWorkoutTypes?.yoga ? 
                    `border-${settings.colorTheme}-500 dark:border-${settings.colorTheme}-700 bg-${settings.colorTheme}-50 dark:bg-${settings.colorTheme}-900/20` : 
                    'border-gray-200 dark:border-gray-700'
                  }`}>
                  <input 
                    type="checkbox" 
                    className={`h-5 w-5 mr-2 text-${settings.colorTheme}-500 rounded focus:ring-${settings.colorTheme}-500`}
                    checked={!!workoutPreferences.enabledWorkoutTypes?.yoga}
                    onChange={() => {
                      // Enable/disable yoga
                      const enabledTypes = {...(workoutPreferences.enabledWorkoutTypes || { stretches: true, yoga: true, calisthenics: true })};
                      
                      // Toggle the current setting
                      enabledTypes.yoga = !enabledTypes.yoga;
                      
                      // Update preferences
                      const newPrefs = {
                        ...workoutPreferences,
                        enabledWorkoutTypes: enabledTypes
                      };
                      cookieService.saveUserPreferences(newPrefs);
                      setWorkoutPreferences(newPrefs);
                    }}
                  />
                  <span>Yoga</span>
                </label>
                
                <label className={`flex items-center cursor-pointer p-3 border rounded-lg ${
                    workoutPreferences.enabledWorkoutTypes?.calisthenics ? 
                    `border-${settings.colorTheme}-500 dark:border-${settings.colorTheme}-700 bg-${settings.colorTheme}-50 dark:bg-${settings.colorTheme}-900/20` : 
                    'border-gray-200 dark:border-gray-700'
                  }`}>
                  <input 
                    type="checkbox" 
                    className={`h-5 w-5 mr-2 text-${settings.colorTheme}-500 rounded focus:ring-${settings.colorTheme}-500`}
                    checked={!!workoutPreferences.enabledWorkoutTypes?.calisthenics}
                    onChange={() => {
                      // Enable/disable calisthenics
                      const enabledTypes = {...(workoutPreferences.enabledWorkoutTypes || { stretches: true, yoga: true, calisthenics: true })};
                      
                      // Toggle the current setting
                      enabledTypes.calisthenics = !enabledTypes.calisthenics;
                      
                      // Update preferences
                      const newPrefs = {
                        ...workoutPreferences,
                        enabledWorkoutTypes: enabledTypes
                      };
                      cookieService.saveUserPreferences(newPrefs);
                      setWorkoutPreferences(newPrefs);
                    }}
                  />
                  <span>Calisthenics</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Target Body Parts</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select which body parts to focus on:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center cursor-pointer p-3 border rounded-lg ${
                    workoutPreferences.targetBodyParts?.upper ? 
                    `border-${settings.colorTheme}-500 dark:border-${settings.colorTheme}-700 bg-${settings.colorTheme}-50 dark:bg-${settings.colorTheme}-900/20` : 
                    'border-gray-200 dark:border-gray-700'
                  }`}>
                  <input 
                    type="checkbox" 
                    className={`h-5 w-5 mr-2 text-${settings.colorTheme}-500 rounded focus:ring-${settings.colorTheme}-500`}
                    checked={!!workoutPreferences.targetBodyParts?.upper}
                    onChange={() => {
                      // Enable/disable upper body
                      const targetParts = {...(workoutPreferences.targetBodyParts || { upper: true, core: true, lower: true, full: true })};
                      
                      // Toggle the current setting
                      targetParts.upper = !targetParts.upper;
                      
                      // Update preferences
                      const newPrefs = {
                        ...workoutPreferences,
                        targetBodyParts: targetParts
                      };
                      cookieService.saveUserPreferences(newPrefs);
                      setWorkoutPreferences(newPrefs);
                    }}
                  />
                  <span>Upper Body</span>
                </label>
                
                <label className={`flex items-center cursor-pointer p-3 border rounded-lg ${
                    workoutPreferences.targetBodyParts?.core ? 
                    `border-${settings.colorTheme}-500 dark:border-${settings.colorTheme}-700 bg-${settings.colorTheme}-50 dark:bg-${settings.colorTheme}-900/20` : 
                    'border-gray-200 dark:border-gray-700'
                  }`}>
                  <input 
                    type="checkbox" 
                    className={`h-5 w-5 mr-2 text-${settings.colorTheme}-500 rounded focus:ring-${settings.colorTheme}-500`}
                    checked={!!workoutPreferences.targetBodyParts?.core}
                    onChange={() => {
                      // Enable/disable core
                      const targetParts = {...(workoutPreferences.targetBodyParts || { upper: true, core: true, lower: true, full: true })};
                      
                      // Toggle the current setting
                      targetParts.core = !targetParts.core;
                      
                      // Update preferences
                      const newPrefs = {
                        ...workoutPreferences,
                        targetBodyParts: targetParts
                      };
                      cookieService.saveUserPreferences(newPrefs);
                      setWorkoutPreferences(newPrefs);
                    }}
                  />
                  <span>Core</span>
                </label>
                
                <label className={`flex items-center cursor-pointer p-3 border rounded-lg ${
                    workoutPreferences.targetBodyParts?.lower ? 
                    `border-${settings.colorTheme}-500 dark:border-${settings.colorTheme}-700 bg-${settings.colorTheme}-50 dark:bg-${settings.colorTheme}-900/20` : 
                    'border-gray-200 dark:border-gray-700'
                  }`}>
                  <input 
                    type="checkbox" 
                    className={`h-5 w-5 mr-2 text-${settings.colorTheme}-500 rounded focus:ring-${settings.colorTheme}-500`}
                    checked={!!workoutPreferences.targetBodyParts?.lower}
                    onChange={() => {
                      // Enable/disable lower body
                      const targetParts = {...(workoutPreferences.targetBodyParts || { upper: true, core: true, lower: true, full: true })};
                      
                      // Toggle the current setting
                      targetParts.lower = !targetParts.lower;
                      
                      // Update preferences
                      const newPrefs = {
                        ...workoutPreferences,
                        targetBodyParts: targetParts
                      };
                      cookieService.saveUserPreferences(newPrefs);
                      setWorkoutPreferences(newPrefs);
                    }}
                  />
                  <span>Lower Body</span>
                </label>
                
                <label className={`flex items-center cursor-pointer p-3 border rounded-lg ${
                    workoutPreferences.targetBodyParts?.full ? 
                    `border-${settings.colorTheme}-500 dark:border-${settings.colorTheme}-700 bg-${settings.colorTheme}-50 dark:bg-${settings.colorTheme}-900/20` : 
                    'border-gray-200 dark:border-gray-700'
                  }`}>
                  <input 
                    type="checkbox" 
                    className={`h-5 w-5 mr-2 text-${settings.colorTheme}-500 rounded focus:ring-${settings.colorTheme}-500`}
                    checked={!!workoutPreferences.targetBodyParts?.full}
                    onChange={() => {
                      // Enable/disable full body
                      const targetParts = {...(workoutPreferences.targetBodyParts || { upper: true, core: true, lower: true, full: true })};
                      
                      // Toggle the current setting
                      targetParts.full = !targetParts.full;
                      
                      // Update preferences
                      const newPrefs = {
                        ...workoutPreferences,
                        targetBodyParts: targetParts
                      };
                      cookieService.saveUserPreferences(newPrefs);
                      setWorkoutPreferences(newPrefs);
                    }}
                  />
                  <span>Full Body</span>
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}