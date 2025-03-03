'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Confetti from 'react-confetti'

// Define workout types and data
const WORKOUT_TYPES = {
  STRETCHES: 'stretches',
  YOGA: 'yoga',
  CALISTHENICS: 'calisthenics'
}

const workoutExercises = {
  [WORKOUT_TYPES.STRETCHES]: [
    { name: 'Butterfly Stretch', difficulty: 1 },
    { name: 'Hamstring Stretch', difficulty: 1 },
    { name: 'Neck Rolls', difficulty: 1 },
    { name: 'Arm Circles', difficulty: 1 },
    { name: 'Hip Flexor Stretch', difficulty: 2 },
    { name: 'Shoulder Stretch', difficulty: 2 },
    { name: 'Quad Stretch', difficulty: 2 },
    { name: 'Wrist Stretch', difficulty: 1 }
  ],
  [WORKOUT_TYPES.YOGA]: [
    { name: 'Downward Dog', difficulty: 2 },
    { name: 'Warrior Pose', difficulty: 2 },
    { name: 'Child\'s Pose', difficulty: 1 },
    { name: 'Cat-Cow Stretch', difficulty: 1 },
    { name: 'Tree Pose', difficulty: 3 },
    { name: 'Mountain Pose', difficulty: 1 },
    { name: 'Bridge Pose', difficulty: 2 },
    { name: 'Cobra Pose', difficulty: 2 }
  ],
  [WORKOUT_TYPES.CALISTHENICS]: [
    { name: 'Push-ups', difficulty: 3 },
    { name: 'Sit-ups', difficulty: 2 },
    { name: 'Squats', difficulty: 2 },
    { name: 'Lunges', difficulty: 2 },
    { name: 'Jumping Jacks', difficulty: 1 },
    { name: 'Plank', difficulty: 3 },
    { name: 'Mountain Climbers', difficulty: 3 },
    { name: 'Burpees', difficulty: 4 }
  ]
}

interface Workout {
  type: string
  exercise: string
  reps: number
  sets: number
  completed: boolean
}

interface WorkoutPanelProps {
  isActive: boolean
  onWorkoutComplete: () => void
}

