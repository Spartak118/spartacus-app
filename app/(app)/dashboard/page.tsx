'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Droplets, Weight, UtensilsCrossed, Bell, Flame, Dumbbell, Footprints } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useNutrition } from '@/hooks/useNutrition'
import { useStreak } from '@/hooks/useStreak'
import { StreakCounter } from '@/components/dashboard/StreakCounter'
import { MacroTracker } from '@/components/dashboard/MacroTracker'
import { TodayWorkout } from '@/components/dashboard/TodayWorkout'
import { MotivationalQuote } from '@/components/dashboard/MotivationalQuote'
import { ScoreCard } from '@/components/dashboard/ScoreCard'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { WORKOUTS, SPLIT_SCHEDULES } from '@/lib/workouts'
import { getGreeting, getDayOfWeek } from '@/lib/utils'
import { calculateDisciplineScore, calculateAestheticScore } from '@/lib/transformationPlan'

export default function DashboardPage() {
  const { profile, plan, workoutsThisWeek, nutritionDaysHit, addWater, addMeal } = useUserStore()
  const { today, goals } = useNutrition()
  const { currentStreak, longestStreak, markDayActive } = useStreak()
  const [showQuickLog, setShowQuickLog] = useState(false)
  const [activeModal, setActiveModal] = useState<null | 'meal' | 'water' | 'weight'>(null)

  const dayOfWeek = getDayOfWeek()

  const split = plan?.workoutSplit || 'Full Body'
  const schedule = SPLIT_SCHEDULES[split] || {}
  const todayWorkoutId = schedule[dayOfWeek]
  const todayWorkout = todayWorkoutId && todayWorkoutId !== 'Rest'
    ? WORKOUTS.find(w => w.id === todayWorkoutId) || WORKOUTS[0]
    : null
  const isRestDay = !todayWorkoutId || todayWorkoutId === 'Rest'

  const daysInProgram = Math.max(1, Math.floor(
    (Date.now() - new Date(profile?.created_at || Date.now()).getTime()) / 86400000
  ))

  const disciplineScore = calculateDisciplineScore({
    workoutsThisWeek,
    targetWorkouts: plan?.workoutDays?.length || 4,
    nutritionDaysHit,
    currentStreak,
    sleepGoalHit: false,
  })

  const aestheticScore = calculateAestheticScore({
    weeklyProgress: 0,
    goalType: profile?.goal || 'aesthetic',
    daysInProgram,
  })

  const transformProgress = Math.min(99, Math.round((daysInProgram / ((plan?.estimatedWeeksToGoal || 12) * 7)) * 100))

  function handleAddWater() {
    addWater(1)
    markDayActive()
    setActiveModal(null)
  }

  function handleAddMeal() {
    addMeal({
      name: 'Custom Meal',
      calories: 400,
      protein: 30,
      carbs: 40,
      fat: 12,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    })
    markDayActive()
    setActiveModal(null)
  }

  return (
    <div className="h-full overflow-y-auto bg-bg">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-32 pointer-events-none z-0"
        style={{ background: 'linear-gradient(to bottom, rgba(200,169,110,0.06) 0%, transparent 100%)' }}
      />

      <div className="relative z-10 px-4 pt-safe">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between pt-4 pb-2"
        >
          <div>
            <p className="text-[#888] text-sm font-medium">{getGreeting()},</p>
            <h1 className="text-2xl font-black text-cream leading-tight">
              {profile?.name || 'Champion'}
            </h1>
            <p className="text-[#555] text-xs mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="flex items-center gap-3">
            <ProgressRing
              value={transformProgress}
              max={100}
              size={52}
              strokeWidth={4}
              color="#C8A96E"
              label={`${transformProgress}%`}
            />
            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center active:scale-90 transition-transform">
              <Bell size={18} className="text-[#888]" />
            </button>
          </div>
        </motion.div>

        <div className="space-y-4 pb-4">
          {/* Streak */}
          <StreakCounter streak={currentStreak} longestStreak={longestStreak} />

          {/* Macro Grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 gap-3"
          >
            <MacroStatCard
              label="Calories"
              value={today.calories}
              goal={goals.calories}
              unit="kcal"
              color="#C8A96E"
              icon={<Flame size={14} className="text-[#C8A96E]" />}
            />
            <MacroStatCard
              label="Protein"
              value={today.protein}
              goal={goals.protein}
              unit="g"
              color="#A8D9A0"
              icon={<Dumbbell size={14} className="text-[#A8D9A0]" />}
            />
            <MacroStatCard
              label="Water"
              value={today.water}
              goal={goals.water}
              unit="glasses"
              color="#4A90D9"
              icon={<Droplets size={14} className="text-[#4A90D9]" />}
            />
            <MacroStatCard
              label="Workouts"
              value={workoutsThisWeek}
              goal={plan?.workoutDays?.length || 4}
              unit="this week"
              color="#D9A0C8"
              icon={<Footprints size={14} className="text-[#D9A0C8]" />}
            />
          </motion.div>

          {/* Macro tracker rings */}
          <MacroTracker
            calories={{ current: today.calories, goal: goals.calories }}
            protein={{ current: today.protein, goal: goals.protein }}
            carbs={{ current: today.carbs, goal: goals.carbs }}
            fat={{ current: today.fat, goal: goals.fat }}
            water={{ current: today.water, goal: goals.water }}
          />

          {/* Today's Workout */}
          <TodayWorkout workout={todayWorkout} isRestDay={isRestDay} />

          {/* Score Card */}
          <ScoreCard
            disciplineScore={disciplineScore}
            aestheticScore={aestheticScore}
            daysInProgram={daysInProgram}
          />

          {/* Quote */}
          <MotivationalQuote />

          {/* Daily Habits */}
          {plan?.dailyHabits && plan.dailyHabits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-3xl p-5"
            >
              <h3 className="text-sm font-bold text-cream uppercase tracking-widest mb-4">Daily Habits</h3>
              <div className="space-y-3">
                {plan.dailyHabits.slice(0, 5).map((habit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] text-gold font-bold">{i + 1}</span>
                    </div>
                    <p className="text-[#888] text-sm leading-relaxed">{habit}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Log FAB */}
      <motion.div
        className="fixed bottom-24 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        <button
          onClick={() => setShowQuickLog(!showQuickLog)}
          className="w-14 h-14 rounded-2xl btn-gold flex items-center justify-center shadow-gold-lg"
        >
          <Plus
            size={24}
            className="text-black"
            style={{ transform: showQuickLog ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }}
          />
        </button>
      </motion.div>

      {/* Quick log menu */}
      <AnimatePresence>
        {showQuickLog && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 right-4 z-50 flex flex-col gap-2 items-end"
          >
            {[
              { label: 'Log Meal', icon: <UtensilsCrossed size={16} />, action: handleAddMeal },
              { label: 'Add Water', icon: <Droplets size={16} />, action: handleAddWater },
              { label: 'Log Weight', icon: <Weight size={16} />, action: () => setActiveModal('weight') },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { item.action(); setShowQuickLog(false) }}
                className="flex items-center gap-3 glass-card border-gold-glow rounded-2xl px-4 py-3 active:scale-95 transition-transform"
              >
                <span className="text-gold">{item.icon}</span>
                <span className="text-sm font-semibold text-cream">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* suppress unused warning */}
      <span className="hidden">{activeModal}</span>
    </div>
  )
}

function MacroStatCard({
  label, value, goal, unit, color, icon
}: {
  label: string, value: number, goal: number, unit: string, color: string, icon: React.ReactNode
}) {
  const pct = Math.min(100, goal > 0 ? Math.round((value / goal) * 100) : 0)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-3.5"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#888] font-semibold">{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-xl font-black tabular-nums" style={{ color }}>{value.toLocaleString()}</span>
        <span className="text-[10px] text-[#555]">{unit}</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <p className="text-[10px] text-[#555] mt-1">{pct}% of {goal.toLocaleString()}</p>
    </motion.div>
  )
}
