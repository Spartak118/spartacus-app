'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface OnboardingStepProps {
  step: number
  totalSteps: number
  title: string
  subtitle?: string
  children: ReactNode
}

export function OnboardingStep({ step, totalSteps, title, subtitle, children }: OnboardingStepProps) {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-full"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full overflow-hidden bg-white/10"
            >
              {i < step && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gold rounded-full"
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-2">
          Step {step} of {totalSteps}
        </p>
        <h2 className="text-2xl font-black text-[#F5F5F5] leading-tight">{title}</h2>
        {subtitle && <p className="text-[#888] text-sm mt-1">{subtitle}</p>}
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </motion.div>
  )
}
