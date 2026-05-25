'use client'

import { motion } from 'framer-motion'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface MacroTrackerProps {
  calories: { current: number; goal: number }
  protein: { current: number; goal: number }
  carbs: { current: number; goal: number }
  fat: { current: number; goal: number }
  water: { current: number; goal: number }
}

export function MacroTracker({ calories, protein, carbs, fat, water }: MacroTrackerProps) {
  return (
    <div className="glass-card rounded-3xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest">Today's Nutrition</h3>
        <span className="text-xs text-[#888]">{calories.current} / {calories.goal} kcal</span>
      </div>

      <div className="flex justify-around">
        <div className="flex flex-col items-center gap-2">
          <ProgressRing
            value={calories.current}
            max={calories.goal}
            size={80}
            strokeWidth={6}
            color="#C8A96E"
            label={`${Math.round((calories.current / calories.goal) * 100)}%`}
            sublabel="cal"
          />
          <span className="text-xs text-[#888] font-medium">Calories</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ProgressRing
            value={protein.current}
            max={protein.goal}
            size={80}
            strokeWidth={6}
            color="#E8C98E"
            label={`${protein.current}g`}
            sublabel="protein"
          />
          <span className="text-xs text-[#888] font-medium">Protein</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ProgressRing
            value={water.current}
            max={water.goal}
            size={80}
            strokeWidth={6}
            color="#4A90D9"
            label={`${water.current}`}
            sublabel="glasses"
          />
          <span className="text-xs text-[#888] font-medium">Water</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <MacroBar label="Carbs" current={carbs.current} goal={carbs.goal} color="#A8D9A0" />
        <MacroBar label="Fat" current={fat.current} goal={fat.goal} color="#D9A0A0" />
      </div>
    </div>
  )
}

function MacroBar({ label, current, goal, color }: { label: string; current: number; goal: number; color: string }) {
  const pct = Math.min(100, Math.round((current / goal) * 100))
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#888] w-10">{label}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold w-12 text-right" style={{ color }}>
        {current}g
      </span>
    </div>
  )
}
