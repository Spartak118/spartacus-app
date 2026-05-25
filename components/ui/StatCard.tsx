'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number | string
  unit?: string
  subtext?: string
  icon: ReactNode
  color?: string
  progress?: number
  delay?: number
}

export function StatCard({
  label, value, unit, subtext, icon, color = '#C8A96E', progress, delay = 0
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="glass-card rounded-2xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-[#888] text-xs font-semibold uppercase tracking-widest">{label}</span>
        <span style={{ color }} className="opacity-80">{icon}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <span style={{ color }} className="text-2xl font-black tabular-nums">{value}</span>
        {unit && <span className="text-[#888] text-xs">{unit}</span>}
      </div>

      {progress !== undefined && (
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      )}

      {subtext && <span className="text-[#666] text-xs">{subtext}</span>}
    </motion.div>
  )
}
