'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { signUp } from '@/lib/supabase'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const { setUserId, setOnboardingData } = useUserStore()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError('')
    const { data: authData, error: authError } = await signUp(data.email, data.password, data.name)
    setLoading(false)

    if (authError) {
      setError((authError as Error).message || 'Failed to create account. Try again.')
      return
    }

    if (authData?.user) {
      setUserId(authData.user.id)
      setOnboardingData({ name: data.name })
      router.push('/onboarding')
    }
  }

  return (
    <div className="h-full flex flex-col bg-bg overflow-y-auto">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200,169,110,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="flex-1 flex flex-col px-6 pt-12 pb-8 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <span className="text-2xl">⚔️</span>
          </div>
          <span className="text-xl font-black text-gold tracking-tight">SPARTACUS</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-black text-[#F5F5F5] leading-tight">Begin Your<br />Transformation</h2>
          <p className="text-[#888] text-sm mt-2">Your legend starts here.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
              <input
                {...register('name')}
                type="text"
                placeholder="Your warrior name"
                className="input-dark w-full h-14 rounded-2xl pl-11 pr-4 text-sm"
              />
            </div>
            {errors.name && <p className="text-red-400 text-xs pl-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
              <input
                {...register('email')}
                type="email"
                placeholder="champion@example.com"
                className="input-dark w-full h-14 rounded-2xl pl-11 pr-4 text-sm"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs pl-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                placeholder="8+ characters"
                className="input-dark w-full h-14 rounded-2xl pl-11 pr-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444]"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs pl-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Repeat password"
                className="input-dark w-full h-14 rounded-2xl pl-11 pr-4 text-sm"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs pl-1">{errors.confirmPassword.message}</p>}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('terms')}
              type="checkbox"
              className="mt-0.5 w-5 h-5 rounded-lg border border-white/10 bg-white/5 accent-gold flex-shrink-0"
            />
            <span className="text-[#888] text-xs leading-relaxed">
              I agree to the{' '}
              <span className="text-gold font-semibold">Terms of Service</span>
              {' '}and{' '}
              <span className="text-gold font-semibold">Privacy Policy</span>
            </span>
          </label>
          {errors.terms && <p className="text-red-400 text-xs pl-1">{errors.terms.message}</p>}

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
            Create Account
          </Button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[#888] text-sm mt-6"
        >
          Already a warrior?{' '}
          <Link href="/login" className="text-gold font-bold">
            Sign In
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
