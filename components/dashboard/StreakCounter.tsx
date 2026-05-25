'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface StreakCounterProps {
  streak: number
  longestStreak: number
}

export function StreakCounter({ streak, longestStreak }: StreakCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex items-center gap-3 glass-card rounded-2xl px-4 py-3"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [-3, 3, -3],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Flame size={28} className="text-gold fill-gold" />
        </motion.div>
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center"
          >
            <span className="text-[8px] font-black text-black">{streak > 99 ? '99+' : streak}</span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <motion.span
            key={streak}
            initial={{ scale: 1.3, color: '#E8C98E' }}
            animate={{ scale: 1, color: '#C8A96E' }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-black text-gold leading-none"
          >
            {streak}
          </motion.span>
          <span className="text-[#888] text-xs font-medium">day streak</span>
        </div>
        <span className="text-[#555] text-[10px]">Best: {longestStreak} days</span>
      </div>

      {streak >= 7 && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-auto"
        >
          <span className="text-xs bg-gold/10 text-gold border border-gold/20 rounded-full px-2 py-0.5 font-semibold">
            {streak >= 30 ? '🏛️ Legend' : streak >= 14 ? '⚡ Elite' : '🔥 Fire'}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
