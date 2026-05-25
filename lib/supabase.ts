import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_supabase) return _supabase

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !url.startsWith('http') || !key || key === 'placeholder-key') {
    // Return a dummy client during build / when env vars aren't set
    // All calls will fail gracefully due to try/catch wrappers
    _supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    return _supabase
  }

  _supabase = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return _supabase
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await getClient().auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await getClient().auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function resetPassword(email: string) {
  try {
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : undefined
    const { error } = await getClient().auth.resetPasswordForEmail(email, { redirectTo })
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function getProfile(userId: string) {
  try {
    const { data, error } = await getClient()
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function saveProfile(userId: string, profileData: Record<string, unknown>) {
  try {
    const { data, error } = await getClient()
      .from('profiles')
      .upsert({ user_id: userId, ...profileData, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getNutritionLog(userId: string, date: string) {
  try {
    const { data, error } = await getClient()
      .from('nutrition_log')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function saveNutritionLog(userId: string, logData: Record<string, unknown>) {
  try {
    const { data, error } = await getClient()
      .from('nutrition_log')
      .upsert({ user_id: userId, ...logData })
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getWeightLog(userId: string, limit = 30) {
  try {
    const { data, error } = await getClient()
      .from('weight_log')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit)
    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function saveWeight(userId: string, weight: number, date: string) {
  try {
    const { data, error } = await getClient()
      .from('weight_log')
      .upsert({ user_id: userId, weight, date })
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getWorkoutLogs(userId: string, limit = 20) {
  try {
    const { data, error } = await getClient()
      .from('workouts_log')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function logWorkout(userId: string, workoutData: Record<string, unknown>) {
  try {
    const { data, error } = await getClient()
      .from('workouts_log')
      .insert({ user_id: userId, ...workoutData })
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getStreak(userId: string) {
  try {
    const { data, error } = await getClient()
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateStreak(userId: string, streakData: Record<string, unknown>) {
  try {
    const { data, error } = await getClient()
      .from('streaks')
      .upsert({ user_id: userId, ...streakData })
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getSleepLogs(userId: string, limit = 14) {
  try {
    const { data, error } = await getClient()
      .from('sleep_log')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit)
    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function saveSleepLog(userId: string, sleepData: Record<string, unknown>) {
  try {
    const { data, error } = await getClient()
      .from('sleep_log')
      .upsert({ user_id: userId, ...sleepData })
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getMeasurements(userId: string) {
  try {
    const { data, error } = await getClient()
      .from('measurements_log')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(10)
    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function saveMeasurements(userId: string, measureData: Record<string, unknown>) {
  try {
    const { data, error } = await getClient()
      .from('measurements_log')
      .insert({ user_id: userId, ...measureData })
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
