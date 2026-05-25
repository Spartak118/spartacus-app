'use client'

import { motion } from 'framer-motion'
import { Trophy, Sparkles } from 'lucide-react'

interface ScoreCardProps {
  disciplineScore: number
  aestheticScore: number
  daysInProgram: number
}

export function ScoreCard({ disciplineScore, aestheticScore, daysInProgram }: ScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.5 }}
      className="glass-card rounded-3xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={16} className="text-gold" />
        <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest">Performance</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ScoreBar
          label="Discipline"
          score={disciplineScore}
          color="#C8A96E"
          icon={<Trophy size={14} />}
        />
        <ScoreBar
          label="Aesthetic"
          score={aestheticScore}
          color="#E8C98E"
          icon={<Sparkles size={14} />}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[#888] text-xs">Day {daysInProgram} of your transformation</span>
        <span className="text-gold text-xs font-bold">
          {daysInProgram < 7 ? 'Just Started' : daysInProgram < 30 ? 'Building' : daysInProgram < 90 ? 'Warrior' : 'Legend'}
        </span>
      </div>
    </motion.div>
  )
}

function ScoreBar({ label, score, color, icon }: { label: string; score: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5" style={{ color }}>
          {icon}
          <span className="text-xs font-semibold text-[#888]">{label}</span>
        </div>
        <span className="text-base font-black" style={{ color }}>{score}</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[10px] text-[#555]">0</span>
        <span className="text-[10px] text-[#555]">100</span>
      </div>
    </div>
  )
}
