import type {
  Gender, Goal, ActivityLevel, GymAccess, Experience,
  TransformationPlan, WorkoutSplit
} from '@/types'

interface UserInput {
  gender: Gender
  age: number
  height: number
  weight: number
  target_weight: number
  goal: Goal
  activity_level: ActivityLevel
  gym_access: GymAccess
  experience: Experience
  workout_days: string[]
  body_fat?: number
}

function calculateBMR(gender: Gender, weight: number, height: number, age: number): number {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  }
  return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
}

function getActivityMultiplier(level: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
  }
  return multipliers[level]
}

function getCalorieModifier(goal: Goal): number {
  const modifiers: Record<Goal, number> = {
    lose_fat: 0.8,
    build_muscle: 1.15,
    aesthetic: 0.9,
    greek_god: 1.05,
    athletic: 1.0,
    beginner: 1.0,
  }
  return modifiers[goal]
}

function getProteinMultiplier(goal: Goal): number {
  const multipliers: Record<Goal, number> = {
    lose_fat: 2.2,
    build_muscle: 2.0,
    aesthetic: 2.0,
    greek_god: 2.0,
    athletic: 1.8,
    beginner: 1.6,
  }
  return multipliers[goal]
}

function getWorkoutSplit(experience: Experience, gym_access: GymAccess, daysCount: number): WorkoutSplit {
  if (gym_access === 'home' || daysCount <= 3) return 'Full Body'
  if (experience === 'beginner') return 'Full Body'
  if (experience === 'some') return 'Upper/Lower'
  if (daysCount >= 6) return 'PPL'
  return 'Upper/Lower'
}

function getCardioMinutes(goal: Goal, activity_level: ActivityLevel): number {
  const base: Record<Goal, number> = {
    lose_fat: 40,
    build_muscle: 15,
    aesthetic: 25,
    greek_god: 20,
    athletic: 35,
    beginner: 20,
  }
  const activityBonus: Record<ActivityLevel, number> = {
    sedentary: 10,
    light: 5,
    moderate: 0,
    very_active: -10,
  }
  return Math.max(0, base[goal] + activityBonus[activity_level])
}

function getWeeklyWeightChange(goal: Goal): number {
  const changes: Record<Goal, number> = {
    lose_fat: -0.5,
    build_muscle: 0.25,
    aesthetic: -0.25,
    greek_god: 0.15,
    athletic: 0,
    beginner: -0.25,
  }
  return changes[goal]
}

function getEstimatedWeeks(currentWeight: number, targetWeight: number, weeklyChange: number): number {
  const diff = Math.abs(targetWeight - currentWeight)
  if (diff < 0.5 || weeklyChange === 0) return 12
  return Math.round(diff / Math.abs(weeklyChange))
}

function getDailyHabits(goal: Goal): string[] {
  const common = [
    'Drink water within 5 minutes of waking',
    'Get morning sunlight exposure',
    'Track all meals before eating',
    '10,000+ steps daily',
    'No alcohol during transformation',
  ]

  const goalSpecific: Record<Goal, string[]> = {
    lose_fat: [
      'Eat protein first at every meal',
      '16:8 intermittent fasting window',
      'Cold shower to boost metabolism',
      'Evening walk after dinner',
    ],
    build_muscle: [
      'Eat within 30 min of waking',
      'Post-workout protein shake within 30 min',
      'Eat every 3-4 hours',
      'Prioritize compound lifts',
    ],
    aesthetic: [
      'Posture check every hour',
      'Visualize your physique daily',
      'Mirror check your progress weekly',
      'Focus on mind-muscle connection',
    ],
    greek_god: [
      'Shoulder width exercises daily',
      'Waist vacuum exercises',
      'Proportional training focus',
      'Track measurements weekly',
    ],
    athletic: [
      'Dynamic warm-up before every session',
      'Sport-specific practice daily',
      'Mobility work every morning',
      'Sleep tracking nightly',
    ],
    beginner: [
      'Learn one new exercise form each week',
      'Celebrate every small win',
      'Take weekly progress photos',
      'Rest day is still a health day',
    ],
  }

  return [...common, ...goalSpecific[goal]].slice(0, 8)
}

