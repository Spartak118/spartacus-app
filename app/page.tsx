'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store/userStore'
import { SpartanHelmet } from '@/components/ui/SpartanHelmet'

export default function SplashScreen() {
  const router = useRouter()
  const { userId, onboardingComplete } = useUserStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userId && onboardingComplete) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [userId, onboardingComplete, router])

  return (
    <div className="h-full flex flex-col items-center justify-center bg-bg relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(200,169,110,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(200,169,110,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6 z-10"
      >
        {/* Logo icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 150 }}
          className="w-24 h-24 rounded-3xl border border-gold/30 bg-gold/10 flex items-center justify-center"
          style={{ boxShadow: '0 0 60px rgba(200,169,110,0.25)' }}
        >
          <SpartanHelmet size={52} color="#C8A96E" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <h1
            className="text-6xl font-black tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, #C8A96E 0%, #E8C98E 40%, #C8A96E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SPARTACUS
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-[#888] text-base font-semibold tracking-[0.3em] uppercase mt-2"
          >
            Become Legendary
          </motion.p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-2 mt-4"
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-gold"
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-16 text-[#888] text-xs tracking-widest uppercase"
      >
        Forged in Iron. Built for Greatness.
      </motion.p>
    </div>
  )
}
