'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { signIn } from '@/lib/supabase'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { setUserId, onboardingComplete } = useUserStore()
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
    if (authError) {
      setError('Invalid email or password. Try again.')
      return
    }
    if (authData?.user) {
      setUserId(authData.user.id)
      router.push(onboardingComplete ? '/dashboard' : '/onboarding')
    }
  }

  function handleDemoLogin() {
    setUserId('demo-user-123')
    useUserStore.getState().setOnboardingComplete(true)
    useUserStore.getState().setProfile({
      id: 'demo-user-123',
      email: 'demo@spartacus.app',
      name: 'Spartan',
      gender: 'male',
      age: 28,
      height: 180,
      weight: 82,
      target_weight: 75,
      goal: 'greek_god',
      gym_access: 'gym',
      experience: 'intermediate',
      activity_level: 'moderate',
      workout_days: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
      units: 'metric',
      created_at: new Date().toISOString(),
    })
    router.push('/dashboard')
  }

  return (
    <div className="h-full flex flex-col bg-bg overflow-y-auto">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200,169,110,0.08) 0%, transparent 60%)',
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
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4"
            style={{ boxShadow: '0 0 30px rgba(200,169,110,0.15)' }}>
            <span className="text-3xl">⚔️</span>
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
          <h2 className="text-3xl font-black text-[#F5F5F5] leading-tight">Welcome Back,<br />Champion</h2>
          <p className="text-[#888] text-sm mt-2">Your transformation continues.</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 mb-6"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
              <input
                {...register('email')}
                type="email"
                placeholder="champion@example.com"
                autoComplete="email"
                className="input-dark w-full h-14 rounded-2xl pl-11 pr-4 text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs pl-1">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot */}
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
          className="flex items-center gap-4 mb-6"
        >
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[#555] text-xs">OR</span>
          <div className="flex-1 h-px bg-white/5" />
        </motion.div>

        {/* Social + Demo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-3"
        >
          <button className="w-full h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center gap-3 active:scale-97 transition-transform">
            <span className="text-xl">G</span>
            <span className="text-sm font-semibold text-[#F5F5F5]">Continue with Google</span>
          </button>

          <button className="w-full h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center gap-3 active:scale-97 transition-transform">
            <span className="text-xl">🍎</span>
            <span className="text-sm font-semibold text-[#F5F5F5]">Continue with Apple</span>
          </button>

          <button
            onClick={handleDemoLogin}
            className="w-full h-12 rounded-2xl border border-gold/20 flex items-center justify-center gap-2 active:scale-97 transition-transform"
          >
            <span className="text-gold text-sm font-bold">⚔️ Try Demo</span>
          </button>
        </motion.div>

        {/* Sign up link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center text-[#888] text-sm mt-8"
        >
          New warrior?{' '}
          <Link href="/signup" className="text-gold font-bold">
            Join Spartacus
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
