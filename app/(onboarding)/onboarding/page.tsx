'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, User, Users, Zap,
  Home, Dumbbell, Blend, GraduationCap, Trophy,
  Sofa, PersonStanding, Bike, Flame, Check, CircleDashed,
  Target, Minus, Plus as PlusIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OnboardingStep } from '@/components/onboarding/OnboardingStep'
import { GoalSelector } from '@/components/onboarding/GoalSelector'
import { useUserStore } from '@/store/userStore'
import { generatePlan } from '@/lib/transformationPlan'
import { saveProfile } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import type { Gender, GymAccess, Experience, ActivityLevel } from '@/types'

const TOTAL_STEPS = 11

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
    setLoading(true)

    const interval = setInterval(() => {
      setPlanProgress(p => {
        if (p >= 98) { clearInterval(interval); return 98 }
        return p + Math.random() * 7
      })
    }, 120)

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

      if (userId && !userId.startsWith('guest-')) {
        await saveProfile(userId, { ...onboardingData, plan })
      }

      clearInterval(interval)
      setPlanProgress(100)
      setOnboardingComplete(true)
      await new Promise(r => setTimeout(r, 700))
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
      case 1: return !!(onboardingData.name && (onboardingData.name as string).trim().length >= 2)
      case 2: return !!onboardingData.gender
      case 3: return !!onboardingData.age && (onboardingData.age as number) > 10
      case 4: return !!onboardingData.height
      case 5: return !!onboardingData.weight
      case 6: return true
      case 7: return !!onboardingData.goal
      case 8: return !!onboardingData.gym_access
      case 9: return !!onboardingData.experience
      case 10: return !!onboardingData.activity_level
      case 11: return !!(onboardingData.workout_days?.length)
      default: return true
    }
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-bg px-6">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,169,110,0.08) 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-2 border-gold/20 border-t-gold mx-auto mb-8"
          />
          <h2 className="text-xl font-black text-cream mb-2">Building Your Plan</h2>
          <p className="text-[#888] text-sm mb-8">Crunching your numbers...</p>

          <div className="w-full bg-white/5 rounded-full h-1.5 mb-3 overflow-hidden">
            <motion.div
              animate={{ width: `${planProgress}%` }}
              className="h-full bg-gold rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-gold text-sm font-bold tabular-nums">{Math.round(planProgress)}%</span>

          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {[
              'Calculating your daily calorie target',
              'Setting protein and macro targets',
              'Selecting your workout split',
              'Estimating your timeline',
              'Plan ready',
            ].map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0 }}
                animate={{ opacity: planProgress > i * 20 ? 1 : 0.2 }}
                className={cn('flex items-center gap-3 text-xs', planProgress > i * 20 ? 'text-[#888]' : 'text-[#333]')}
              >
                {planProgress > (i + 1) * 20
                  ? <Check size={13} className="text-gold flex-shrink-0" />
                  : <CircleDashed size={13} className="text-[#333] flex-shrink-0" />}
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
      {/* Top bar */}
      <div className="flex items-center justify-between py-4">
        <button
          onClick={back}
          disabled={step === 1}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center disabled:opacity-20 active:scale-90 transition-transform"
        >
          <ChevronLeft size={18} className="text-[#888]" />
        </button>

        {/* Progress pills */}
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                i < step ? 'bg-gold' : 'bg-white/10',
                i === step - 1 ? 'w-6' : 'w-2'
              )}
            />
          ))}
        </div>

        <button
          onClick={() => { setOnboardingComplete(true); router.push('/dashboard') }}
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
          {step === TOTAL_STEPS ? 'Generate My Plan' : 'Continue'}
          {step < TOTAL_STEPS && <ChevronRight size={18} className="ml-1" />}
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
        <OnboardingStep step={1} totalSteps={TOTAL_STEPS} title="What's your name?" subtitle="We'll use this to personalize your experience.">
          <div className="mt-6">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                type="text"
                placeholder="Your name"
                value={(onboardingData.name as string) || ''}
                onChange={e => setOnboardingData({ name: e.target.value })}
                autoFocus
                className="input-dark w-full h-16 rounded-2xl pl-12 pr-4 text-lg font-semibold"
              />
            </div>
          </div>
        </OnboardingStep>
      )

    case 2:
      return (
        <OnboardingStep step={2} totalSteps={TOTAL_STEPS} title="Biological sex?" subtitle="Used for metabolic rate calculations.">
          <div className="grid grid-cols-3 gap-3 mt-4">
            {([
              { id: 'male', icon: <User size={24} />, label: 'Male' },
              { id: 'female', icon: <Users size={24} />, label: 'Female' },
              { id: 'other', icon: <PersonStanding size={24} />, label: 'Other' },
            ] as { id: Gender; icon: React.ReactNode; label: string }[]).map(g => (
              <SelectCard
                key={g.id}
                selected={(onboardingData.gender as string) === g.id}
                onClick={() => setOnboardingData({ gender: g.id })}
              >
                <div className={cn('mb-3', (onboardingData.gender as string) === g.id ? 'text-gold' : 'text-[#555]')}>
                  {g.icon}
                </div>
                <span className="text-sm font-bold text-cream">{g.label}</span>
              </SelectCard>
            ))}
          </div>
        </OnboardingStep>
      )

    case 3:
      return (
        <OnboardingStep step={3} totalSteps={TOTAL_STEPS} title="How old are you?" subtitle="Age affects your metabolic rate.">
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
              className="w-full"
              style={{ accentColor: '#C8A96E' }}
            />
            <div className="flex justify-between w-full text-[#555] text-xs">
              <span>14 years</span>
              <span>80 years</span>
            </div>
          </div>
        </OnboardingStep>
      )

    case 4:
      return (
        <OnboardingStep step={4} totalSteps={TOTAL_STEPS} title="Your height?" subtitle="We'll use this to calculate your BMR.">
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
              <span>140 cm</span>
              <span>220 cm</span>
            </div>
          </div>
        </OnboardingStep>
      )

    case 5:
      return (
        <OnboardingStep step={5} totalSteps={TOTAL_STEPS} title="Current weight?" subtitle="Your starting point for the plan.">
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOnboardingData({ weight: Math.max(40, ((onboardingData.weight as number) || 80) - 1) })}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Minus size={18} className="text-[#888]" />
              </button>
              <div className="text-7xl font-black text-gold tabular-nums min-w-[160px] text-center">
                {(onboardingData.weight as number) || 80}
                <span className="text-2xl text-[#888] ml-1">kg</span>
              </div>
              <button
                onClick={() => setOnboardingData({ weight: Math.min(250, ((onboardingData.weight as number) || 80) + 1) })}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
              >
                <PlusIcon size={18} className="text-[#888]" />
              </button>
            </div>
            <input
              type="range"
              min={40}
              max={250}
              value={(onboardingData.weight as number) || 80}
              onChange={e => setOnboardingData({ weight: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#C8A96E' }}
            />
          </div>
        </OnboardingStep>
      )

    case 6:
      return (
        <OnboardingStep step={6} totalSteps={TOTAL_STEPS} title="Body fat estimate?" subtitle="Pick the closest match. This is optional.">
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { pct: '~10%', label: 'Very Lean', desc: 'Visible abs, vascularity', val: 10 },
              { pct: '~15%', label: 'Athletic', desc: 'Some muscle definition', val: 15 },
              { pct: '~20%', label: 'Average', desc: 'Soft midsection', val: 20 },
              { pct: '~25%', label: 'Above Average', desc: 'Noticeable fat cover', val: 25 },
              { pct: '~30%', label: 'High', desc: 'Round appearance', val: 30 },
              { pct: '30%+', label: 'Very High', desc: 'Significant body fat', val: 35 },
            ].map((opt) => (
              <SelectCard
                key={opt.pct}
                selected={(onboardingData.body_fat as number) === opt.val}
                onClick={() => setOnboardingData({ body_fat: opt.val })}
              >
                <div
                  className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center"
                  style={{
                    background: (onboardingData.body_fat as number) === opt.val
                      ? 'rgba(200,169,110,0.2)'
                      : 'rgba(255,255,255,0.04)',
                  }}
                >
                  <span className="text-gold font-black text-xs">{opt.pct}</span>
                </div>
                <span className="text-sm font-bold text-cream">{opt.label}</span>
                <span className="text-xs text-[#666] mt-0.5">{opt.desc}</span>
              </SelectCard>
            ))}
          </div>
        </OnboardingStep>
      )

    case 7:
      return (
        <OnboardingStep step={7} totalSteps={TOTAL_STEPS} title="Primary goal?" subtitle="Choose what you're working toward.">
          <GoalSelector
            selected={onboardingData.goal as import('@/types').Goal}
            onSelect={goal => setOnboardingData({ goal })}
          />
        </OnboardingStep>
      )

    case 8:
      return (
        <OnboardingStep step={8} totalSteps={TOTAL_STEPS} title="Where do you train?" subtitle="We'll design workouts around your equipment.">
          <div className="flex flex-col gap-3 mt-2">
            {([
              { id: 'home', icon: <Home size={20} />, label: 'Home', desc: 'Bodyweight and minimal equipment' },
              { id: 'gym', icon: <Dumbbell size={20} />, label: 'Full Gym', desc: 'Barbells, machines, cables' },
              { id: 'both', icon: <Blend size={20} />, label: 'Both', desc: 'Home workouts and gym sessions' },
            ] as { id: GymAccess; icon: React.ReactNode; label: string; desc: string }[]).map(opt => (
              <SelectCard
                key={opt.id}
                selected={(onboardingData.gym_access as string) === opt.id}
                onClick={() => setOnboardingData({ gym_access: opt.id })}
                horizontal
              >
                <div className={cn('mr-4 flex-shrink-0', (onboardingData.gym_access as string) === opt.id ? 'text-gold' : 'text-[#555]')}>
                  {opt.icon}
                </div>
                <div>
                  <p className="font-bold text-cream text-sm">{opt.label}</p>
                  <p className="text-[#666] text-xs mt-0.5">{opt.desc}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </OnboardingStep>
      )

    case 9:
      return (
        <OnboardingStep step={9} totalSteps={TOTAL_STEPS} title="Training experience?" subtitle="Be honest — the plan only works if it fits you.">
          <div className="flex flex-col gap-3 mt-2">
            {([
              { id: 'beginner', icon: <GraduationCap size={20} />, label: 'Beginner', desc: 'Less than 6 months of consistent training' },
              { id: 'some', icon: <Zap size={20} />, label: 'Some Experience', desc: '6 months to 1 year' },
              { id: 'intermediate', icon: <Flame size={20} />, label: 'Intermediate', desc: '1 to 3 years of training' },
              { id: 'advanced', icon: <Trophy size={20} />, label: 'Advanced', desc: '3+ years of serious training' },
            ] as { id: Experience; icon: React.ReactNode; label: string; desc: string }[]).map(opt => (
              <SelectCard
                key={opt.id}
                selected={(onboardingData.experience as string) === opt.id}
                onClick={() => setOnboardingData({ experience: opt.id })}
                horizontal
              >
                <div className={cn('mr-4 flex-shrink-0', (onboardingData.experience as string) === opt.id ? 'text-gold' : 'text-[#555]')}>
                  {opt.icon}
                </div>
                <div>
                  <p className="font-bold text-cream text-sm">{opt.label}</p>
                  <p className="text-[#666] text-xs mt-0.5">{opt.desc}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </OnboardingStep>
      )

    case 10:
      return (
        <OnboardingStep step={10} totalSteps={TOTAL_STEPS} title="Activity outside the gym?" subtitle="Daily movement beyond your workouts.">
          <div className="flex flex-col gap-3 mt-2">
            {([
              { id: 'sedentary', icon: <Sofa size={20} />, label: 'Sedentary', desc: 'Desk job, mostly sitting' },
              { id: 'light', icon: <PersonStanding size={20} />, label: 'Lightly Active', desc: 'Some walking, light activity' },
              { id: 'moderate', icon: <Bike size={20} />, label: 'Moderately Active', desc: 'Active job or regular movement' },
              { id: 'very_active', icon: <Flame size={20} />, label: 'Very Active', desc: 'Physical job or sport daily' },
            ] as { id: ActivityLevel; icon: React.ReactNode; label: string; desc: string }[]).map(opt => (
              <SelectCard
                key={opt.id}
                selected={(onboardingData.activity_level as string) === opt.id}
                onClick={() => setOnboardingData({ activity_level: opt.id })}
                horizontal
              >
                <div className={cn('mr-4 flex-shrink-0', (onboardingData.activity_level as string) === opt.id ? 'text-gold' : 'text-[#555]')}>
                  {opt.icon}
                </div>
                <div>
                  <p className="font-bold text-cream text-sm">{opt.label}</p>
                  <p className="text-[#666] text-xs mt-0.5">{opt.desc}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </OnboardingStep>
      )

    case 11:
      return (
        <OnboardingStep step={11} totalSteps={TOTAL_STEPS} title="Training days & target weight" subtitle="Pick your available days and where you want to be.">
          <div className="grid grid-cols-4 gap-2 mb-6">
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

          <p className="text-[#666] text-xs text-center mb-6">
            {((onboardingData.workout_days as string[]) || []).length} days selected
          </p>

          <div className="border-t border-white/5 pt-6">
            <p className="text-sm font-semibold text-cream mb-1">Target weight</p>
            <p className="text-xs text-[#666] mb-4">Where do you want to be?</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOnboardingData({ target_weight: Math.max(40, ((onboardingData.target_weight as number) || (onboardingData.weight as number) || 75) - 1) })}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Minus size={18} className="text-[#888]" />
              </button>
              <div className="flex-1 text-center">
                <span className="text-5xl font-black text-gold tabular-nums">
                  {(onboardingData.target_weight as number) || (onboardingData.weight as number) || 75}
                </span>
                <span className="text-xl text-[#888] ml-1">kg</span>
              </div>
              <button
                onClick={() => setOnboardingData({ target_weight: Math.min(250, ((onboardingData.target_weight as number) || (onboardingData.weight as number) || 75) + 1) })}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
              >
                <PlusIcon size={18} className="text-[#888]" />
              </button>
            </div>
            {onboardingData.weight && onboardingData.target_weight && (
              <div className="mt-4 glass-card rounded-2xl p-3 flex items-center gap-2">
                <Target size={14} className="text-gold" />
                <p className="text-sm text-[#888]">
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
