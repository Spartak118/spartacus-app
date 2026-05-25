'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, CheckCircle2, ChevronRight, Dumbbell, Clock, Trophy } from 'lucide-react'
import { WORKOUTS, WORKOUT_CATEGORIES, getWorkoutsByCategory, getFeaturedWorkouts, SPLIT_SCHEDULES } from '@/lib/workouts'
import { useWorkout } from '@/hooks/useWorkout'
import { useUserStore } from '@/store/userStore'
import { WorkoutCard } from '@/components/workout/WorkoutCard'
import { ExerciseCard } from '@/components/workout/ExerciseCard'
import { WorkoutTimer } from '@/components/workout/WorkoutTimer'
import { RestTimer } from '@/components/workout/RestTimer'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { cn, getDayOfWeek, getWeekDates } from '@/lib/utils'

type Tab = 'plan' | 'browse' | 'history'

export default function WorkoutPage() {
  const router = useRouter()
  const { plan, profile } = useUserStore()
  const [tab, setTab] = useState<Tab>('plan')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null)
  const [showActiveWorkout, setShowActiveWorkout] = useState(false)
  const [workoutComplete, setWorkoutComplete] = useState(false)

  const { activeWorkout, currentExercise, elapsedTime, restTimer, progress,
    startWorkout, completeSet, nextExercise, skipRest, finishWorkout } = useWorkout()

  const todayDay = getDayOfWeek()
  const split = plan?.workoutSplit || 'Full Body'
  const schedule = SPLIT_SCHEDULES[split] || {}
  const weekDates = getWeekDates()

  const selectedWorkout = selectedWorkoutId ? WORKOUTS.find(w => w.id === selectedWorkoutId) : null
  const filteredWorkouts = getWorkoutsByCategory(selectedCategory)
  const featuredWorkouts = getFeaturedWorkouts()

  function handleStartWorkout(workout: typeof WORKOUTS[0]) {
    startWorkout(workout)
    setShowActiveWorkout(true)
    setWorkoutComplete(false)
  }

  async function handleFinishWorkout() {
    await finishWorkout()
    setShowActiveWorkout(false)
    setWorkoutComplete(true)
  }

  // Active Workout Mode
  if (showActiveWorkout && activeWorkout) {
    const exercise = activeWorkout.workout.exercises[activeWorkout.currentExerciseIndex]
    const totalExercises = activeWorkout.workout.exercises.length
    const isLast = activeWorkout.currentExerciseIndex >= totalExercises - 1 && activeWorkout.currentSet >= (exercise?.sets || 1)

    return (
      <div className="h-full flex flex-col bg-bg overflow-hidden">
        {/* Header */}
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.98) 80%, transparent)' }}
        >
          <div className="flex items-center justify-between px-4 pt-safe pb-4">
            <button
              onClick={() => setShowActiveWorkout(false)}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center active:scale-90 transition-transform"
            >
              <X size={18} className="text-[#888]" />
            </button>
            <div className="text-center">
              <p className="text-xs text-[#888] font-semibold uppercase tracking-widest">Workout Active</p>
              <WorkoutTimer elapsed={elapsedTime} />
            </div>
            <ProgressRing value={Math.round(progress)} max={100} size={40} strokeWidth={4} color="#C8A96E" label={`${Math.round(progress)}%`} />
          </div>
          <div className="h-1 bg-white/5 mx-4 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Current exercise */}
        <div className="flex-1 overflow-y-auto pt-28 pb-8 px-4">
          {exercise && (
            <motion.div
              key={activeWorkout.currentExerciseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Exercise display */}
              <div className="text-center pt-4">
                <div
                  className="w-full h-48 rounded-3xl mb-4 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.1) 0%, rgba(200,169,110,0.05) 100%)' }}
                >
                  <div className="text-center">
                    <span className="text-6xl">🏋️</span>
                    <p className="text-[#666] text-xs mt-2">{exercise.equipment}</p>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-[#F5F5F5] mb-1">{exercise.name}</h2>
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-gold text-4xl font-black tabular-nums">
                    {exercise.sets} × {exercise.reps}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm text-[#888]">
                  <span>Set {activeWorkout.currentSet} of {exercise.sets}</span>
                  <span>·</span>
                  <span>Rest {exercise.rest}s</span>
                </div>
                {exercise.notes && (
                  <p className="text-[#666] text-xs mt-3 mx-4 leading-relaxed">{exercise.notes}</p>
                )}
              </div>

              {/* Exercise list mini */}
              <div className="space-y-2">
                <p className="text-xs text-[#666] uppercase tracking-widest font-semibold px-1">All Exercises</p>
                {activeWorkout.workout.exercises.map((ex, i) => (
                  <div key={ex.id} className={cn(
                    'flex items-center gap-3 p-3 rounded-xl',
                    i === activeWorkout.currentExerciseIndex ? 'bg-gold/10 border border-gold/20' : 'bg-white/3'
                  )}>
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                      i < activeWorkout.currentExerciseIndex ? 'bg-gold/30 text-gold' : i === activeWorkout.currentExerciseIndex ? 'bg-gold text-black' : 'bg-white/5 text-[#555]'
                    )}>
                      {i < activeWorkout.currentExerciseIndex ? '✓' : i + 1}
                    </div>
                    <span className={cn('text-sm font-medium truncate', i <= activeWorkout.currentExerciseIndex ? 'text-[#F5F5F5]' : 'text-[#555]')}>
                      {ex.name}
                    </span>
                    <span className="ml-auto text-xs text-[#555] flex-shrink-0">{ex.sets}×{ex.reps}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="px-4 pb-8 pt-4 bg-gradient-to-t from-bg to-transparent">
          {isLast ? (
            <Button variant="gold" fullWidth size="lg" onClick={handleFinishWorkout}>
              Complete Workout 🏆
            </Button>
          ) : (
            <Button variant="gold" fullWidth size="lg" onClick={completeSet}>
              Complete Set → Rest
            </Button>
          )}
          <button onClick={nextExercise} className="w-full text-center text-[#555] text-sm py-3">
            Skip Exercise
          </button>
        </div>

        {/* Rest timer overlay */}
        {activeWorkout.isResting && restTimer > 0 && (
          <RestTimer
            seconds={restTimer}
            totalSeconds={exercise?.rest || 60}
            onSkip={skipRest}
          />
        )}
      </div>
    )
  }

  // Workout complete celebration
  if (workoutComplete) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-bg px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-3xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-6"
          style={{ boxShadow: '0 0 60px rgba(200,169,110,0.3)' }}
        >
          <Trophy size={40} className="text-gold" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-black text-[#F5F5F5] mb-2">Workout Complete!</h2>
          <p className="text-[#888] text-sm mb-8">Another step toward your legend.</p>
          <Button variant="gold" onClick={() => setWorkoutComplete(false)}>
            Back to Workouts
          </Button>
        </motion.div>
      </div>
    )
  }

  // Workout Detail View
  if (selectedWorkout) {
    return (
      <div className="h-full overflow-y-auto bg-bg">
        <div className="sticky top-0 z-10 px-4 pt-safe pb-2"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.95) 80%, transparent)' }}>
          <button
            onClick={() => setSelectedWorkoutId(null)}
            className="flex items-center gap-2 text-[#888] py-3 active:scale-95 transition-transform"
          >
            <X size={18} />
            <span className="text-sm">Close</span>
          </button>
        </div>

        <div className="px-4 pb-8">
          <div className="relative mb-6">
            <div
              className="w-full h-44 rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.15) 0%, rgba(200,169,110,0.05) 100%)' }}
            >
              <span className="text-7xl">🏋️</span>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              {selectedWorkout.isFeatured && (
                <span className="text-[10px] text-gold border border-gold/30 bg-gold/10 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">
                  Featured
                </span>
              )}
              <span className="text-[10px] text-[#888] uppercase tracking-wider">{selectedWorkout.category}</span>
            </div>

            <h1 className="text-2xl font-black text-[#F5F5F5] leading-tight mb-2">{selectedWorkout.name}</h1>
            <p className="text-[#888] text-sm leading-relaxed mb-4">{selectedWorkout.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-[#888] text-sm">
                <Clock size={14} className="text-gold" />
                <span>{selectedWorkout.duration} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#888] text-sm">
                <Dumbbell size={14} className="text-gold" />
                <span>{selectedWorkout.exercises.length} exercises</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedWorkout.muscleGroups.map(g => (
                <span key={g} className="text-xs bg-gold/10 text-gold border border-gold/20 rounded-xl px-3 py-1">{g}</span>
              ))}
            </div>

            <Button variant="gold" fullWidth size="lg" onClick={() => handleStartWorkout(selectedWorkout)}>
              <Play size={18} className="mr-2" />
              Start Workout
            </Button>
          </motion.div>

          <div className="mt-8">
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest mb-4">Exercises</h3>
            <div className="space-y-3">
              {selectedWorkout.exercises.map((exercise, i) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={i} delay={i * 0.05} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="px-4 pt-safe pb-0">
        <div className="flex items-center justify-between pt-4 pb-4">
          <h1 className="text-2xl font-black text-[#F5F5F5]">Workouts</h1>
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Dumbbell size={18} className="text-gold" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/3 rounded-2xl p-1 mb-4">
          {(['plan', 'browse', 'history'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200',
                tab === t ? 'bg-gold text-black' : 'text-[#888]'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <AnimatePresence mode="wait">
          {tab === 'plan' && (
            <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Week grid */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {weekDates.map(({ day, date, short }) => {
                  const workoutId = schedule[day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday']
                  const isToday = day === getDayOfWeek().slice(0, 3)
                  const hasWorkout = workoutId && workoutId !== 'Rest'
                  return (
                    <div key={day} className={cn(
                      'flex flex-col items-center py-2 rounded-xl',
                      isToday ? 'bg-gold/10 border border-gold/30' : 'bg-white/3'
                    )}>
                      <span className={cn('text-[10px] font-semibold', isToday ? 'text-gold' : 'text-[#555]')}>{day}</span>
                      <span className={cn('text-sm font-black my-0.5', isToday ? 'text-gold' : 'text-[#888]')}>{short}</span>
                      <div className={cn('w-1.5 h-1.5 rounded-full', hasWorkout ? 'bg-gold' : 'bg-white/10')} />
                    </div>
                  )
                })}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-[#888] uppercase tracking-widest font-semibold">Your Split</p>
                  <span className="text-xs text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-full">{split}</span>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(schedule).map(([day, workoutId]) => {
                  const workout = workoutId !== 'Rest' ? WORKOUTS.find(w => w.id === workoutId) : null
                  const isToday = day === todayDay
                  return (
                    <div key={day} className={cn('glass-card rounded-2xl p-4', isToday && 'border-gold-glow')}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isToday && <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />}
                          <span className={cn('text-sm font-bold', isToday ? 'text-gold' : 'text-[#888]')}>{day}</span>
                        </div>
                        {workout ? (
                          <button onClick={() => setSelectedWorkoutId(workout.id)} className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#F5F5F5]">{workout.name}</p>
                              <p className="text-xs text-[#666]">{workout.muscleGroups.slice(0, 2).join(' · ')}</p>
                            </div>
                            <ChevronRight size={14} className="text-[#444]" />
                          </button>
                        ) : (
                          <span className="text-sm text-[#444] font-medium">Rest Day 😴</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {tab === 'browse' && (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Featured */}
              <div className="mb-6">
                <p className="text-xs text-[#888] uppercase tracking-widest font-semibold mb-3">🏛️ Greek God Series</p>
                <div className="space-y-3">
                  {featuredWorkouts.map((w, i) => (
                    <WorkoutCard key={w.id} workout={w} onClick={() => setSelectedWorkoutId(w.id)} delay={i * 0.05} />
                  ))}
                </div>
              </div>

              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {WORKOUT_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all duration-200',
                      selectedCategory === cat
                        ? 'bg-gold text-black'
                        : 'bg-white/5 text-[#888]'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredWorkouts.map((w, i) => (
                  <WorkoutCard key={w.id} workout={w} onClick={() => setSelectedWorkoutId(w.id)} delay={i * 0.04} />
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/3 flex items-center justify-center mb-4">
                  <Dumbbell size={28} className="text-[#333]" />
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5] mb-2">No Workouts Yet</h3>
                <p className="text-[#666] text-sm mb-6">Complete your first workout to see your history here.</p>
                <Button variant="outline" onClick={() => setTab('browse')}>
                  Browse Workouts
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
