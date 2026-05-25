'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Dumbbell, Clock, ChevronRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Workout } from '@/types'

interface TodayWorkoutProps {
  workout: Workout | null
  isRestDay?: boolean
}

export function TodayWorkout({ workout, isRestDay = false }: TodayWorkoutProps) {
  const router = useRouter()

  if (isRestDay || !workout) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="glass-card rounded-3xl p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
            <span className="text-xl">😴</span>
          </div>
          <div>
            <h3 className="font-bold text-[#F5F5F5] text-sm">Rest & Recovery</h3>
            <p className="text-[#888] text-xs">Today is your rest day</p>
          </div>
        </div>
        <p className="text-[#666] text-sm">
          Recovery is where growth happens. Sleep well, eat your protein, and come back stronger tomorrow.
        </p>
      </motion.div>
    )
  }

  const difficultyColors = {
    beginner: '#A8D9A0',
    intermediate: '#C8A96E',
    advanced: '#D9A0A0',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="glass-card border-gold-glow rounded-3xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
            <Dumbbell size={20} className="text-gold" />
          </div>
          <div>
            <p className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-0.5">Today's Workout</p>
            <h3 className="font-black text-[#F5F5F5] text-base leading-tight">{workout.name}</h3>
          </div>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border"
          style={{
            color: difficultyColors[workout.difficulty],
            borderColor: `${difficultyColors[workout.difficulty]}40`,
            backgroundColor: `${difficultyColors[workout.difficulty]}15`,
          }}
        >
          {workout.difficulty}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-[#888] text-xs">
          <Clock size={12} />
          <span>{workout.duration} min</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#888] text-xs">
          <Zap size={12} />
          <span>{workout.exercises.length} exercises</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {workout.muscleGroups.map(group => (
          <span key={group} className="text-xs bg-white/5 text-[#888] rounded-lg px-2.5 py-1">
            {group}
          </span>
        ))}
      </div>

      <Button
        variant="gold"
        fullWidth
        onClick={() => router.push(`/workout?id=${workout.id}`)}
      >
        Start Workout
        <ChevronRight size={18} className="ml-1" />
      </Button>
    </motion.div>
  )
}
