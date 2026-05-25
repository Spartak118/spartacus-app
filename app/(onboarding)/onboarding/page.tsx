'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OnboardingStep } from '@/components/onboarding/OnboardingStep'
import { GoalSelector } from '@/components/onboarding/GoalSelector'
import { useUserStore } from '@/store/userStore'
import { generatePlan } from '@/lib/transformationPlan'
import { saveProfile } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import type { Gender, GymAccess, Experience, ActivityLevel } from '@/types'

const TOTAL_STEPS = 12
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function OnboardingPage() {
  const router = useRouter()
  const { userId, onboardingData, setOnboardingData, setOnboardingComplete, setPlan, setProfile } = useUserStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [planProgress, setPlanProgress] = useState(0)

  function next() {
    if (step < TOTAL_STEPS) setStep(s => s + 1)
    else finishOnboarding()
  }

  function back() {
    if (step > 1) setStep(s => s - 1)
  }

  async function finishOnboarding() {
    setStep(TOTAL_STEPS)
    setLoading(true)

    // Simulate plan generation progress
    const interval = setInterval(() => {
      setPlanProgress(p => {
        if (p >= 98) { clearInterval(interval); return 98 }
        return p + Math.random() * 8
      })
    }, 150)

    try {
      const plan = generatePlan({
        gender: onboardingData.gender || 'male',
        age: onboardingData.age || 25,
        height: onboardingData.height || 175,
        weight: onboardingData.weight || 80,
        target_weight: onboardingData.target_weight || 75,
        goal: onboardingData.goal || 'aesthetic',
        gym_access: onboardingData.gym_access || 'gym',
        experience: onboardingData.experience || 'intermediate',
        activity_level: onboardingData.activity_level || 'moderate',
        workout_days: onboardingData.workout_days || ['Mon', 'Tue', 'Thu', 'Fri'],
        body_fat: onboardingData.body_fat,
      })

      setPlan(plan)
      setProfile({
        id: userId || 'local-user',
        email: '',
        name: onboardingData.name || 'Champion',
        gender: onboardingData.gender || 'male',
        age: onboardingData.age || 25,
        height: onboardingData.height || 175,
        weight: onboardingData.weight || 80,
        target_weight: onboardingData.target_weight || 75,
        goal: onboardingData.goal || 'aesthetic',
        gym_access: onboardingData.gym_access || 'gym',
        experience: onboardingData.experience || 'intermediate',
        activity_level: onboardingData.activity_level || 'moderate',
        workout_days: onboardingData.workout_days || [],
        units: 'metric',
        plan,
        created_at: new Date().toISOString(),
      })

      if (userId) {
        await saveProfile(userId, { ...onboardingData, plan })
      }

      clearInterval(interval)
      setPlanProgress(100)
      setOnboardingComplete(true)

      await new Promise(r => setTimeout(r, 800))
      router.push('/dashboard')
    } catch {
      clearInterval(interval)
      setPlanProgress(100)
      setOnboardingComplete(true)
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return !!onboardingData.gender
      case 2: return !!onboardingData.age && onboardingData.age > 10 && onboardingData.age < 100
      case 3: return !!onboardingData.height
      case 4: return !!onboardingData.weight
      case 5: return true
      case 6: return !!onboardingData.gym_access
      case 7: return !!onboardingData.experience
      case 8: return !!onboardingData.goal
      case 9: return !!onboardingData.activity_level
      case 10: return !!(onboardingData.workout_days?.length)
      case 11: return !!onboardingData.target_weight
      default: return true
    }
  }

  if (step === TOTAL_STEPS) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-bg px-6">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,169,110,0.1) 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-full border-2 border-gold/20 border-t-gold mx-auto mb-6"
          />
          <h2 className="text-2xl font-black text-[#F5F5F5] mb-2">Building Your Plan</h2>
          <p className="text-[#888] text-sm mb-8">Analyzing your data & creating your personalized transformation...</p>

          <div className="w-full bg-white/5 rounded-full h-2 mb-3 overflow-hidden">
            <motion.div
              animate={{ width: `${planProgress}%` }}
              className="h-full bg-gold rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-gold text-sm font-bold">{Math.round(planProgress)}%</span>

          <div className="mt-8 space-y-2 text-left">
            {[
              'Calculating your TDEE...',
              'Designing workout split...',
              'Optimizing macro targets...',
              'Setting milestone timeline...',
              'Your plan is ready!',
            ].map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: planProgress > i * 20 ? 1 : 0.2, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn('flex items-center gap-2 text-xs', planProgress > i * 20 ? 'text-[#888]' : 'text-[#333]')}
              >
                <span>{planProgress > (i + 1) * 20 ? '✓' : '◌'}</span>
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-bg px-6 pt-safe">
      <div className="flex items-center justify-between py-4">
        <button
          onClick={back}
          disabled={step === 1}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform"
        >
          <ChevronLeft size={18} className="text-[#888]" />
        </button>
        <span className="text-xs text-[#555] font-semibold">{step} / {TOTAL_STEPS - 1}</span>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-xs text-[#555] font-semibold px-2 py-1"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
          <StepContent
            key={step}
            step={step}
            onboardingData={onboardingData}
            setOnboardingData={setOnboardingData}
          />
        </AnimatePresence>
      </div>

      <div className="py-4">
        <Button
          variant="gold"
          fullWidth
          size="lg"
          onClick={next}
          disabled={!canProceed()}
        >
          {step === TOTAL_STEPS - 1 ? 'Generate My Plan ⚡' : 'Continue'}
          {step < TOTAL_STEPS - 1 && <ChevronRight size={18} className="ml-1" />}
        </Button>
      </div>
    </div>
  )
}

