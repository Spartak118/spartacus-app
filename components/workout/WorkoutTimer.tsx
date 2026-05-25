'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface WorkoutTimerProps {
  elapsed: string
  label?: string
}

export function WorkoutTimer({ elapsed, label = 'Elapsed' }: WorkoutTimerProps) {
  return (
    <div className="flex items-center gap-2">
      <Clock size={14} className="text-gold opacity-80" />
      <span className="text-sm text-[#888]">{label}</span>
      <span className="text-sm font-black text-gold tabular-nums timer-display">{elapsed}</span>
    </div>
  )
}
