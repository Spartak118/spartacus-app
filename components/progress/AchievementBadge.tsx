'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { Achievement } from '@/types'
import { cn } from '@/lib/utils'

interface AchievementBadgeProps {
  achievement: Achievement
  delay?: number
}

export function AchievementBadge({ achievement, delay = 0 }: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      className={cn(
        'glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-2',
        achievement.unlocked ? 'achievement-unlocked' : 'opacity-50',
      )}
    >
      <div className={cn(
        'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl',
        achievement.unlocked
          ? 'bg-gold/10 border border-gold/30'
          : 'bg-white/3 border border-white/5',
      )}>
        {achievement.unlocked ? achievement.emoji : <Lock size={20} className="text-[#444]" />}
      </div>

      <div>
        <h4 className={cn(
          'text-xs font-bold leading-tight',
          achievement.unlocked ? 'text-[#F5F5F5]' : 'text-[#555]'
        )}>
          {achievement.name}
        </h4>
        <p className="text-[10px] text-[#555] mt-0.5 leading-tight">{achievement.description}</p>
      </div>

      {achievement.unlocked ? (
        <span className="text-[10px] text-gold font-semibold">Unlocked ✓</span>
      ) : achievement.progress !== undefined ? (
        <div className="w-full space-y-1">
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/20 rounded-full"
              style={{ width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%` }}
            />
          </div>
          <span className="text-[9px] text-[#555]">
            {achievement.progress}/{achievement.maxProgress}
          </span>
        </div>
      ) : null}
    </motion.div>
  )
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: 'Transformation Started', description: 'Complete onboarding', emoji: '🎯', requirement: 'onboarding', unlocked: true, progress: 1, maxProgress: 1 },
  { id: 'a2', name: 'First Week Warrior', description: '7 day streak', emoji: '🔥', requirement: 'streak_7', unlocked: false, progress: 2, maxProgress: 7 },
  { id: 'a3', name: 'Iron Discipline', description: '30 day streak', emoji: '💪', requirement: 'streak_30', unlocked: false, progress: 2, maxProgress: 30 },
  { id: 'a4', name: 'Protein King', description: 'Hit protein 7 days in a row', emoji: '👑', requirement: 'protein_7', unlocked: false, progress: 1, maxProgress: 7 },
  { id: 'a5', name: 'Greek God Initiate', description: 'Complete 10 workouts', emoji: '🏛️', requirement: 'workouts_10', unlocked: false, progress: 0, maxProgress: 10 },
  { id: 'a6', name: 'Hydration Hero', description: 'Hit water goal 5 days', emoji: '💧', requirement: 'water_5', unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'a7', name: 'Early Riser', description: 'Log a workout before 7am', emoji: '🌅', requirement: 'early_workout', unlocked: false },
  { id: 'a8', name: 'Night Warrior', description: 'Complete 5 evening workouts', emoji: '🌙', requirement: 'evening_5', unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'a9', name: 'Century Club', description: 'Complete 100 workouts', emoji: '💯', requirement: 'workouts_100', unlocked: false, progress: 0, maxProgress: 100 },
  { id: 'a10', name: 'Sleep Champion', description: '7+ hours for 7 days', emoji: '😴', requirement: 'sleep_7', unlocked: false, progress: 0, maxProgress: 7 },
  { id: 'a11', name: 'Transformation Journey', description: '90 days in program', emoji: '⚔️', requirement: 'days_90', unlocked: false, progress: 1, maxProgress: 90 },
  { id: 'a12', name: 'Meal Prep Pro', description: 'Log 30 meals', emoji: '🍽️', requirement: 'meals_30', unlocked: false, progress: 0, maxProgress: 30 },
  { id: 'a13', name: 'Strength Gains', description: 'Complete a workout 3 times', emoji: '📈', requirement: 'repeat_workout_3', unlocked: false, progress: 0, maxProgress: 3 },
  { id: 'a14', name: 'The Grind', description: '60 day streak', emoji: '⚡', requirement: 'streak_60', unlocked: false, progress: 0, maxProgress: 60 },
  { id: 'a15', name: 'Spartan Legend', description: 'Complete all other achievements', emoji: '🦁', requirement: 'all_achievements', unlocked: false },
]
