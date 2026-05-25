'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, TrendingDown, TrendingUp, Check } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { WeightChart } from '@/components/progress/WeightChart'
import { PhotoUpload } from '@/components/progress/PhotoUpload'
import { AchievementBadge, ACHIEVEMENTS } from '@/components/progress/AchievementBadge'
import { TransformationTimeline } from '@/components/progress/TransformationTimeline'
import { Button } from '@/components/ui/Button'
import { cn, getWeekDates, getTodayString } from '@/lib/utils'
import type { WeightEntry, Measurements } from '@/types'

type Tab = 'overview' | 'photos' | 'measurements' | 'achievements'

const SAMPLE_WEIGHTS: WeightEntry[] = []

const MEASUREMENT_FIELDS: { key: keyof Measurements; label: string; unit: string }[] = [
  { key: 'chest', label: 'Chest', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hips', label: 'Hips', unit: 'cm' },
  { key: 'arms', label: 'Arms', unit: 'cm' },
  { key: 'thighs', label: 'Thighs', unit: 'cm' },
  { key: 'shoulders', label: 'Shoulders', unit: 'cm' },
  { key: 'neck', label: 'Neck', unit: 'cm' },
]

export default function ProgressPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const { profile, plan, workoutsThisWeek, nutritionDaysHit } = useUserStore()
  const [measurements, setMeasurements] = useState<Measurements>({})
  const [showWeightInput, setShowWeightInput] = useState(false)
  const [weightInput, setWeightInput] = useState('')
  const [weights, setWeights] = useState<WeightEntry[]>(SAMPLE_WEIGHTS)

  const currentWeight = weights[weights.length - 1]?.weight || profile?.weight || 82
  const startWeight = profile?.weight || 82
  const targetWeight = profile?.target_weight || 75
  const weightChange = currentWeight - startWeight
  const daysInProgram = Math.max(1, Math.floor(
    (Date.now() - new Date(profile?.created_at || Date.now()).getTime()) / 86400000
  ))
  const currentWeek = Math.ceil(daysInProgram / 7)
  const totalWeeks = plan?.estimatedWeeksToGoal || 12

  function addWeight() {
    const w = parseFloat(weightInput)
    if (isNaN(w) || w < 30 || w > 300) return
    const entry: WeightEntry = {
      id: `w${Date.now()}`,
      user_id: 'local',
      date: getTodayString(),
      weight: w,
    }
    setWeights(prev => {
      const filtered = prev.filter(p => p.date !== getTodayString())
      return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date))
    })
    setWeightInput('')
    setShowWeightInput(false)
  }

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="px-4 pt-safe pb-0">
        <div className="flex items-center justify-between pt-4 pb-4">
          <h1 className="text-2xl font-black text-[#F5F5F5]">Progress</h1>
          <div className="flex items-center gap-1.5">
            {weightChange < 0
              ? <TrendingDown size={16} className="text-[#A8D9A0]" />
              : <TrendingUp size={16} className="text-[#D9A0A0]" />}
            <span className={cn('text-sm font-black', weightChange < 0 ? 'text-[#A8D9A0]' : 'text-[#D9A0A0]')}>
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}kg
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/3 rounded-2xl p-1 mb-4">
          {(['overview', 'photos', 'measurements', 'achievements'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-2 rounded-xl text-[10px] font-bold capitalize transition-all duration-200',
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
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Weight Stats */}
              <div className="grid grid-cols-3 gap-3">
                <WeightStat label="Current" value={`${currentWeight.toFixed(1)}kg`} color="#C8A96E" />
                <WeightStat label="Start" value={`${startWeight}kg`} color="#888" />
                <WeightStat label="Goal" value={`${targetWeight}kg`} color="#A8D9A0" />
              </div>

              {/* Weight chart */}
              <div className="glass-card rounded-3xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest">Weight Trend</h3>
                  <button
                    onClick={() => setShowWeightInput(!showWeightInput)}
                    className="flex items-center gap-1.5 text-gold text-xs font-bold active:scale-95 transition-transform"
                  >
                    <Plus size={14} />
                    Log Weight
                  </button>
                </div>

                <AnimatePresence>
                  {showWeightInput && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-4 flex gap-2 overflow-hidden"
                    >
                      <input
                        type="number"
                        placeholder="e.g. 80.5"
                        value={weightInput}
                        onChange={e => setWeightInput(e.target.value)}
                        className="input-dark flex-1 h-12 rounded-xl px-4 text-sm"
                        step="0.1"
                      />
                      <Button variant="gold" size="sm" onClick={addWeight}>Save</Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <WeightChart
                  data={weights}
                  targetWeight={targetWeight}
                  startWeight={startWeight}
                  unit="kg"
                />
              </div>

              {/* This week summary */}
              <div className="glass-card rounded-3xl p-5">
                <h3 className="text-sm font-bold text-cream uppercase tracking-widest mb-4">This Week</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-gold tabular-nums">{workoutsThisWeek}</p>
                    <p className="text-[10px] text-[#666]">Workouts logged</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-[#A8D9A0] tabular-nums">{nutritionDaysHit}</p>
                    <p className="text-[10px] text-[#666]">Nutrition days hit</p>
                  </div>
                </div>
              </div>

              {/* Streak Calendar */}
              <div className="glass-card rounded-3xl p-5">
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest mb-4">This Week</h3>
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDates().map(({ day, short }) => (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-[#555] font-semibold">{day}</span>
                      <div className="w-8 h-8 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
                        <Check size={12} className="text-gold" />
                      </div>
                      <span className="text-[10px] text-[#555]">{short}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transformation Timeline */}
              <div className="glass-card rounded-3xl p-5">
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest mb-4">Transformation Journey</h3>
                <TransformationTimeline
                  startDate={profile?.created_at || new Date().toISOString()}
                  totalWeeks={totalWeeks}
                  currentWeek={currentWeek}
                />
              </div>
            </motion.div>
          )}

          {tab === 'photos' && (
            <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card rounded-3xl p-5 mb-4">
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest mb-4">Progress Photos</h3>
                <PhotoUpload />
              </div>
            </motion.div>
          )}

          {tab === 'measurements' && (
            <motion.div key="measurements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass-card rounded-3xl p-5 mb-4">
                <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest mb-4">Body Measurements</h3>
                <div className="space-y-3">
                  {MEASUREMENT_FIELDS.map(({ key, label, unit }) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-[#888] w-24">{label}</span>
                      <input
                        type="number"
                        placeholder="—"
                        value={measurements[key] || ''}
                        onChange={e => setMeasurements(prev => ({
                          ...prev, [key]: parseFloat(e.target.value) || undefined
                        }))}
                        className="input-dark flex-1 h-12 rounded-xl px-4 text-sm tabular-nums"
                      />
                      <span className="text-[#555] text-xs w-6">{unit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="gold" fullWidth>Save Measurements</Button>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#888] uppercase tracking-widest font-semibold">
                    {ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length} Unlocked
                  </p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(ACHIEVEMENTS.filter(a => a.unlocked).length / ACHIEVEMENTS.length) * 100}%` }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-gold rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((achievement, i) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} delay={i * 0.04} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function WeightStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-card rounded-2xl p-3 text-center">
      <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-base font-black tabular-nums" style={{ color }}>{value}</p>
    </div>
  )
}
