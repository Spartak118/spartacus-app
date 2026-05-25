'use client'

import { motion } from 'framer-motion'
import { Plus, Clock } from 'lucide-react'
import type { Meal } from '@/types'

interface MealCardProps {
  meal: Meal
  onAdd: (meal: Meal) => void
  delay?: number
}

function categoryColor(cat?: string): string {
  const map: Record<string, string> = {
    'High Protein': 'rgba(168,217,160,0.12)',
    Cutting: 'rgba(217,160,160,0.12)',
    Bulking: 'rgba(200,169,110,0.12)',
    Quick: 'rgba(160,184,217,0.12)',
  }
  return map[cat || ''] || 'rgba(255,255,255,0.05)'
}

function categoryTextColor(cat?: string): string {
  const map: Record<string, string> = {
    'High Protein': '#A8D9A0',
    Cutting: '#D9A0A0',
    Bulking: '#C8A96E',
    Quick: '#A0B8D9',
  }
  return map[cat || ''] || '#888'
}

export function MealCard({ meal, onAdd, delay = 0 }: MealCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="glass-card rounded-2xl p-4 flex items-center gap-4"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: categoryColor(meal.category),
          border: `1px solid ${categoryColor(meal.category).replace('0.12', '0.25')}`,
        }}
      >
        <span className="text-sm font-black" style={{ color: categoryTextColor(meal.category) }}>
          {meal.name.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-bold text-[#F5F5F5] text-sm leading-tight">{meal.name}</h4>
          <span className="text-gold font-black text-sm tabular-nums flex-shrink-0">{meal.calories}</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#666] mb-2">
          <span>P: <span className="text-[#A8D9A0] font-semibold">{meal.protein}g</span></span>
          <span>C: <span className="text-[#A0B8D9] font-semibold">{meal.carbs}g</span></span>
          <span>F: <span className="text-[#D9A0A0] font-semibold">{meal.fat}g</span></span>
          {meal.prepTime && (
            <div className="flex items-center gap-0.5 ml-auto">
              <Clock size={9} />
              <span>{meal.prepTime}m</span>
            </div>
          )}
        </div>

        {meal.description && (
          <p className="text-[#666] text-[11px] leading-relaxed line-clamp-1">{meal.description}</p>
        )}
      </div>

      <button
        onClick={() => onAdd(meal)}
        className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
      >
        <Plus size={16} className="text-gold" />
      </button>
    </motion.div>
  )
}