function getAestheticFocus(goal: Goal): string[] {
  const focuses: Record<Goal, string[]> = {
    lose_fat: ['Core definition', 'Vascular forearms', 'Face definition', 'Jawline sharpness'],
    build_muscle: ['Chest thickness', 'Back width', 'Arm circumference', 'Quad sweep'],
    aesthetic: ['V-taper', 'Shoulder caps', 'Visible abs', 'Defined arms'],
    greek_god: ['Boulder shoulders', 'V-taper back', 'Chest striations', 'Cinched waist', 'Diamond calves'],
    athletic: ['Functional strength', 'Explosive power', 'Endurance', 'Agility'],
    beginner: ['Full body toning', 'Posture improvement', 'Confidence building', 'Habit formation'],
  }
  return focuses[goal]
}

function getSleepHours(goal: Goal): number {
  if (goal === 'build_muscle' || goal === 'greek_god') return 8.5
  if (goal === 'athletic') return 9
  return 7.5
}

export function generatePlan(userData: UserInput): TransformationPlan {
  const bmr = calculateBMR(userData.gender, userData.weight, userData.height, userData.age)
  const tdee = bmr * getActivityMultiplier(userData.activity_level)
  const dailyCalories = Math.round(tdee * getCalorieModifier(userData.goal))

  const proteinGrams = Math.round(userData.weight * getProteinMultiplier(userData.goal))
  const fatGrams = Math.round((dailyCalories * 0.25) / 9)
  const proteinCalories = proteinGrams * 4
  const fatCalories = fatGrams * 9
  const carbCalories = dailyCalories - proteinCalories - fatCalories
  const carbGrams = Math.max(50, Math.round(carbCalories / 4))

  const waterLiters = Math.round(userData.weight * 0.033 * 10) / 10
  const sleepHours = getSleepHours(userData.goal)

  const daysCount = userData.workout_days.length || 4
  const workoutSplit = getWorkoutSplit(userData.experience, userData.gym_access, daysCount)
  const cardioMinutes = getCardioMinutes(userData.goal, userData.activity_level)
  const weeklyWeightChange = getWeeklyWeightChange(userData.goal)
  const estimatedWeeksToGoal = getEstimatedWeeks(
    userData.weight,
    userData.target_weight,
    weeklyWeightChange
  )

  const assignedDays = userData.workout_days.length > 0
    ? userData.workout_days
    : ['Monday', 'Tuesday', 'Thursday', 'Friday']

  return {
    dailyCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    waterLiters,
    sleepHours,
    workoutDays: assignedDays,
    workoutSplit,
    cardioMinutes,
    estimatedWeeksToGoal,
    weeklyWeightChange,
    dailyHabits: getDailyHabits(userData.goal),
    aestheticFocus: getAestheticFocus(userData.goal),
  }
}

export function calculateDisciplineScore(params: {
  workoutsThisWeek: number
  targetWorkouts: number
  nutritionDaysHit: number
  currentStreak: number
  sleepGoalHit: boolean
}): number {
  const workoutScore = Math.min(40, (params.workoutsThisWeek / params.targetWorkouts) * 40)
  const nutritionScore = Math.min(30, (params.nutritionDaysHit / 7) * 30)
  const streakScore = Math.min(20, (params.currentStreak / 30) * 20)
  const sleepScore = params.sleepGoalHit ? 10 : 0
  return Math.round(workoutScore + nutritionScore + streakScore + sleepScore)
}

export function calculateAestheticScore(params: {
  weeklyProgress: number
  goalType: Goal
  daysInProgram: number
}): number {
  const progressScore = Math.min(60, params.weeklyProgress * 10)
  const timeScore = Math.min(30, (params.daysInProgram / 90) * 30)
  const baseScore = 10
  return Math.round(baseScore + progressScore + timeScore)
}
