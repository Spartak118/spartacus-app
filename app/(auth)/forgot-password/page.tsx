'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { resetPassword } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError('')
    const { error: resetError } = await resetPassword(data.email)
    setLoading(false)
    if (resetError) {
      setError('Failed to send reset email. Please try again.')
      return
    }
    setSent(true)
  }

  return (
    <div className="h-full flex flex-col bg-bg px-6 pt-12 pb-8">
      <Link href="/login" className="flex items-center gap-2 text-[#888] mb-8 active:scale-95 transition-transform w-fit">
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to login</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
          <Mail size={24} className="text-gold" />
        </div>
        <h2 className="text-3xl font-black text-[#F5F5F5] leading-tight">Reset Password</h2>
        <p className="text-[#888] text-sm mt-2">
          Enter your email and we'll send you a reset link.
        </p>
      </motion.div>

      {!sent ? (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
              <input
                {...register('email')}
                type="email"
                placeholder="your@email.com"
                className="input-dark w-full h-14 rounded-2xl pl-11 pr-4 text-sm"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs pl-1">{errors.email.message}</p>}
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-xl py-2 px-4">{error}</p>
          )}

          <Button type="submit" variant="gold" fullWidth size="lg" loading={loading}>
            Send Reset Link
          </Button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center gap-4 mt-8"
        >
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-gold" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#F5F5F5] mb-2">Email Sent!</h3>
            <p className="text-[#888] text-sm leading-relaxed">
              Check <span className="text-gold font-semibold">{getValues('email')}</span> for a password reset link.
            </p>
          </div>
          <Link href="/login">
            <Button variant="outline" size="md">
              Back to Sign In
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}
