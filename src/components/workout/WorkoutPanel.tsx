'use client'

import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import Confetti from 'react-confetti'
import { useTheme } from '@/components/ui/ThemeProvider'
import { cookieService } from '@/lib/cookieService'
import { workoutExercises, WORKOUT_TYPES } from '@/lib/workoutData'
import { useAppState } from '@/components/ui/AppProvider'

// Import the Workout type from types file
import { Workout } from '@/lib/types'

interface WorkoutPanelProps {
  isActive: boolean
  onWorkoutComplete: () => void
}

const WorkoutPanel: React.FC<WorkoutPanelProps> = ({ isActive, onWorkoutComplete }) => {
  const { appState, updateCurrentWorkouts, setWorkoutActive, workoutHistory, updateWorkoutHistory } = useAppState()
  const { currentWorkouts, isWorkoutActive } = appState
  
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [userPreferences, setUserPreferences] = useState({
    stretchesDifficulty: 1,
    yogaDifficulty: 1,
    calisthenicsDifficulty: 1
  })
  const { colorThemeClasses } = useTheme()
  
  // Sync the isActive prop with our global state
  useEffect(() => {
    if (isActive !== isWorkoutActive) {
      setWorkoutActive(isActive)
    }
  }, [isActive, isWorkoutActive, setWorkoutActive])
  
  // Load preferences from cookies on initial render
  useEffect(() => {
    try {
      const preferences = cookieService.getUserPreferences();
      setUserPreferences(preferences);
    } catch (err) {
      console.error('Failed to load workout preferences:', err);
    }
  }, [])
  
  // Save user preferences to cookies whenever they change
  useEffect(() => {
    cookieService.saveUserPreferences(userPreferences);
  }, [userPreferences])
  
  const generateWorkout = useCallback(() => {
    // Create multiple exercises for one complete workout session
    const newWorkouts: Workout[] = [];
    
    // Add one exercise of each type
    Object.values(WORKOUT_TYPES).forEach(workoutType => {
      // Get available exercises for the selected type
      const exercises = workoutExercises[workoutType];
      
      // Filter exercises based on user's preferred difficulty
      let difficultyPreference;
      switch(workoutType) {
        case WORKOUT_TYPES.STRETCHES:
          difficultyPreference = userPreferences.stretchesDifficulty;
          break;
        case WORKOUT_TYPES.YOGA:
          difficultyPreference = userPreferences.yogaDifficulty;
          break;
        case WORKOUT_TYPES.CALISTHENICS:
          difficultyPreference = userPreferences.calisthenicsDifficulty;
          break;
        default:
          difficultyPreference = 1;
      }
      
      // Get exercises that match the user's preferred difficulty (±1)
      const suitableExercises = exercises.filter(ex => 
        Math.abs(ex.difficulty - difficultyPreference) <= 1
      );
      
      // If no suitable exercises, fall back to all exercises
      const availableExercises = suitableExercises.length > 0 ? suitableExercises : exercises;
      
      // Select a random exercise
      const randomExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
      
      // Determine reps and sets based on difficulty and exercise type
      let reps, sets, duration;
      
      // For yoga and stretches, we'll use duration instead of reps (in seconds)
      if (workoutType === WORKOUT_TYPES.YOGA || workoutType === WORKOUT_TYPES.STRETCHES) {
        switch(randomExercise.difficulty) {
          case 1:
            duration = workoutType === WORKOUT_TYPES.YOGA ? 60 : 45 // 1 minute for yoga, 45 seconds for stretches
            sets = 2;
            break;
          case 2:
            duration = workoutType === WORKOUT_TYPES.YOGA ? 45 : 30;
            sets = 2;
            break;
          case 3:
            duration = 30;
            sets = workoutType === WORKOUT_TYPES.YOGA ? 3 : 2;
            break;
          case 4:
            duration = 30;
            sets = 2;
            break;
          default:
            duration = workoutType === WORKOUT_TYPES.YOGA ? 60 : 45;
            sets = 2;
        }
        reps = 0; // Not applicable for timed exercises
      } else {
        // For calisthenics
        switch(randomExercise.difficulty) {
          case 1:
            reps = 10;
            sets = 3;
            break;
          case 2:
            reps = 8;
            sets = 3;
            break;
          case 3:
            reps = 6;
            sets = 3;
            break;
          case 4:
            reps = 5;
            sets = 2;
            break;
          default:
            reps = 10;
            sets = 3;
        }
        duration = 0; // Not applicable for non-timed exercises
      }
      
      // Create the workout and add it to the array
      newWorkouts.push({
        type: workoutType as 'stretches' | 'yoga' | 'calisthenics',
        exercise: randomExercise.name,
        reps,
        sets,
        duration,
        completed: false
      });
    });
    
    updateCurrentWorkouts(newWorkouts);
    setShowFeedback(false);
  }, [userPreferences, updateCurrentWorkouts])
  
  // Generate a new workout when the timer completes
  useEffect(() => {
    if (isActive && (currentWorkouts.length === 0 || currentWorkouts.every((w: Workout) => w.completed))) {
      generateWorkout()
    }
  }, [isActive, currentWorkouts, generateWorkout])
  
  const completeWorkout = (index: number) => {
    if (currentWorkouts.length === 0) return
    
    // Mark the selected workout as completed
    const updatedWorkouts = [...currentWorkouts];
    updatedWorkouts[index] = { ...updatedWorkouts[index], completed: true };
    updateCurrentWorkouts(updatedWorkouts);
    
    // Create a completed workout with timestamp for history
    const completedWorkout = {
      ...updatedWorkouts[index],
      completed: true,
      createdAt: Date.now(),
      completedAt: Date.now(),
    };
    
    // Add to history using the centralized state
    const updatedHistory = [...workoutHistory, completedWorkout];
    updateWorkoutHistory(updatedHistory);
    
    // Show confetti if all workouts are completed
    if (updatedWorkouts.every((w: Workout) => w.completed)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      // Show feedback dialog
      setShowFeedback(true);
      
      // Increment pomodoro count when all workouts are completed
      cookieService.incrementPomodoroCount();
    }
  }
  
  const provideFeedback = (feedback: string) => {
    if (currentWorkouts.length === 0) return
    
    // Adjust difficulty preference based on feedback
    const newPreferences = { ...userPreferences }
    
    // Update difficulty for all workout types
    Object.values(WORKOUT_TYPES).forEach(type => {
      switch(type) {
        case WORKOUT_TYPES.STRETCHES:
          if (feedback === 'easy') newPreferences.stretchesDifficulty += 1
          else if (feedback === 'hard') newPreferences.stretchesDifficulty -= 1
          // Clamp between 1 and 4
          newPreferences.stretchesDifficulty = Math.max(1, Math.min(4, newPreferences.stretchesDifficulty))
          break
          
        case WORKOUT_TYPES.YOGA:
          if (feedback === 'easy') newPreferences.yogaDifficulty += 1
          else if (feedback === 'hard') newPreferences.yogaDifficulty -= 1
          // Clamp between 1 and 4
          newPreferences.yogaDifficulty = Math.max(1, Math.min(4, newPreferences.yogaDifficulty))
          break
          
        case WORKOUT_TYPES.CALISTHENICS:
          if (feedback === 'easy') newPreferences.calisthenicsDifficulty += 1
          else if (feedback === 'hard') newPreferences.calisthenicsDifficulty -= 1
          // Clamp between 1 and 4
          newPreferences.calisthenicsDifficulty = Math.max(1, Math.min(4, newPreferences.calisthenicsDifficulty))
          break
      }
    });
    
    setUserPreferences(newPreferences);
    setShowFeedback(false);
    
    // Reset current workouts to empty array to prepare for next session
    updateCurrentWorkouts([]);
    
    // Notify parent component that workout session is complete
    onWorkoutComplete();
  }
  
  // Format the workout type for display
  const formatWorkoutType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }
  
  return (
    <div className={`p-6 rounded-lg shadow-md border ${colorThemeClasses.border} bg-white dark:bg-gray-800`}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <h2 className={`text-xl font-semibold mb-4 ${colorThemeClasses.primary}`}>Active Break Workout</h2>
      
      {!isActive && (currentWorkouts.length === 0 || currentWorkouts.every((w: Workout) => w.completed)) && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Complete your Pomodoro timer to get an active break workout.
          </p>
          <button
            onClick={generateWorkout}
            className={`px-4 py-2 rounded ${colorThemeClasses.button}`}
          >
            Generate Workout Now
          </button>
        </div>
      )}
      
      {currentWorkouts.length > 0 && !currentWorkouts.every((w: Workout) => w.completed) && (
        <div className="space-y-4">
          {currentWorkouts.map((workout: Workout, index: number) => (
            !workout.completed && (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${
                    workout.type === 'stretches' ? 'text-blue-500 dark:text-blue-400' : 
                    workout.type === 'yoga' ? 'text-emerald-500 dark:text-emerald-400' : 
                    'text-amber-500 dark:text-amber-400'
                  }`}>
                    {formatWorkoutType(workout.type)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ~{(workout.type === 'yoga' || workout.type === 'stretches') ? 
                      Math.ceil((workout.duration || 0) * workout.sets / 60) : 3} minutes
                  </span>
                </div>
                
                <div className="relative group">
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold mb-3 cursor-help">{workout.exercise}</h3>
                    <div className={`ml-2 w-5 h-5 rounded-full ${colorThemeClasses.accent} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center mb-3 cursor-help`}>
                      <span className="text-xs font-bold">?</span>
                    </div>
                  </div>
                  <div className="absolute left-0 bottom-full mb-2 w-72 bg-white dark:bg-gray-800 p-3 rounded shadow-lg border border-gray-200 dark:border-gray-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                    <h4 className="font-bold mb-1">How to do it:</h4>
                    {workoutExercises[workout.type].find(ex => ex.name === workout.exercise)?.description || 'No description available.'}
                  </div>
                </div>
                
                <div className="flex justify-between mb-6">
                  {(workout.type === 'yoga' || workout.type === 'stretches') ? (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Duration</span>
                      <p className="text-lg font-semibold">{workout.duration} seconds per set</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Reps</span>
                      <p className="text-lg font-semibold">{workout.reps}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Sets</span>
                    <p className="text-lg font-semibold">{workout.sets}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => completeWorkout(index)}
                  className={`w-full py-3 rounded-lg font-medium ${colorThemeClasses.button}`}
                >
                  Complete {formatWorkoutType(workout.type)}
                </button>
              </div>
            )
          ))}
        </div>
      )}
      
      {showFeedback && (
        <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className={`text-lg font-semibold mb-3 ${colorThemeClasses.primary}`}>How was this workout?</h3>
          
          <div className="flex justify-between gap-2">
            <button
              onClick={() => provideFeedback('easy')}
              className="flex-1 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50"
            >
              Too Easy
            </button>
            <button
              onClick={() => provideFeedback('just-right')}
              className="flex-1 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
            >
              Just Right
            </button>
            <button
              onClick={() => provideFeedback('hard')}
              className="flex-1 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
            >
              Too Hard
            </button>
          </div>
        </div>
      )}
      
      {currentWorkouts.length > 0 && currentWorkouts.every((w: Workout) => w.completed) && !showFeedback && (
        <div className="text-center py-8">
          <p className={`font-semibold mb-4 ${colorThemeClasses.accent}`}>
            Great job! You have completed your active break.
          </p>
          <button
            onClick={onWorkoutComplete}
            className={`px-4 py-2 rounded ${colorThemeClasses.button}`}
          >
            Start Next Pomodoro
          </button>
        </div>
      )}
      
      {workoutHistory.length > 0 && (
        <div className="mt-6">
          <h3 className={`text-lg font-semibold mb-2 ${colorThemeClasses.primary}`}>Recent Workouts</h3>
          <ul className="space-y-2">
            {workoutHistory.slice(-3).reverse().map((workout, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300 group relative flex items-center">
                <span className="font-medium cursor-help">{workout.exercise}</span>
                <div className={`ml-1 w-4 h-4 rounded-full ${colorThemeClasses.accent} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center text-xs cursor-help`}>
                  <span className="text-xs font-bold">?</span>
                </div>
                <span className="text-gray-400 ml-1"> • {formatWorkoutType(workout.type)}</span>
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 p-3 rounded shadow-lg border border-gray-200 dark:border-gray-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  <h4 className="font-bold mb-1">{workout.exercise}:</h4>
                  {workoutExercises[workout.type].find(ex => ex.name === workout.exercise)?.description || 'No description available.'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default WorkoutPanel