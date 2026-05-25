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

// Mifflin-St Jeor equation (more accurate than Harris-Benedict)
function calculateBMR(gender: Gender, weight: number, height: number, age: number): number {
  const base = 10 * weight + 6.25 * height - 5 * age
  return gender === 'male' ? base + 5 : base - 161
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
    build_muscle: 1.12,
    aesthetic: 0.9,
    greek_god: 1.05,
    athletic: 1.0,
    beginner: 0.95,
  }
  return modifiers[goal]
}

// 1.6–2.2g protein per kg of bodyweight depending on goal
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
  // No gym access always means full body
  if (gym_access === 'home') return 'Full Body'
  // Beginners need full-body frequency for motor pattern development
  if (experience === 'beginner') return 'Full Body'
  // Low days → full body regardless of experience
  if (daysCount <= 3) return 'Full Body'
  // Some experience or intermediate with moderate days → upper/lower
  if (experience === 'some' || (experience === 'intermediate' && daysCount <= 4)) return 'Upper/Lower'
  // Intermediate/advanced with 5+ days → PPL
  if (daysCount >= 5) return 'PPL'
  return 'Upper/Lower'
}

function getCardioMinutes(goal: Goal, activity_level: ActivityLevel): number {
  const base: Record<Goal, number> = {
    lose_fat: 35,
    build_muscle: 15,
    aesthetic: 25,
    greek_god: 20,
    athletic: 30,
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
  return Math.min(52, Math.max(4, Math.round(diff / Math.abs(weeklyChange))))
}

function getDailyHabits(goal: Goal, experience: Experience): string[] {
  const common = [
    'Drink 500ml of water within 10 minutes of waking',
    'Get 10 minutes of natural light in the morning',
    'Log every meal before eating it',
    'Walk at least 7,000 steps per day',
    'Be in bed 8 hours before your alarm',
  ]

  const goalSpecific: Record<Goal, string[]> = {
    lose_fat: [
      'Start each meal with protein and vegetables',
      'Stop eating 3 hours before bed',
      'Use a 20-minute walk after your largest meal to blunt glucose spikes',
      'Weigh yourself every morning after using the bathroom',
    ],
    build_muscle: [
      'Eat a protein-rich meal within 90 minutes of finishing training',
      'Track your compound lifts — aim for progressive overload weekly',
      'Eat enough — undereating kills muscle growth',
      'Prioritize sleep: muscle is built at rest, not in the gym',
    ],
    aesthetic: [
      'Train with intent — quality reps over heavy weight',
      'Track measurements weekly, not just bodyweight',
      'Focus on the mind-muscle connection on every set',
      'Take progress photos every two weeks in the same light',
    ],
    greek_god: [
      'Prioritize lateral deltoid and lat width work every session',
      'Do 10 minutes of core and posture work daily',
      'Track your shoulder-to-waist ratio monthly',
      'Control body fat: aim for 10–13% for the Greek God look',
    ],
    athletic: [
      'Warm up for 10 minutes with dynamic movement before every session',
      'Work on mobility for 15 minutes on rest days',
      'Track sport performance metrics, not just aesthetics',
      'Eat enough carbohydrates to fuel training intensity',
    ],
    beginner: [
      'Master the form before adding weight — film yourself',
      'Consistency beats intensity: showing up matters more than volume',
      'Rest days are not optional — recovery is where you grow',
      'Set a specific time for training and treat it like an appointment',
    ],
  }

  const experienceHint: Record<Experience, string> = {
    beginner: 'Follow the plan for 8 weeks before changing anything',
    some: 'Track your lifts — aim to add weight or reps each week',
    intermediate: 'Periodize your training — plan deload weeks every 6–8 weeks',
    advanced: 'Monitor recovery: HRV, sleep quality, and mood are signals',
  }

  return [...common, ...goalSpecific[goal], experienceHint[experience]].slice(0, 8)
}

function getAestheticFocus(goal: Goal): string[] {
  const focuses: Record<Goal, string[]> = {
    lose_fat: ['Core definition', 'Face definition', 'Vascular forearms', 'Separation between muscle groups'],
    build_muscle: ['Chest thickness', 'Back width and thickness', 'Arm circumference', 'Quad sweep'],
    aesthetic: ['V-taper (shoulder-to-waist ratio)', 'Shoulder roundness', 'Visible abs', 'Arm definition'],
    greek_god: ['Boulder shoulders', 'Wide lats', 'Chest striations', 'Narrow waist', 'Diamond calves'],
    athletic: ['Functional strength', 'Explosive power output', 'Cardiovascular endurance', 'Movement quality'],
    beginner: ['Posture improvement', 'Full-body muscle tone', 'Confidence in movement', 'Building the base'],
  }
  return focuses[goal]
}

function getSleepHours(goal: Goal): number {
  if (goal === 'build_muscle' || goal === 'greek_god') return 8.5
  if (goal === 'athletic') return 9
  return 8
}

export function generatePlan(userData: UserInput): TransformationPlan {
  const bmr = calculateBMR(userData.gender, userData.weight, userData.height, userData.age)
  const tdee = Math.round(bmr * getActivityMultiplier(userData.activity_level))
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
    : ['Monday', 'Wednesday', 'Friday']

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
    dailyHabits: getDailyHabits(userData.goal, userData.experience),
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
  if (params.workoutsThisWeek === 0 && params.nutritionDaysHit === 0 && params.currentStreak === 0) return 0
  const workoutScore = Math.min(40, (params.workoutsThisWeek / Math.max(1, params.targetWorkouts)) * 40)
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
  if (params.daysInProgram <= 1) return 0
  const progressScore = Math.min(60, params.weeklyProgress * 10)
  const timeScore = Math.min(30, (params.daysInProgram / 90) * 30)
  return Math.round(progressScore + timeScore)
}
