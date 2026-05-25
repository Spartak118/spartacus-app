'use client'

import { motion } from 'framer-motion'

interface MacroBarProps {
  label: string
  current: number
  goal: number
  unit?: string
  color: string
  delay?: number
}

export function MacroBar({ label, current, goal, unit = 'g', color, delay = 0 }: MacroBarProps) {
  const pct = Math.min(100, Math.round((current / goal) * 100))
  const remaining = Math.max(0, goal - current)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-semibold text-[#F5F5F5]">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black tabular-nums" style={{ color }}>{current}{unit}</span>
          <span className="text-xs text-[#666]">/ {goal}{unit}</span>
        </div>
      </div>

      <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}50`,
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-[#555]">
        <span>{pct}% complete</span>
        <span>{remaining}{unit} remaining</span>
      </div>
    </div>
  )
}
