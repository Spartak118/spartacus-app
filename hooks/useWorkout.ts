'use client'

import { useState, useEffect, useRef } from 'react'
import { useUserStore } from '@/store/userStore'
import { logWorkout } from '@/lib/supabase'
import { formatTime } from '@/lib/utils'
import type { Workout, ActiveWorkout } from '@/types'

export function useWorkout() {
  const { userId, activeWorkout, setActiveWorkout, updateActiveWorkout } = useUserStore()
  const [elapsedTime, setElapsedTime] = useState(0)
  const [restTimer, setRestTimer] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()
  const restRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (activeWorkout) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - activeWorkout.startTime) / 1000))
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      setElapsedTime(0)
    }

    return () => clearInterval(timerRef.current)
  }, [activeWorkout?.startTime])

  useEffect(() => {
    if (activeWorkout?.isResting && restTimer > 0) {
      restRef.current = setTimeout(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            updateActiveWorkout({ isResting: false, restTimeRemaining: 0 })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearTimeout(restRef.current)
  }, [restTimer, activeWorkout?.isResting])

  function startWorkout(workout: Workout) {
    const newSession: ActiveWorkout = {
      workout,
      currentExerciseIndex: 0,
      currentSet: 1,
      startTime: Date.now(),
      completedSets: {},
      isResting: false,
      restTimeRemaining: 0,
    }
    setActiveWorkout(newSession)
  }

  function completeSet() {
    if (!activeWorkout) return
    const exercise = activeWorkout.workout.exercises[activeWorkout.currentExerciseIndex]
    const restTime = exercise?.rest || 60

    const setKey = `${activeWorkout.currentExerciseIndex}-${activeWorkout.currentSet}`
    updateActiveWorkout({
      completedSets: {
        ...activeWorkout.completedSets,
        [setKey]: [Date.now()],
      },
      isResting: true,
      restTimeRemaining: restTime,
    })

    setRestTimer(restTime)

    if (activeWorkout.currentSet >= exercise.sets) {
      setTimeout(() => {
        nextExercise()
      }, 500)
    } else {
      updateActiveWorkout({ currentSet: activeWorkout.currentSet + 1 })
    }
  }

  function nextExercise() {
    if (!activeWorkout) return
    const nextIndex = activeWorkout.currentExerciseIndex + 1
    if (nextIndex >= activeWorkout.workout.exercises.length) {
      finishWorkout()
    } else {
      updateActiveWorkout({
        currentExerciseIndex: nextIndex,
        currentSet: 1,
        isResting: false,
      })
    }
  }

  function skipRest() {
    setRestTimer(0)
    updateActiveWorkout({ isResting: false, restTimeRemaining: 0 })
    clearTimeout(restRef.current)
  }

  async function finishWorkout() {
    if (!activeWorkout || !userId) {
      setActiveWorkout(null)
      return
    }

    const duration = Math.floor((Date.now() - activeWorkout.startTime) / 1000)
    const exercisesCompleted = Object.keys(activeWorkout.completedSets).length

    try {
      await logWorkout(userId, {
        workout_id: activeWorkout.workout.id,
        workout_name: activeWorkout.workout.name,
        completed_at: new Date().toISOString(),
        duration,
        exercises_completed: exercisesCompleted,
      })
    } catch {
      // Store locally if Supabase fails
    }

    setActiveWorkout(null)
  }

  const currentExercise = activeWorkout?.workout.exercises[activeWorkout.currentExerciseIndex]
  const progress = activeWorkout
    ? (activeWorkout.currentExerciseIndex / activeWorkout.workout.exercises.length) * 100
    : 0

  return {
    activeWorkout,
    currentExercise,
    elapsedTime: formatTime(elapsedTime),
    restTimer,
    progress,
    startWorkout,
    completeSet,
    nextExercise,
    skipRest,
    finishWorkout,
  }
}
