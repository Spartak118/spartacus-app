'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'gold' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  children, onClick, variant = 'gold', size = 'md',
  fullWidth = false, disabled = false, loading = false,
  className, type = 'button',
}: ButtonProps) {
  const base = 'relative inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 select-none overflow-hidden'

  const variants = {
    gold: 'btn-gold text-[#0A0A0A]',
    outline: 'btn-outline',
    ghost: 'bg-white/5 text-[#F5F5F5] border border-white/10 hover:bg-white/10 active:scale-95',
    danger: 'bg-[#B22234]/20 text-[#ff4444] border border-[#B22234]/40 hover:bg-[#B22234]/30 active:scale-95',
  }

  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-14 px-6 text-base',
    lg: 'h-16 px-8 text-lg',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </span>
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </motion.button>
  )
}
