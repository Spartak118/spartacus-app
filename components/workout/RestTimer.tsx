'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface RestTimerProps {
  seconds: number
  totalSeconds: number
  onSkip: () => void
}

export function RestTimer({ seconds, totalSeconds, onSkip }: RestTimerProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 px-4 pb-8"
      >
        <div className="glass-card border-gold-glow rounded-3xl p-5 max-w-[430px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#888] text-xs uppercase tracking-widest font-semibold">Rest Period</p>
              <p className="text-[#F5F5F5] text-sm font-bold">Next set starts soon...</p>
            </div>
            <ProgressRing
              value={seconds}
              max={totalSeconds}
              size={64}
              strokeWidth={5}
              color="#C8A96E"
              label={seconds.toString()}
              animate={false}
            />
          </div>

          <Button variant="outline" fullWidth size="sm" onClick={onSkip}>
            Skip Rest
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
