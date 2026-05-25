'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Search, UtensilsCrossed } from 'lucide-react'
import { useNutrition } from '@/hooks/useNutrition'
import { CalorieRing } from '@/components/nutrition/CalorieRing'
import { MacroBar } from '@/components/nutrition/MacroBar'
import { MealCard } from '@/components/nutrition/MealCard'
import { WaterTracker } from '@/components/nutrition/WaterTracker'
import { MEALS, MEAL_CATEGORIES, getMealsByCategory, searchMeals } from '@/lib/nutrition'
import type { Meal, LoggedMeal } from '@/types'
import { cn } from '@/lib/utils'

type Tab = 'today' | 'meals' | 'hydration'

export default function NutritionPage() {
  const [tab, setTab] = useState<Tab>('today')
  const [mealCategory, setMealCategory] = useState('All')
  const [showLogModal, setShowLogModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { today, goals, logMeal, logWater } = useNutrition()

  const displayedMeals = searchQuery
    ? searchMeals(searchQuery)
    : getMealsByCategory(mealCategory)

  function handleAddMeal(meal: Meal) {
    const loggedMeal: LoggedMeal = {
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
    logMeal(loggedMeal)
    setShowLogModal(false)
  }

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="px-4 pt-safe pb-0">
        <div className="flex items-center justify-between pt-4 pb-4">
          <h1 className="text-2xl font-black text-[#F5F5F5]">Nutrition</h1>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-3 py-2 active:scale-95 transition-transform"
          >
            <Plus size={14} className="text-gold" />
            <span className="text-gold text-xs font-bold">Log Meal</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/3 rounded-2xl p-1 mb-4">
          {(['today', 'meals', 'hydration'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200',
                tab === t ? 'bg-gold text-black' : 'text-[#888]'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <AnimatePresence mode="wait">
          {tab === 'today' && (
            <motion.div key="today" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Calorie ring */}
              <div className="glass-card rounded-3xl p-6 flex flex-col items-center">
                <CalorieRing consumed={today.calories} goal={goals.calories} />
              </div>

              {/* Macro bars */}
              <div className="glass-card rounded-3xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest">Macros</h3>
                <MacroBar label="Protein" current={today.protein} goal={goals.protein} color="#A8D9A0" delay={0.1} />
                <MacroBar label="Carbs" current={today.carbs} goal={goals.carbs} color="#A0B8D9" delay={0.2} />
                <MacroBar label="Fat" current={today.fat} goal={goals.fat} color="#D9A0A0" delay={0.3} />
              </div>

              {/* Logged meals */}
              <div className="glass-card rounded-3xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest">Logged Meals</h3>
                  <span className="text-xs text-[#888]">{today.meals.length} meals</span>
                </div>

                {today.meals.length === 0 ? (
                  <div className="text-center py-6">
                    <UtensilsCrossed size={28} className="text-[#333] mx-auto mb-2" />
                    <p className="text-[#666] text-sm">No meals logged yet</p>
                    <p className="text-[#444] text-xs mt-1">Tap + Log Meal to add your first meal</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {today.meals.map((meal, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#F5F5F5]">{meal.name}</p>
                          <p className="text-xs text-[#666]">{meal.time} · P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</p>
                        </div>
                        <span className="text-gold font-black tabular-nums">{meal.calories}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Plan info */}
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs text-[#888] uppercase tracking-widest font-semibold mb-3">Today's Targets</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Calories', value: `${goals.calories} kcal`, color: '#C8A96E' },
                    { label: 'Protein', value: `${goals.protein}g`, color: '#A8D9A0' },
                    { label: 'Carbs', value: `${goals.carbs}g`, color: '#A0B8D9' },
                    { label: 'Fat', value: `${goals.fat}g`, color: '#D9A0A0' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] text-[#555] uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-black" style={{ color: item.color }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'meals' && (
            <motion.div key="meals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Search */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-dark w-full h-12 rounded-2xl pl-11 pr-4 text-sm"
                />
              </div>

              {/* Category filter */}
              {!searchQuery && (
                <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
                  {MEAL_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMealCategory(cat)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all',
                        mealCategory === cat ? 'bg-gold text-black' : 'bg-white/5 text-[#888]'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Category label */}
              {!searchQuery && mealCategory !== 'All' && (
                <div className="mb-3">
                  <p className="text-xs text-[#888] uppercase tracking-widest font-semibold">
                    {mealCategory === 'High Protein' ? '💪 High Protein Meals' :
                      mealCategory === 'Cutting' ? '🔥 Cutting Meals' :
                        mealCategory === 'Bulking' ? '📈 Bulking Meals' : '⚡ Quick Prep (under 15 min)'}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {displayedMeals.map((meal, i) => (
                  <MealCard key={meal.id} meal={meal} onAdd={handleAddMeal} delay={i * 0.04} />
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'hydration' && (
            <motion.div key="hydration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WaterTracker
                current={today.water}
                goal={goals.water}
                onAdd={logWater}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Log Meal Modal */}
      <AnimatePresence>
        {showLogModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#111] rounded-t-3xl border-t border-white/5"
            >
              <div className="px-4 pt-4 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-[#F5F5F5]">Log a Meal</h3>
                  <button onClick={() => setShowLogModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <X size={16} className="text-[#888]" />
                  </button>
                </div>

                <div className="relative mb-4">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
                  <input
                    type="text"
                    placeholder="Search our meal library..."
                    className="input-dark w-full h-12 rounded-2xl pl-11 pr-4 text-sm"
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {MEALS.slice(0, 8).map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() => handleAddMeal(meal)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/6 active:scale-98 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{meal.emoji}</span>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-[#F5F5F5]">{meal.name}</p>
                          <p className="text-xs text-[#666]">P:{meal.protein}g · {meal.calories}kcal</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <Plus size={14} className="text-gold" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
