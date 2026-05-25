'use client'

import { motion } from 'framer-motion'
import { Clock, Zap, Star, ChevronRight, Dumbbell, ArrowDownUp, Triangle, CircleDot, Layers, Activity, Cpu, MoveRight, Heart } from 'lucide-react'
import type { Workout } from '@/types'
import { cn } from '@/lib/utils'

interface WorkoutCardProps {
  workout: Workout
  onClick: () => void
  delay?: number
  isToday?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  Push: '#C8A96E',
  Pull: '#A0C8D9',
  Legs: '#D9A0A0',
  Shoulders: '#C8A96E',
  Back: '#A0C8D9',
  Core: '#A8D9A0',
  'Full Body': '#E8C98E',
  Cardio: '#D9C0A0',
  Arms: '#C8A96E',
  Recovery: '#A0D9C0',
  Default: '#888888',
}

export function WorkoutCard({ workout, onClick, delay = 0, isToday = false }: WorkoutCardProps) {
  const color = CATEGORY_COLORS[workout.category] || CATEGORY_COLORS.Default
  const difficultyStars = { beginner: 1, intermediate: 2, advanced: 3 }[workout.difficulty]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'glass-card rounded-3xl p-4 cursor-pointer',
        isToday && 'border-gold-glow',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          {workout.isFeatured && (
            <div className="flex items-center gap-1 mb-1.5">
              <Star size={10} className="text-gold fill-gold" />
              <span className="text-[10px] text-gold font-bold uppercase tracking-widest">Featured</span>
            </div>
          )}
          {isToday && (
            <div className="flex items-center gap-1 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] text-gold font-bold uppercase tracking-widest">Today</span>
            </div>
          )}
          <h3 className="font-black text-[#F5F5F5] text-base leading-tight mb-1 truncate">{workout.name}</h3>
          <p className="text-[#666] text-xs leading-relaxed line-clamp-2">{workout.description}</p>
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
          <CategoryIcon category={workout.category} color={color} />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1 text-[#888] text-xs">
          <Clock size={11} />
          <span>{workout.duration}m</span>
        </div>
        <div className="flex items-center gap-1 text-[#888] text-xs">
          <Zap size={11} />
          <span>{workout.exercises.length} ex</span>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Star
              key={i}
              size={10}
              className={i < difficultyStars ? 'text-gold fill-gold' : 'text-white/10'}
            />
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-1">
          {workout.muscleGroups.slice(0, 2).map(g => (
            <span key={g} className="text-[10px] px-2 py-0.5 rounded-full text-[#888]"
              style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}>
              {g}
            </span>
          ))}
        </div>
        <ChevronRight size={14} className="text-[#444] flex-shrink-0" />
      </div>
    </motion.div>
  )
}

function CategoryIcon({ category, color }: { category: string; color: string }) {
  const iconProps = { size: 20, color }
  const map: Record<string, React.ReactNode> = {
    Push: <Dumbbell {...iconProps} />,
    Pull: <ArrowDownUp {...iconProps} />,
    Legs: <Triangle {...iconProps} />,
    Shoulders: <CircleDot {...iconProps} />,
    Back: <Layers {...iconProps} />,
    Core: <Cpu {...iconProps} />,
    'Full Body': <Dumbbell {...iconProps} />,
    Cardio: <Activity {...iconProps} />,
    Arms: <MoveRight {...iconProps} />,
    Recovery: <Heart {...iconProps} />,
    Power: <Zap {...iconProps} />,
  }
  return <>{map[category] || <Dumbbell {...iconProps} />}</>
}
