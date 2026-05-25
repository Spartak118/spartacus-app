export type Gender = 'male' | 'female' | 'other'
export type Goal = 'lose_fat' | 'build_muscle' | 'aesthetic' | 'greek_god' | 'athletic' | 'beginner'
export type GymAccess = 'home' | 'gym' | 'both'
export type Experience = 'beginner' | 'some' | 'intermediate' | 'advanced'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active'
export type WorkoutSplit = 'PPL' | 'Upper/Lower' | 'Full Body' | 'Bro Split'
export type Units = 'metric' | 'imperial'

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  gender: Gender
  age: number
  height: number
  weight: number
  target_weight: number
  body_fat?: number
  goal: Goal
  gym_access: GymAccess
  experience: Experience
  activity_level: ActivityLevel
  workout_days: string[]
  units: Units
  plan?: TransformationPlan
  created_at: string
}

export interface TransformationPlan {
  dailyCalories: number
  proteinGrams: number
  carbGrams: number
  fatGrams: number
  waterLiters: number
  sleepHours: number
  workoutDays: string[]
  workoutSplit: WorkoutSplit
  cardioMinutes: number
  estimatedWeeksToGoal: number
  weeklyWeightChange: number
  dailyHabits: string[]
  aestheticFocus: string[]
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: number
  notes?: string
  muscleGroup: string
  equipment: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface Workout {
  id: string
  name: string
  description: string
  muscleGroups: string[]
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  exercises: Exercise[]
  category: string
  isFeatured?: boolean
  split?: string
}

export interface WorkoutLog {
  id: string
  user_id: string
  workout_id: string
  workout_name: string
  completed_at: string
  duration: number
  exercises_completed: number
}

export interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  category: string
  prepTime?: number
  description?: string
  emoji?: string
}

export interface NutritionLog {
  id: string
  user_id: string
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
  meals: LoggedMeal[]
}

export interface LoggedMeal {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
}

export interface WeightEntry {
  id: string
  user_id: string
  date: string
  weight: number
}

export interface Measurements {
  chest?: number
  waist?: number
  hips?: number
  arms?: number
  thighs?: number
  shoulders?: number
  neck?: number
}

export interface MeasurementLog {
  id: string
  user_id: string
  date: string
  measurements: Measurements
}

export interface SleepLog {
  id: string
  user_id: string
  date: string
  bedtime: string
  wake_time: string
  quality: number
  duration: number
}

export interface StreakData {
  user_id: string
  current_streak: number
  longest_streak: number
  last_active_date: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  requirement: string
  unlocked: boolean
  unlocked_at?: string
  progress?: number
  maxProgress?: number
}

export interface ActiveWorkout {
  workout: Workout
  currentExerciseIndex: number
  currentSet: number
  startTime: number
  completedSets: Record<string, number[]>
  isResting: boolean
  restTimeRemaining: number
}

export interface OnboardingData {
  gender?: Gender
  age?: number
  height?: number
  weight?: number
  body_fat?: number
  gym_access?: GymAccess
  experience?: Experience
  goal?: Goal
  activity_level?: ActivityLevel
  workout_days?: string[]
  target_weight?: number
  name?: string
}
