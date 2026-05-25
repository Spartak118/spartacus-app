'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  glow?: boolean
  goldBorder?: boolean
  delay?: number
}

export function Card({ children, className, onClick, glow = false, goldBorder = false, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={onClick}
      className={cn(
        'glass-card rounded-3xl p-4',
        glow && 'shadow-gold',
        goldBorder && 'border-gold-glow',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: ReactNode
  color?: string
  delay?: number
}

export function StatCard({ label, value, unit, icon, color = 'text-gold', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="glass-card rounded-2xl p-4"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[#888] text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon && <span className={cn('opacity-80', color)}>{icon}</span>}
      </div>
      <div className="flex items-end gap-1">
        <span className={cn('text-3xl font-black tracking-tight', color)}>{value}</span>
        {unit && <span className="text-[#888] text-sm mb-1">{unit}</span>}
      </div>
    </motion.div>
  )
}
