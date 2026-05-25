import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function getDayOfWeek(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date().getDay()]
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100
  return Math.round((weight / (heightM * heightM)) * 10) / 10
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs / 2.20462 * 10) / 10
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54
  return {
    feet: Math.floor(totalInches / 12),
    inches: Math.round(totalInches % 12),
  }
}

export function ftInToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54)
}

export function getProgressPercent(current: number, goal: number): number {
  return Math.min(100, Math.max(0, Math.round((current / goal) * 100)))
}

export function getDaysUntilGoal(weeks: number): string {
  const days = Math.round(weeks * 7)
  if (days < 30) return `${days} days`
  const months = Math.round(days / 30)
  return `${months} month${months > 1 ? 's' : ''}`
}

export function motivationalQuotes(): string[] {
  return [
    "The body achieves what the mind believes.",
    "Discipline is the bridge between goals and accomplishment.",
    "You don't find the will to win, you build it.",
    "Champions aren't made in gyms. Champions are made from something inside — a desire, a dream, a vision.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Success is not given. It is earned on the track, in the gym, with blood, sweat and tears.",
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "Make yourself a priority. At the end of the day, you're your longest commitment.",
    "Work hard in silence, let success be your noise.",
    "Be willing to be uncomfortable. Be comfortable being uncomfortable.",
    "It's going to be a journey. It's not a sprint to the finish.",
    "Sweat is just fat crying.",
    "Push yourself because no one else is going to do it for you.",
    "Don't wish for it. Work for it.",
    "The hardest lift is lifting your butt off the couch.",
    "You are one workout away from a good mood.",
    "Train insane or remain the same.",
    "Rome wasn't built in a day, neither was your physique.",
    "The Greek Gods weren't built in comfort. They were forged in fire.",
    "Every rep is a vote for the person you want to become.",
    "Suffer the pain of discipline or suffer the pain of regret.",
    "Iron never lies. It always tells the truth.",
    "A Spartan doesn't stop when he's tired. He stops when he's done.",
    "Be the warrior, not the worrier.",
    "Forge your body. Forge your legacy.",
    "Weakness is a choice. So is strength.",
    "The gym is the only place where pain equals progress.",
    "What you do in the dark will show in the light.",
    "Legends are born from the moments others quit.",
  ]
}

export function getDailyQuote(): string {
  const quotes = motivationalQuotes()
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return quotes[dayOfYear % quotes.length]
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function getWeekDates(): { day: string; date: string; short: string }[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

  return days.map((day, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return {
      day,
      date: date.toISOString().split('T')[0],
      short: date.getDate().toString(),
    }
  })
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayString()
}

export function calculateSleepDuration(bedtime: string, wakeTime: string): number {
  const [bedH, bedM] = bedtime.split(':').map(Number)
  const [wakeH, wakeM] = wakeTime.split(':').map(Number)

  let bedMinutes = bedH * 60 + bedM
  let wakeMinutes = wakeH * 60 + wakeM

  if (wakeMinutes < bedMinutes) {
    wakeMinutes += 24 * 60
  }

  return (wakeMinutes - bedMinutes) / 60
}

export function getRecoveryScore(sleepHours: number, quality: number): number {
  const sleepScore = Math.min(100, (sleepHours / 8) * 70)
  const qualityScore = quality * 6
  return Math.round(sleepScore + qualityScore)
}
