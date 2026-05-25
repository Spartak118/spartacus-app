'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User, Bell, Scale, Shield, Crown, ChevronRight,
  LogOut, Lock, Star, Zap, BarChart2, Dumbbell,
  UtensilsCrossed, Flame, Calendar, Target, Sun, Moon
} from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { signOut } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { SpartanHelmet } from '@/components/ui/SpartanHelmet'

export default function SettingsPage() {
  const router = useRouter()
  const {
    profile, units, setUnits, notificationsEnabled, setNotificationsEnabled,
    theme, setTheme
  } = useUserStore()
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)

  async function handleSignOut() {
    await signOut()
    useUserStore.getState().setUserId(null)
    useUserStore.getState().setProfile(null)
    useUserStore.getState().setOnboardingComplete(false)
    router.push('/login')
  }

  const plan = useUserStore.getState().plan

  return (
    <div className="h-full overflow-y-auto bg-bg">
      <div className="px-4 pt-safe pb-4">
        <div className="pt-4 pb-4">
          <h1 className="text-2xl font-black text-cream">Settings</h1>
        </div>

        <div className="space-y-4">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-5"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <SpartanHelmet size={36} color="#C8A96E" />
              </div>
              <div>
                <h2 className="text-lg font-black text-cream">{profile?.name || 'Champion'}</h2>
                <p className="text-[#888] text-sm">{profile?.email || 'Guest session'}</p>
                <p className="text-gold text-xs font-semibold capitalize mt-0.5">
                  {profile?.goal?.replace('_', ' ') || 'Fitness Journey'}
                </p>
              </div>
            </div>

            <button className="w-full flex items-center justify-between py-3 border-t border-white/5">
              <div className="flex items-center gap-3">
                <User size={16} className="text-gold" />
                <span className="text-sm font-semibold text-cream">Edit Profile</span>
              </div>
              <ChevronRight size={16} className="text-[#444]" />
            </button>
          </motion.div>

          {/* Plan Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-3xl p-5"
          >
            <p className="text-xs text-[#888] uppercase tracking-widest font-semibold mb-4">Your Plan</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Daily Calories', value: `${plan?.dailyCalories || 2200} kcal`, icon: <Flame size={14} className="text-gold" /> },
                { label: 'Protein Target', value: `${plan?.proteinGrams || 165}g`, icon: <Dumbbell size={14} className="text-gold" /> },
                { label: 'Workout Split', value: plan?.workoutSplit || 'PPL', icon: <Calendar size={14} className="text-gold" /> },
                { label: 'Time to Goal', value: `${plan?.estimatedWeeksToGoal || 12} wks`, icon: <Target size={14} className="text-gold" /> },
              ].map((item) => (
                <div key={item.label} className="bg-white/3 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <span className="text-[10px] text-[#666] uppercase tracking-wider">{item.label}</span>
                  </div>
                  <p className="text-sm font-black text-gold">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-5"
          >
            <p className="text-xs text-[#888] uppercase tracking-widest font-semibold mb-4">Preferences</p>
            <div className="space-y-1">
              <SettingToggle
                icon={<Bell size={16} />}
                label="Notifications"
                description="Workout reminders and daily check-ins"
                checked={notificationsEnabled}
                onChange={setNotificationsEnabled}
              />

              {/* Units */}
              <div className="py-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Scale size={16} className="text-gold" />
                    <div>
                      <p className="text-sm font-semibold text-cream">Units</p>
                      <p className="text-xs text-[#666]">Weight and height measurement</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                    <button
                      onClick={() => setUnits('metric')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${units === 'metric' ? 'bg-gold text-black' : 'text-[#888]'}`}
                    >
                      kg/cm
                    </button>
                    <button
                      onClick={() => setUnits('imperial')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${units === 'imperial' ? 'bg-gold text-black' : 'text-[#888]'}`}
                    >
                      lbs/ft
                    </button>
                  </div>
                </div>
              </div>

              {/* Theme */}
              <div className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield size={16} className="text-gold" />
                    <div>
                      <p className="text-sm font-semibold text-cream">Theme</p>
                      <p className="text-xs text-[#666]">App appearance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-gold text-black' : 'text-[#888]'}`}
                    >
                      <Moon size={12} />
                      Dark
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-gold text-black' : 'text-[#888]'}`}
                    >
                      <Sun size={12} />
                      Light
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Spartacus Pro */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl p-5 border-gold-glow relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.08) 0%, rgba(200,169,110,0.04) 100%)' }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.3) 0%, transparent 70%)' }}
            />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                <Crown size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-gold font-black text-base">Spartacus Pro</p>
                <p className="text-[#888] text-xs">Unlock your full potential</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {[
                { icon: <Zap size={14} />, text: 'AI-powered plan adjustments' },
                { icon: <BarChart2 size={14} />, text: 'Advanced analytics and insights' },
                { icon: <Dumbbell size={14} />, text: '200+ premium workouts' },
                { icon: <UtensilsCrossed size={14} />, text: 'Custom meal planning' },
                { icon: <Star size={14} />, text: 'Priority coaching access' },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-gold/60">{feat.icon}</div>
                  <p className="text-sm text-[#888]">{feat.text}</p>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <p className="text-[#888] text-xs mb-1">Free plan includes:</p>
              <div className="space-y-1">
                {['Basic workout tracking', 'Standard meal logging', 'Progress photos (limited)'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Lock size={10} className="text-[#444]" />
                    <p className="text-[#444] text-xs">{f}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="gold" fullWidth>
              Upgrade to Pro — $9.99/mo
            </Button>
          </motion.div>

          {/* Privacy & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-5"
          >
            <p className="text-xs text-[#888] uppercase tracking-widest font-semibold mb-4">Privacy & Legal</p>
            {['Privacy Policy', 'Terms of Service', 'Data Export', 'Delete Account'].map((item) => (
              <button
                key={item}
                className="w-full flex items-center justify-between py-3 border-b border-white/5 last:border-0 active:scale-99 transition-transform"
              >
                <span className={`text-sm font-medium ${item === 'Delete Account' ? 'text-red-400' : 'text-[#888]'}`}>{item}</span>
                <ChevronRight size={14} className="text-[#333]" />
              </button>
            ))}
          </motion.div>

          {/* Sign Out */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {!showSignOutConfirm ? (
              <button
                onClick={() => setShowSignOutConfirm(true)}
                className="w-full flex items-center justify-center gap-3 py-4 glass-card rounded-2xl active:scale-97 transition-transform"
              >
                <LogOut size={18} className="text-[#888]" />
                <span className="text-[#888] text-sm font-semibold">Sign Out</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-4"
              >
                <p className="text-sm text-cream font-semibold text-center mb-3">Sign out of Spartacus?</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="ghost" onClick={() => setShowSignOutConfirm(false)}>Cancel</Button>
                  <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <p className="text-center text-[#333] text-xs pb-4">SPARTACUS v1.0.0</p>
        </div>
      </div>
    </div>
  )
}

function SettingToggle({
  icon, label, description, checked, onChange
}: {
  icon: React.ReactNode
  label: string
  description: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="text-gold">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-cream">{label}</p>
          <p className="text-xs text-[#666]">{description}</p>
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="toggle flex-shrink-0"
      />
    </div>
  )
}
