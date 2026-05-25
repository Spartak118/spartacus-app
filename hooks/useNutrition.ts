'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { getNutritionLog, saveNutritionLog } from '@/lib/supabase'
import { getTodayString } from '@/lib/utils'
import type { LoggedMeal } from '@/types'

export function useNutrition() {
  const {
    userId, plan, nutritionToday, addMeal, addWater, resetNutrition
  } = useUserStore()

  const goals = {
    calories: plan?.dailyCalories || 2000,
    protein: plan?.proteinGrams || 150,
    carbs: plan?.carbGrams || 200,
    fat: plan?.fatGrams || 65,
    water: Math.round((plan?.waterLiters || 2.5) * 4),
  }

  useEffect(() => {
    if (!userId) return
    loadTodayLog()
  }, [userId])

  async function loadTodayLog() {
    if (!userId) return
    try {
      const { data } = await getNutritionLog(userId, getTodayString())
      if (data) {
        // Restore from database if available
      }
    } catch {
      // Use local state
    }
  }

  async function logMeal(meal: LoggedMeal) {
    addMeal(meal)
    if (!userId) return

    try {
      await saveNutritionLog(userId, {
        date: getTodayString(),
        calories: nutritionToday.calories + meal.calories,
        protein: nutritionToday.protein + meal.protein,
        carbs: nutritionToday.carbs + meal.carbs,
        fat: nutritionToday.fat + meal.fat,
        water: nutritionToday.water,
        meals: JSON.stringify([...nutritionToday.meals, meal]),
      })
    } catch {
      // Keep local state
    }
  }

  async function logWater(glasses: number) {
    addWater(glasses)
    if (!userId) return

    try {
      await saveNutritionLog(userId, {
        date: getTodayString(),
        calories: nutritionToday.calories,
        protein: nutritionToday.protein,
        carbs: nutritionToday.carbs,
        fat: nutritionToday.fat,
        water: nutritionToday.water + glasses,
        meals: JSON.stringify(nutritionToday.meals),
      })
    } catch {
      // Keep local state
    }
  }

  const remaining = {
    calories: Math.max(0, goals.calories - nutritionToday.calories),
    protein: Math.max(0, goals.protein - nutritionToday.protein),
    carbs: Math.max(0, goals.carbs - nutritionToday.carbs),
    fat: Math.max(0, goals.fat - nutritionToday.fat),
  }

  const percentages = {
    calories: Math.min(100, Math.round((nutritionToday.calories / goals.calories) * 100)),
    protein: Math.min(100, Math.round((nutritionToday.protein / goals.protein) * 100)),
    carbs: Math.min(100, Math.round((nutritionToday.carbs / goals.carbs) * 100)),
    fat: Math.min(100, Math.round((nutritionToday.fat / goals.fat) * 100)),
    water: Math.min(100, Math.round((nutritionToday.water / goals.water) * 100)),
  }

  return {
    today: nutritionToday,
    goals,
    remaining,
    percentages,
    logMeal,
    logWater,
    resetNutrition,
  }
}
