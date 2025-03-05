'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { FaEllipsisH, FaEye, FaEyeSlash, FaTrash, FaPlus } from 'react-icons/fa'
import Confetti from 'react-confetti'
import useSound from 'use-sound'
import { useTheme } from '@/components/ui/ThemeProvider'
import { useAppState } from '@/components/ui/AppProvider'
import { Task } from '@/lib/types'

const TaskPanel = () => {
  const [newTaskText, setNewTaskText] = useState('')
  const [showCompleted, setShowCompleted] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [playCelebration] = useSound('/sounds/winner.mp3')
  const { colorThemeClasses, settings } = useTheme()
  const { tasks, updateTasks } = useAppState()
  
  const addTask = () => {
    if (newTaskText.trim() === '') return
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      createdAt: Date.now(),
    }
    
    updateTasks([...tasks, newTask])
    setNewTaskText('')
  }
  
  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed
        if (newCompleted) {
          // Task was just completed, show confetti
          setShowConfetti(true)
          playCelebration();
          setTimeout(() => setShowConfetti(false), 3000)
          return { 
            ...task, 
            completed: newCompleted,
            completedAt: Date.now()
          }
        }
        return { 
          ...task, 
          completed: newCompleted,
          completedAt: undefined
        }
      }
      return task
    })
    
    updateTasks(updatedTasks)
  }
  
  const updateTaskText = (id: string, newText: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, text: newText } : task
    )
    updateTasks(updatedTasks)
  }
  
  const deleteCompletedTasks = () => {
    const updatedTasks = tasks.filter(task => !task.completed)
    updateTasks(updatedTasks)
  }
  
  // Make sure drag and drop reordering works for tasks
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    
    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    // Update the tasks with the new order
    updateTasks(items)
  }
  
  // Sort tasks to put completed tasks at the bottom
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });
  
  const filteredTasks = showCompleted 
    ? sortedTasks 
    : sortedTasks.filter(task => !task.completed)
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 relative">
      {showConfetti && 
        <Confetti 
          recycle={false} 
          numberOfPieces={settings.confettiDensity === 'low' ? 100 : settings.confettiDensity === 'medium' ? 200 : 400} 
        />
      }
      
      <div className="flex justify-between items-center mb-5">
        <h2 className={`text-xl font-semibold ${colorThemeClasses.primary}`}>Work Tasks</h2>
        <button 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
          onClick={() => setShowSettings(!showSettings)}
        >
          <FaEllipsisH />
        </button>
      </div>
      
      {showSettings && (
        <div className="absolute right-6 top-14 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-3 z-10 border border-gray-100 dark:border-gray-600">
          <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded"
               onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? <FaEyeSlash className={colorThemeClasses.accent} /> : <FaEye className={colorThemeClasses.accent} />}
            <span>{showCompleted ? 'Hide' : 'Show'} Completed Tasks</span>
          </div>
          <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded text-red-500"
               onClick={deleteCompletedTasks}>
            <FaTrash />
            <span>Delete All Completed Tasks</span>
          </div>
        </div>
      )}
      
      <div className="flex mb-5">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style={{ 
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)", 
            borderRight: "none" 
          }}
          placeholder="Add a new task..."
        />
        <button 
          onClick={addTask}
          className={`px-4 py-3 rounded-r-md flex items-center justify-center transition-all ${colorThemeClasses.button}`}
        >
          <FaPlus className="mr-1" /> Add
        </button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-3 border rounded-md flex items-center gap-3 shadow-sm transition-all ${
                        task.completed 
                          ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700' 
                          : `bg-white dark:bg-gray-800 ${colorThemeClasses.border}`
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className={`h-5 w-5 cursor-pointer rounded-sm border-2 appearance-none 
                            ${task.completed 
                              ? `${colorThemeClasses.accent} border-transparent` 
                              : 'border-gray-300 dark:border-gray-600'}`}
                        />
                        {task.completed && (
                          <svg 
                            className="absolute top-0 left-0 h-5 w-5 text-white pointer-events-none" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type="text"
                        value={task.text}
                        onChange={(e) => updateTaskText(task.id, e.target.value)}
                        className={`flex-1 bg-transparent focus:outline-none ${
                          task.completed 
                            ? 'line-through text-gray-400 dark:text-gray-500' 
                            : ''
                        }`}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      
      {tasks.length === 0 && (
        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No tasks yet. Add some tasks to get started!
          </p>
        </div>
      )}
    </div>
  )
}

export default TaskPanel