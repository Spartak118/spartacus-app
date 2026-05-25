'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { getStreak, updateStreak } from '@/lib/supabase'
import { getTodayString } from '@/lib/utils'

export function useStreak() {
  const { userId, streak, setStreak } = useUserStore()

  useEffect(() => {
    if (!userId) return
    loadStreak()
  }, [userId])

  async function loadStreak() {
    if (!userId) return
    try {
      const { data } = await getStreak(userId)
      if (data) {
        setStreak(data)
      } else {
        const initial = {
          user_id: userId,
          current_streak: 0,
          longest_streak: 0,
          last_active_date: '',
        }
        setStreak(initial)
      }
    } catch {
      // Use local state if Supabase fails
    }
  }

  async function markDayActive() {
    if (!userId) return
    const today = getTodayString()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const currentStreak = streak?.current_streak || 0
    const lastActive = streak?.last_active_date || ''

    if (lastActive === today) return

    let newStreak = 1
    if (lastActive === yesterdayStr) {
      newStreak = currentStreak + 1
    }

    const newStreakData = {
      user_id: userId,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, streak?.longest_streak || 0),
      last_active_date: today,
    }

    setStreak(newStreakData)

    try {
      await updateStreak(userId, newStreakData)
    } catch {
      // Persist locally if Supabase fails
    }
  }

  return {
    currentStreak: streak?.current_streak || 0,
    longestStreak: streak?.longest_streak || 0,
    lastActiveDate: streak?.last_active_date || '',
    markDayActive,
  }
}
