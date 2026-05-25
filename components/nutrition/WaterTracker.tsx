'use client'

import { motion } from 'framer-motion'
import { Droplets, Plus, Minus } from 'lucide-react'

interface WaterTrackerProps {
  current: number
  goal: number
  onAdd: (amount: number) => void
}

export function WaterTracker({ current, goal, onAdd }: WaterTrackerProps) {
  const pct = Math.min(100, (current / goal) * 100)
  const liters = (current * 0.25).toFixed(1)

  return (
    <div className="glass-card rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-[#4A90D9]" />
          <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest">Hydration</h3>
        </div>
        <span className="text-xs text-[#888]">{liters}L / {(goal * 0.25).toFixed(1)}L</span>
      </div>

      <div className="flex flex-col items-center gap-4 mb-5">
        <div className="relative w-24 h-36 rounded-2xl overflow-hidden border border-[#4A90D9]/20">
          <div className="absolute inset-0 bg-white/3" />
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
            initial={{ height: '0%' }}
            animate={{ height: `${pct}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ backgroundColor: '#4A90D980' }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[#F5F5F5]">{current}</span>
            <span className="text-xs text-[#888]">glasses</span>
          </div>
        </div>

        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-[#4A90D9]"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(amount => (
          <button
            key={amount}
            onClick={() => onAdd(amount)}
            className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-[#4A90D9]/10 border border-[#4A90D9]/20 active:scale-95 transition-transform"
          >
            <Droplets size={16} className="text-[#4A90D9]" />
            <span className="text-xs font-bold text-[#4A90D9]">+{amount}</span>
            <span className="text-[10px] text-[#666]">{amount === 1 ? '250ml' : amount === 2 ? '500ml' : '750ml'}</span>
          </button>
        ))}
      </div>

      {current > 0 && (
        <button
          onClick={() => onAdd(-1)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[#888] text-xs border border-white/5 active:scale-95 transition-transform"
        >
          <Minus size={12} />
          Remove one glass
        </button>
      )}
    </div>
  )
}
