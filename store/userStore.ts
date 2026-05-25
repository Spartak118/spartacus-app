'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  UserProfile, TransformationPlan, ActiveWorkout,
  LoggedMeal, StreakData, OnboardingData
} from '@/types'

export type Theme = 'dark' | 'light'

interface NutritionToday {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
  meals: LoggedMeal[]
}

interface UserStore {
  // Auth
  userId: string | null
  isGuest: boolean
  setUserId: (id: string | null) => void
  setIsGuest: (guest: boolean) => void

  // Profile
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  updateProfile: (data: Partial<UserProfile>) => void

  // Plan
  plan: TransformationPlan | null
  setPlan: (plan: TransformationPlan | null) => void

  // Onboarding
  onboardingData: OnboardingData
  setOnboardingData: (data: Partial<OnboardingData>) => void
  onboardingComplete: boolean
  setOnboardingComplete: (complete: boolean) => void

  // Nutrition
  nutritionToday: NutritionToday
  addMeal: (meal: LoggedMeal) => void
  addWater: (glasses: number) => void
  resetNutrition: () => void

  // Workout
  activeWorkout: ActiveWorkout | null
  setActiveWorkout: (workout: ActiveWorkout | null) => void
  updateActiveWorkout: (data: Partial<ActiveWorkout>) => void

  // Streak
  streak: StreakData | null
  setStreak: (streak: StreakData | null) => void

  // Settings
  units: 'metric' | 'imperial'
  setUnits: (units: 'metric' | 'imperial') => void
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  theme: Theme
  setTheme: (theme: Theme) => void

  // UI
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Discipline / aesthetic tracking (real logged data)
  workoutsThisWeek: number
  nutritionDaysHit: number
  incrementWorkoutsThisWeek: () => void
  incrementNutritionDaysHit: () => void
}

const defaultNutrition: NutritionToday = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  water: 0,
  meals: [],
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      isGuest: false,
      setUserId: (id) => set({ userId: id }),
      setIsGuest: (guest) => set({ isGuest: guest }),

      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (data) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...data } : null,
        })),

      plan: null,
      setPlan: (plan) => set({ plan }),

      onboardingData: {},
      setOnboardingData: (data) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, ...data },
        })),
      onboardingComplete: false,
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),

      nutritionToday: defaultNutrition,
      addMeal: (meal) =>
        set((state) => ({
          nutritionToday: {
            ...state.nutritionToday,
            calories: state.nutritionToday.calories + meal.calories,
            protein: state.nutritionToday.protein + meal.protein,
            carbs: state.nutritionToday.carbs + meal.carbs,
            fat: state.nutritionToday.fat + meal.fat,
            meals: [...state.nutritionToday.meals, meal],
          },
        })),
      addWater: (glasses) =>
        set((state) => ({
          nutritionToday: {
            ...state.nutritionToday,
            water: state.nutritionToday.water + glasses,
          },
        })),
      resetNutrition: () => set({ nutritionToday: defaultNutrition }),

      activeWorkout: null,
      setActiveWorkout: (workout) => set({ activeWorkout: workout }),
      updateActiveWorkout: (data) =>
        set((state) => ({
          activeWorkout: state.activeWorkout
            ? { ...state.activeWorkout, ...data }
            : null,
        })),

      streak: null,
      setStreak: (streak) => set({ streak }),

      units: 'metric',
      setUnits: (units) => set({ units }),
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      workoutsThisWeek: 0,
      nutritionDaysHit: 0,
      incrementWorkoutsThisWeek: () =>
        set((state) => ({ workoutsThisWeek: state.workoutsThisWeek + 1 })),
      incrementNutritionDaysHit: () =>
        set((state) => ({ nutritionDaysHit: state.nutritionDaysHit + 1 })),
    }),
    {
      name: 'spartacus-store',
      partialize: (state) => ({
        userId: state.userId,
        isGuest: state.isGuest,
        profile: state.profile,
        plan: state.plan,
        onboardingData: state.onboardingData,
        onboardingComplete: state.onboardingComplete,
        nutritionToday: state.nutritionToday,
        streak: state.streak,
        units: state.units,
        notificationsEnabled: state.notificationsEnabled,
        theme: state.theme,
        workoutsThisWeek: state.workoutsThisWeek,
        nutritionDaysHit: state.nutritionDaysHit,
      }),
    }
  )
)
