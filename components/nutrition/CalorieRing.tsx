'use client'

import { motion } from 'framer-motion'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface CalorieRingProps {
  consumed: number
  goal: number
  burned?: number
}

export function CalorieRing({ consumed, goal, burned = 0 }: CalorieRingProps) {
  const remaining = Math.max(0, goal - consumed + burned)
  const percent = Math.min(100, Math.round(((consumed - burned) / goal) * 100))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-4"
    >
      <ProgressRing
        value={consumed}
        max={goal}
        size={180}
        strokeWidth={12}
        color="#C8A96E"
        bgColor="rgba(255,255,255,0.05)"
        label={remaining.toString()}
        sublabel="kcal left"
      />

      <div className="grid grid-cols-3 gap-4 w-full">
        <CalorieStat label="Goal" value={goal} color="#888" />
        <CalorieStat label="Eaten" value={consumed} color="#C8A96E" />
        <CalorieStat label="Remaining" value={remaining} color={remaining < 0 ? '#D9A0A0' : '#A8D9A0'} />
      </div>
    </motion.div>
  )
}

function CalorieStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-[#666] uppercase tracking-wider mb-1">{label}</span>
      <span className="text-lg font-black tabular-nums" style={{ color }}>{value}</span>
      <span className="text-[10px] text-[#555]">kcal</span>
    </div>
  )
}