function StepContent({ step, onboardingData, setOnboardingData }: {
  step: number
  onboardingData: import('@/types').OnboardingData
  setOnboardingData: (data: Partial<import('@/types').OnboardingData>) => void
}) {
  switch (step) {
    case 1:
      return (
        <OnboardingStep step={1} totalSteps={11} title="What's your gender?" subtitle="This helps us optimize your plan.">
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: 'male', emoji: '💪', label: 'Male' },
              { id: 'female', emoji: '✨', label: 'Female' },
              { id: 'other', emoji: '⚡', label: 'Other' },
            ] as { id: Gender; emoji: string; label: string }[]).map(g => (
              <SelectCard
                key={g.id}
                selected={(onboardingData.gender as string) === g.id}
                onClick={() => setOnboardingData({ gender: g.id })}
              >
                <span className="text-3xl mb-2">{g.emoji}</span>
                <span className="text-sm font-bold text-[#F5F5F5]">{g.label}</span>
              </SelectCard>
            ))}
          </div>
        </OnboardingStep>
      )

    case 2:
      return (
        <OnboardingStep step={2} totalSteps={11} title="How old are you?" subtitle="Age affects your metabolic rate.">
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="text-7xl font-black text-gold tabular-nums">
              {(onboardingData.age as number) || 25}
            </div>
            <input
              type="range"
              min={14}
              max={80}
              value={(onboardingData.age as number) || 25}
              onChange={e => setOnboardingData({ age: Number(e.target.value) })}
              className="w-full accent-gold"
              style={{ accentColor: '#C8A96E' }}
            />
            <div className="flex justify-between w-full text-[#555] text-xs">
              <span>14</span>
              <span>80</span>
            </div>
          </div>
        </OnboardingStep>
      )

    case 3:
      return (
        <OnboardingStep step={3} totalSteps={11} title="What's your height?" subtitle="We'll calculate your proportions.">
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="text-7xl font-black text-gold tabular-nums">
              {(onboardingData.height as number) || 175}
              <span className="text-2xl text-[#888] ml-1">cm</span>
            </div>
            <input
              type="range"
              min={140}
              max={220}
              value={(onboardingData.height as number) || 175}
              onChange={e => setOnboardingData({ height: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#C8A96E' }}
            />
            <div className="flex justify-between w-full text-[#555] text-xs">
              <span>140cm (4'7")</span>
              <span>220cm (7'3")</span>
            </div>
          </div>
        </OnboardingStep>
      )

    case 4:
      return (
        <OnboardingStep step={4} totalSteps={11} title="Current weight?" subtitle="Be honest — we're building your baseline.">
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="text-7xl font-black text-gold tabular-nums">
              {(onboardingData.weight as number) || 80}
              <span className="text-2xl text-[#888] ml-1">kg</span>
            </div>
            <input
              type="range"
              min={40}
              max={200}
              value={(onboardingData.weight as number) || 80}
              onChange={e => setOnboardingData({ weight: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#C8A96E' }}
            />
          </div>
        </OnboardingStep>
      )

    case 5:
      return (
        <OnboardingStep step={5} totalSteps={11} title="Body fat estimate?" subtitle="Pick the closest match.">
          <div className="grid grid-cols-2 gap-3">
            {[
              { pct: '~10%', label: 'Very Lean', desc: 'Visible abs, veins' },
              { pct: '~15%', label: 'Athletic', desc: 'Some definition' },
              { pct: '~20%', label: 'Average', desc: 'Soft midsection' },
              { pct: '~25%', label: 'Above Average', desc: 'Noticeable fat' },
              { pct: '~30%', label: 'High', desc: 'Round appearance' },
              { pct: '30%+', label: 'Very High', desc: 'Significant fat' },
            ].map((opt, i) => {
              const bfValues = [10, 15, 20, 25, 30, 35]
              return (
                <SelectCard
                  key={opt.pct}
                  selected={(onboardingData.body_fat as number) === bfValues[i]}
                  onClick={() => setOnboardingData({ body_fat: bfValues[i] })}
                >
                  <div
                    className="w-12 h-12 rounded-full mb-2 flex items-center justify-center"
                    style={{
                      background: `rgba(200,169,110,${0.3 - i * 0.04})`,
                      border: '1px solid rgba(200,169,110,0.2)',
                    }}
                  >
                    <span className="text-gold font-black text-xs">{opt.pct}</span>
                  </div>
                  <span className="text-sm font-bold text-[#F5F5F5]">{opt.label}</span>
                  <span className="text-xs text-[#666]">{opt.desc}</span>
                </SelectCard>
              )
            })}
          </div>
        </OnboardingStep>
      )

    case 6:
      return (
        <OnboardingStep step={6} totalSteps={11} title="Gym access?" subtitle="We'll design workouts around your equipment.">
          <div className="flex flex-col gap-3">
            {([
              { id: 'home', emoji: '🏠', label: 'Home Only', desc: 'Bodyweight & minimal equipment' },
              { id: 'gym', emoji: '🏋️', label: 'Full Gym Access', desc: 'Barbells, machines, cables' },
              { id: 'both', emoji: '⚡', label: 'Both', desc: 'Home & gym flexibility' },
            ] as { id: GymAccess; emoji: string; label: string; desc: string }[]).map(opt => (
              <SelectCard
                key={opt.id}
                selected={(onboardingData.gym_access as string) === opt.id}
                onClick={() => setOnboardingData({ gym_access: opt.id })}
                horizontal
              >
                <span className="text-3xl mr-4 flex-shrink-0">{opt.emoji}</span>
                <div>
                  <p className="font-bold text-[#F5F5F5] text-sm">{opt.label}</p>
                  <p className="text-[#666] text-xs">{opt.desc}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </OnboardingStep>
      )

    case 7:
      return (
        <OnboardingStep step={7} totalSteps={11} title="Experience level?" subtitle="Be honest for the best plan.">
          <div className="flex flex-col gap-3">
            {([
              { id: 'beginner', emoji: '🌱', label: 'Complete Beginner', desc: 'Never trained consistently' },
              { id: 'some', emoji: '💪', label: 'Some Experience', desc: '6 months to 1 year' },
              { id: 'intermediate', emoji: '⚡', label: 'Intermediate', desc: '1-3 years of training' },
              { id: 'advanced', emoji: '🏛️', label: 'Advanced', desc: '3+ years of serious training' },
            ] as { id: Experience; emoji: string; label: string; desc: string }[]).map(opt => (
              <SelectCard
                key={opt.id}
                selected={(onboardingData.experience as string) === opt.id}
                onClick={() => setOnboardingData({ experience: opt.id })}
                horizontal
              >
                <span className="text-2xl mr-4 flex-shrink-0">{opt.emoji}</span>
                <div>
                  <p className="font-bold text-[#F5F5F5] text-sm">{opt.label}</p>
                  <p className="text-[#666] text-xs">{opt.desc}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </OnboardingStep>
      )

    case 8:
      return (
        <OnboardingStep step={8} totalSteps={11} title="What's your main goal?" subtitle="Choose the physique you're building.">
          <GoalSelector
            selected={onboardingData.goal as import('@/types').Goal}
            onSelect={goal => setOnboardingData({ goal })}
          />
        </OnboardingStep>
      )

    case 9:
      return (
        <OnboardingStep step={9} totalSteps={11} title="Activity level?" subtitle="Outside of workouts.">
          <div className="flex flex-col gap-3">
            {([
              { id: 'sedentary', emoji: '💻', label: 'Sedentary', desc: 'Desk job, little movement' },
              { id: 'light', emoji: '🚶', label: 'Lightly Active', desc: 'Light activity 1-2x/week' },
              { id: 'moderate', emoji: '🚴', label: 'Moderately Active', desc: 'Moderate activity 3-5x/week' },
              { id: 'very_active', emoji: '🏃', label: 'Very Active', desc: 'Physical job or daily training' },
            ] as { id: ActivityLevel; emoji: string; label: string; desc: string }[]).map(opt => (
              <SelectCard
                key={opt.id}
                selected={(onboardingData.activity_level as string) === opt.id}
                onClick={() => setOnboardingData({ activity_level: opt.id })}
                horizontal
              >
                <span className="text-2xl mr-4 flex-shrink-0">{opt.emoji}</span>
                <div>
                  <p className="font-bold text-[#F5F5F5] text-sm">{opt.label}</p>
                  <p className="text-[#666] text-xs">{opt.desc}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </OnboardingStep>
      )

    case 10:
      return (
        <OnboardingStep step={10} totalSteps={11} title="Available workout days?" subtitle="Tap to select your training days.">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
              const days = (onboardingData.workout_days as string[]) || []
              const isSelected = days.includes(day)
              return (
                <button
                  key={day}
                  onClick={() => {
                    const newDays = isSelected
                      ? days.filter(d => d !== day)
                      : [...days, day]
                    setOnboardingData({ workout_days: newDays })
                  }}
                  className={cn(
                    'py-4 rounded-2xl text-sm font-bold transition-all duration-200',
                    isSelected
                      ? 'bg-gold/15 border border-gold/40 text-gold'
                      : 'bg-white/3 border border-white/6 text-[#888]'
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
          <p className="text-[#666] text-sm text-center">
            {((onboardingData.workout_days as string[]) || []).length} days selected
          </p>
        </OnboardingStep>
      )

    case 11:
      return (
        <OnboardingStep step={11} totalSteps={11} title="Target weight?" subtitle="Where do you want to be?">
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="text-7xl font-black text-gold tabular-nums">
              {(onboardingData.target_weight as number) || (onboardingData.weight as number) || 75}
              <span className="text-2xl text-[#888] ml-1">kg</span>
            </div>
            <input
              type="range"
              min={40}
              max={200}
              value={(onboardingData.target_weight as number) || (onboardingData.weight as number) || 75}
              onChange={e => setOnboardingData({ target_weight: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#C8A96E' }}
            />
            {onboardingData.weight && onboardingData.target_weight && (
              <div className="glass-card rounded-2xl p-4 w-full text-center">
                <p className="text-[#888] text-sm">
                  Goal:{' '}
                  <span className="text-gold font-bold">
                    {Math.abs((onboardingData.target_weight as number) - (onboardingData.weight as number)).toFixed(1)}kg{' '}
                    {(onboardingData.target_weight as number) < (onboardingData.weight as number) ? 'to lose' : 'to gain'}
                  </span>
                </p>
              </div>
            )}
          </div>
        </OnboardingStep>
      )

    default:
      return null
  }
}

function SelectCard({
  children, selected, onClick, horizontal = false
}: {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
  horizontal?: boolean
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'select-card rounded-2xl p-4 w-full transition-all duration-200',
        horizontal ? 'flex items-center text-left' : 'flex flex-col items-center text-center',
        selected && 'selected',
      )}
    >
      {children}
    </motion.button>
  )
}
