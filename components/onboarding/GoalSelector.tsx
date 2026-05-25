'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Dumbbell, Sparkles, Shield, Activity, Rocket } from 'lucide-react'
import type { Goal } from '@/types'
import { cn } from '@/lib/utils'

const GOALS: { id: Goal; icon: React.ReactNode; label: string; description: string }[] = [
  { id: 'lose_fat', icon: <TrendingDown size={20} />, label: 'Lose Fat', description: 'Reduce body fat while preserving muscle' },
  { id: 'build_muscle', icon: <Dumbbell size={20} />, label: 'Build Muscle', description: 'Add mass and increase strength' },
  { id: 'aesthetic', icon: <Sparkles size={20} />, label: 'Aesthetic Physique', description: 'Lean, defined, balanced look' },
  { id: 'greek_god', icon: <Shield size={20} />, label: 'Greek God Physique', description: 'Maximum muscle with minimal fat' },
  { id: 'athletic', icon: <Activity size={20} />, label: 'Athletic Body', description: 'Performance, power, and function' },
  { id: 'beginner', icon: <Rocket size={20} />, label: 'First Transformation', description: 'Build the habit and foundation' },
]

interface GoalSelectorProps {
  selected?: Goal
  onSelect: (goal: Goal) => void
}

export function GoalSelector({ selected, onSelect }: GoalSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {GOALS.map((goal, i) => (
        <motion.button
          key={goal.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(goal.id)}
          className={cn(
            'select-card rounded-2xl p-4 text-left flex flex-col gap-3',
            selected === goal.id && 'selected',
          )}
        >
          <div className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center',
            selected === goal.id
              ? 'bg-gold/20 text-gold'
              : 'bg-white/5 text-[#666]'
          )}>
            {goal.icon}
          </div>
          <div>
            <p className={cn(
              'text-sm font-bold',
              selected === goal.id ? 'text-gold' : 'text-cream'
            )}>
              {goal.label}
            </p>
            <p className="text-xs text-[#666] mt-0.5 leading-relaxed">{goal.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
