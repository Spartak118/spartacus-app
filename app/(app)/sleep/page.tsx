'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Star, Battery, Monitor, Thermometer, EyeOff, Clock, Pill } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import { Button } from '@/components/ui/Button'
import { calculateSleepDuration, getRecoveryScore } from '@/lib/utils'

const SAMPLE_SLEEP_DATA = Array.from({ length: 7 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (6 - i))
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    hours: 6 + Math.random() * 2.5,
    quality: Math.floor(3 + Math.random() * 3),
  }
})

export default function SleepPage() {
  const [bedtime, setBedtime] = useState('22:30')
  const [wakeTime, setWakeTime] = useState('06:30')
  const [quality, setQuality] = useState(4)
  const [saved, setSaved] = useState(false)

  const duration = calculateSleepDuration(bedtime, wakeTime)
  const recoveryScore = getRecoveryScore(duration, quality)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="h-full overflow-y-auto bg-bg px-4 pt-safe">
      <div className="pt-4 pb-4">
        <h1 className="text-2xl font-black text-[#F5F5F5]">Sleep</h1>
        <p className="text-[#888] text-sm">Recovery is where growth happens.</p>
      </div>

      <div className="space-y-4 pb-6">
        {/* Recovery Score */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-[#888] uppercase tracking-widest font-semibold mb-1">Recovery Score</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-gold">{recoveryScore}</span>
                <span className="text-[#888] text-sm">/100</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Battery size={22} className="text-gold" />
            </div>
          </div>

          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${recoveryScore}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: recoveryScore >= 80
                  ? 'linear-gradient(90deg, #A8D9A0, #C8D9A0)'
                  : recoveryScore >= 60
                    ? 'linear-gradient(90deg, #C8A96E, #E8C98E)'
                    : 'linear-gradient(90deg, #D9A0A0, #D9C0A0)'
              }}
            />
          </div>

          <p className="text-[#888] text-xs mt-2">
            {recoveryScore >= 80 ? 'Excellent recovery. Ready to perform.' :
              recoveryScore >= 60 ? 'Good recovery. Train hard today.' :
                'Poor recovery. Consider active rest or a lighter session.'}
          </p>
        </motion.div>

        {/* Log Sleep */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-5"
        >
          <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest mb-5">Log Tonight</h3>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Moon size={14} className="text-[#4A90D9]" />
                <label className="text-xs text-[#888] font-semibold uppercase tracking-wider">Bedtime</label>
              </div>
              <input
                type="time"
                value={bedtime}
                onChange={e => setBedtime(e.target.value)}
                className="input-dark w-full h-14 rounded-2xl px-4 text-sm tabular-nums"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sun size={14} className="text-gold" />
                <label className="text-xs text-[#888] font-semibold uppercase tracking-wider">Wake Up</label>
              </div>
              <input
                type="time"
                value={wakeTime}
                onChange={e => setWakeTime(e.target.value)}
                className="input-dark w-full h-14 rounded-2xl px-4 text-sm tabular-nums"
              />
            </div>
          </div>

          <div className="text-center mb-5 py-3 bg-white/3 rounded-2xl">
            <p className="text-xs text-[#888] mb-1">Duration</p>
            <p className="text-3xl font-black text-gold tabular-nums">{duration.toFixed(1)}h</p>
            <p className="text-xs text-[#555] mt-1">{duration >= 7 ? 'Meets target' : 'Below 7h target'}</p>
          </div>

          {/* Quality rating */}
          <div className="mb-5">
            <p className="text-xs text-[#888] uppercase tracking-widest font-semibold mb-3">Sleep Quality</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setQuality(star)}
                  className="flex-1 active:scale-90 transition-transform"
                >
                  <Star
                    size={28}
                    className="w-full"
                    fill={star <= quality ? '#C8A96E' : 'transparent'}
                    color={star <= quality ? '#C8A96E' : '#333'}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-[#666] mt-2">
              {quality === 1 ? 'Terrible' : quality === 2 ? 'Poor' : quality === 3 ? 'Fair' : quality === 4 ? 'Good' : 'Excellent'}
            </p>
          </div>

          <Button
            variant={saved ? 'outline' : 'gold'}
            fullWidth
            onClick={handleSave}
          >
            {saved ? 'Saved' : 'Save Sleep Log'}
          </Button>
        </motion.div>

        {/* Sleep chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest">This Week</h3>
            <span className="text-xs text-[#888]">Avg: {(SAMPLE_SLEEP_DATA.reduce((a, b) => a + b.hours, 0) / 7).toFixed(1)}h</span>
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={SAMPLE_SLEEP_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#555', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: '#555', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid rgba(200,169,110,0.3)',
                  borderRadius: '12px',
                  color: '#F5F5F5',
                }}
                formatter={(value) => [`${(value as number).toFixed(1)}h`, 'Sleep']}
              />
              <ReferenceLine
                y={8}
                stroke="#C8A96E"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{ value: '8h goal', fill: '#C8A96E', fontSize: 10 }}
              />
              <Bar
                dataKey="hours"
                fill="rgba(200,169,110,0.6)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sleep tips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-5"
        >
          <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-widest mb-4">Sleep Optimization</h3>
          <div className="space-y-3">
            {[
              { tip: 'No screens 1 hour before bed', icon: <Monitor size={16} className="text-[#4A90D9]" /> },
              { tip: 'Keep room temperature at 18–20°C', icon: <Thermometer size={16} className="text-[#A0D9D9]" /> },
              { tip: 'Blackout curtains or sleep mask', icon: <EyeOff size={16} className="text-[#888]" /> },
              { tip: 'Consistent bedtime within 30 minutes', icon: <Clock size={16} className="text-gold" /> },
              { tip: 'Magnesium glycinate before bed helps sleep quality', icon: <Pill size={16} className="text-[#A8D9A0]" /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0">{item.icon}</div>
                <p className="text-sm text-[#888] leading-relaxed">{item.tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