const WorkoutPanel: React.FC<WorkoutPanelProps> = ({ isActive, onWorkoutComplete }) => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null)
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [userPreferences, setUserPreferences] = useState({
    stretchesDifficulty: 1,
    yogaDifficulty: 1,
    calisthenicsDifficulty: 1
  })
  
  // Load workout history and preferences from cookies on initial render
  useEffect(() => {
    const savedHistory = Cookies.get('workoutHistory')
    if (savedHistory) {
      try {
        setWorkoutHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Failed to parse workout history from cookies')
      }
    }
    
    const savedPreferences = Cookies.get('workoutPreferences')
    if (savedPreferences) {
      try {
        setUserPreferences(JSON.parse(savedPreferences))
      } catch (e) {
        console.error('Failed to parse workout preferences from cookies')
      }
    }
  }, [])
  
  // Save workout history to cookies whenever it changes
  useEffect(() => {
    Cookies.set('workoutHistory', JSON.stringify(workoutHistory), { expires: 365 })
  }, [workoutHistory])
  
  // Save user preferences to cookies whenever they change
  useEffect(() => {
    Cookies.set('workoutPreferences', JSON.stringify(userPreferences), { expires: 365 })
  }, [userPreferences])
  
  // Generate a new workout when the timer completes
  useEffect(() => {
    if (isActive && (!currentWorkout || currentWorkout.completed)) {
      generateWorkout()
    }
  }, [isActive, currentWorkout])
  
  const generateWorkout = () => {
    // Randomly select workout type
    const workoutTypes = Object.values(WORKOUT_TYPES)
    const randomType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)]
    
    // Get available exercises for the selected type
    const exercises = workoutExercises[randomType]
    
    // Filter exercises based on user's preferred difficulty
    let difficultyPreference
    switch(randomType) {
      case WORKOUT_TYPES.STRETCHES:
        difficultyPreference = userPreferences.stretchesDifficulty
        break
      case WORKOUT_TYPES.YOGA:
        difficultyPreference = userPreferences.yogaDifficulty
        break
      case WORKOUT_TYPES.CALISTHENICS:
        difficultyPreference = userPreferences.calisthenicsDifficulty
        break
      default:
        difficultyPreference = 1
    }
    
    // Get exercises that match the user's preferred difficulty (±1)
    const suitableExercises = exercises.filter(ex => 
      Math.abs(ex.difficulty - difficultyPreference) <= 1
    )
    
    // If no suitable exercises, fall back to all exercises
    const availableExercises = suitableExercises.length > 0 ? suitableExercises : exercises
    
    // Select a random exercise
    const randomExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)]
    
    // Determine reps and sets based on difficulty
    let reps, sets
    switch(randomExercise.difficulty) {
      case 1:
        reps = 10
        sets = 3
        break
      case 2:
        reps = 8
        sets = 3
        break
      case 3:
        reps = 6
        sets = 3
        break
      case 4:
        reps = 5
        sets = 2
        break
      default:
        reps = 10
        sets = 3
    }
    
    // Create the workout
    const newWorkout: Workout = {
      type: randomType,
      exercise: randomExercise.name,
      reps,
      sets,
      completed: false
    }
    
    setCurrentWorkout(newWorkout)
    setShowFeedback(false)
  }
  
  const completeWorkout = () => {
    if (!currentWorkout) return
    
    // Mark as completed
    const completedWorkout = { ...currentWorkout, completed: true }
    setCurrentWorkout(completedWorkout)
    
    // Add to history
    setWorkoutHistory([...workoutHistory, completedWorkout])
    
    // Show confetti
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
    
    // Show feedback dialog
    setShowFeedback(true)
  }
  
  const provideFeedback = (feedback: string) => {
    if (!currentWorkout) return
    
    // Adjust difficulty preference based on feedback
    const newPreferences = { ...userPreferences }
    
    switch(currentWorkout.type) {
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
    
    setUserPreferences(newPreferences)
    setShowFeedback(false)
    onWorkoutComplete()
  }
  
  // Format the workout type for display
  const formatWorkoutType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <h2 className="text-xl font-semibold mb-4">Active Break Workout</h2>
      
      {!isActive && !currentWorkout?.completed && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Complete your Pomodoro timer to get an active break workout.
          </p>
          <button
            onClick={generateWorkout}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Generate Workout Now
          </button>
        </div>
      )}
      
      {currentWorkout && !currentWorkout.completed && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-500 font-medium">
              {formatWorkoutType(currentWorkout.type)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ~3 minutes
            </span>
          </div>
          
          <h3 className="text-xl font-bold mb-3">{currentWorkout.exercise}</h3>
          
          <div className="flex justify-between mb-6">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Reps</span>
              <p className="text-lg font-semibold">{currentWorkout.reps}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Sets</span>
              <p className="text-lg font-semibold">{currentWorkout.sets}</p>
            </div>
          </div>
          
          <button
            onClick={completeWorkout}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
          >
            Complete Workout
          </button>
        </div>
      )}
      
      {showFeedback && (
        <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">How was this workout?</h3>
          
          <div className="flex justify-between gap-2">
            <button
              onClick={() => provideFeedback('easy')}
              className="flex-1 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
            >
              Too Easy
            </button>
            <button
              onClick={() => provideFeedback('just-right')}
              className="flex-1 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
            >
              Just Right
            </button>
            <button
              onClick={() => provideFeedback('hard')}
              className="flex-1 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
            >
              Too Hard
            </button>
          </div>
        </div>
      )}
      
      {currentWorkout && currentWorkout.completed && !showFeedback && (
        <div className="text-center py-8">
          <p className="text-green-500 font-semibold mb-4">
            Great job! You've completed your active break.
          </p>
          <button
            onClick={() => onWorkoutComplete()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Start Next Pomodoro
          </button>
        </div>
      )}
      
      {workoutHistory.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Workouts</h3>
          <ul className="space-y-2">
            {workoutHistory.slice(-3).reverse().map((workout, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">{workout.exercise}</span>
                <span className="text-gray-400"> • {formatWorkoutType(workout.type)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default WorkoutPanel