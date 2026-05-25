'use client'

import { motion } from 'framer-motion'
import type { Goal } from '@/types'
import { cn } from '@/lib/utils'

const GOALS: { id: Goal; emoji: string; label: string; description: string }[] = [
  { id: 'lose_fat', emoji: '🔥', label: 'Lose Fat', description: 'Burn body fat & get lean' },
  { id: 'build_muscle', emoji: '💪', label: 'Build Muscle', description: 'Add mass & strength' },
  { id: 'aesthetic', emoji: '⚡', label: 'Aesthetic Physique', description: 'Lean & defined look' },
  { id: 'greek_god', emoji: '🏛️', label: 'Greek God Physique', description: 'The ultimate aesthetic' },
  { id: 'athletic', emoji: '🎯', label: 'Athletic Body', description: 'Performance & function' },
  { id: 'beginner', emoji: '✨', label: 'Beginner Transformation', description: 'Start your journey' },
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
            'select-card rounded-2xl p-4 text-left flex flex-col gap-2',
            selected === goal.id && 'selected',
          )}
        >
          <span className="text-3xl">{goal.emoji}</span>
          <div>
            <p className={cn(
              'text-sm font-bold',
              selected === goal.id ? 'text-gold' : 'text-[#F5F5F5]'
            )}>
              {goal.label}
            </p>
            <p className="text-xs text-[#666] mt-0.5 leading-relaxed">{goal.description}</p>
          </div>
          {selected === goal.id && (
            <div className="w-full h-0.5 bg-gold rounded-full" />
          )}
        </motion.button>
      ))}
    </div>
  )
}
