'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Info } from 'lucide-react'
import type { Exercise } from '@/types'
import { cn } from '@/lib/utils'

interface ExerciseCardProps {
  exercise: Exercise
  index: number
  isActive?: boolean
  isCompleted?: boolean
  delay?: number
}

export function ExerciseCard({ exercise, index, isActive, isCompleted, delay = 0 }: ExerciseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        'glass-card rounded-2xl p-4 relative overflow-hidden',
        isActive && 'border-gold-glow',
        isCompleted && 'opacity-60',
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold rounded-l-2xl" />
      )}

      <div className="flex items-start gap-4">
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0',
          isCompleted ? 'bg-gold/20 text-gold' : 'bg-white/5 text-[#888]'
        )}>
          {isCompleted ? <CheckCircle2 size={18} className="text-gold" /> : index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-bold text-[#F5F5F5] text-sm leading-tight">{exercise.name}</h4>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-gold font-black text-lg tabular-nums">
              {exercise.sets} × {exercise.reps}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] bg-white/5 text-[#888] px-2 py-0.5 rounded-full">
              {exercise.muscleGroup}
            </span>
            <span className="text-[10px] bg-white/5 text-[#888] px-2 py-0.5 rounded-full">
              {exercise.equipment}
            </span>
            <span className="text-[10px] text-[#666]">
              Rest: {exercise.rest}s
            </span>
          </div>

          {exercise.notes && (
            <div className="mt-2 flex items-start gap-1.5">
              <Info size={11} className="text-gold/60 mt-0.5 flex-shrink-0" />
              <p className="text-[#666] text-xs leading-relaxed">{exercise.notes}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
