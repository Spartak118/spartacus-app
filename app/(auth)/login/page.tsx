'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, UserCircle2 } from 'lucide-react'
import { signIn } from '@/lib/supabase'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/Button'
import { SpartanHelmet } from '@/components/ui/SpartanHelmet'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

function getAuthErrorMessage(error: unknown): string {
  if (!error) return 'Something went wrong. Please try again.'
  const msg = error instanceof Error ? error.message : String(error)
  if (msg.includes('Invalid login credentials') || msg.includes('invalid_grant')) {
    return 'Incorrect email or password.'
  }
  if (msg.includes('Email not confirmed')) {
    return 'Please confirm your email before signing in.'
  }
  if (msg.includes('Too many requests')) {
    return 'Too many attempts. Please wait a moment.'
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Connection error. Check your internet and try again.'
  }
  return 'Sign in failed. Please try again.'
}

export default function LoginPage() {
  const router = useRouter()
  const { setUserId, setIsGuest, onboardingComplete } = useUserStore()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError('')
    const { data: authData, error: authError } = await signIn(data.email, data.password)
    setLoading(false)
    if (authError || !authData?.user) {
      setError(getAuthErrorMessage(authError))
      return
    }
    setUserId(authData.user.id)
    setIsGuest(false)
    router.push(onboardingComplete ? '/dashboard' : '/onboarding')
  }

  function handleGuest() {
    const guestId = `guest-${Date.now()}`
    setUserId(guestId)
    setIsGuest(true)
    useUserStore.getState().setProfile({
      id: guestId,
      email: '',
      name: 'Champion',
      gender: 'male',
      age: 25,
      height: 178,
      weight: 80,
      target_weight: 74,
      goal: 'lose_fat',
      gym_access: 'gym',
      experience: 'beginner',
      activity_level: 'moderate',
      workout_days: ['Monday', 'Wednesday', 'Friday'],
      units: 'metric',
      created_at: new Date().toISOString(),
    })
    router.push('/onboarding')
  }

  return (
    <div className="h-full flex flex-col bg-bg overflow-y-auto">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200,169,110,0.07) 0%, transparent 60%)',
        }}
      />

      <div className="flex-1 flex flex-col px-6 pt-16 pb-8 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div
            className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4"
            style={{ boxShadow: '0 0 30px rgba(200,169,110,0.12)' }}
          >
            <SpartanHelmet size={36} color="#C8A96E" />
          </div>
          <h1 className="text-2xl font-black text-gold tracking-tight">SPARTACUS</h1>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-black text-cream leading-tight">Welcome back</h2>
          <p className="text-[#888] text-sm mt-1">Sign in to continue your transformation.</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 mb-6"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                {...register('email')}
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                className="input-dark w-full h-14 rounded-2xl pl-11 pr-4 text-sm"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs pl-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className="input-dark w-full h-14 rounded-2xl pl-11 pr-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs pl-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-gold text-xs font-semibold">
              Forgot password?
            </Link>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center bg-red-400/10 rounded-xl py-2 px-4"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" variant="gold" fullWidth size="lg" loading={loading}>
            Sign In
          </Button>
        </motion.form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 mb-5"
        >
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[#555] text-xs">OR</span>
          <div className="flex-1 h-px bg-white/5" />
        </motion.div>

        {/* Guest */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <button
            onClick={handleGuest}
            className="w-full h-14 rounded-2xl border border-white/10 flex items-center justify-center gap-3 active:scale-97 transition-transform hover:border-white/20"
          >
            <UserCircle2 size={18} className="text-[#888]" />
            <span className="text-sm font-semibold text-[#888]">Continue as Guest</span>
          </button>
        </motion.div>

        {/* Sign up link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center text-[#888] text-sm mt-8"
        >
          No account?{' '}
          <Link href="/signup" className="text-gold font-bold">
            Create one
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
