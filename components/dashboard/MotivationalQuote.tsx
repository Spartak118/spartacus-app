'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { getDailyQuote } from '@/lib/utils'

export function MotivationalQuote() {
  const quote = getDailyQuote()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.4 }}
      className="glass-card rounded-3xl p-5 relative overflow-hidden"
    >
      <div className="absolute top-3 right-4 opacity-10">
        <Quote size={48} className="text-gold" />
      </div>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gold/20">
          <Quote size={14} className="text-gold" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-2">Daily Wisdom</p>
          <p className="text-[#E5E5E5] text-sm font-medium leading-relaxed quote-text">
            "{quote}"
          </p>
        </div>
      </div>
    </motion.div>
  )
}
