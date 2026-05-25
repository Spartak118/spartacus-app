'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/store/userStore'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { setUserId, setProfile, onboardingComplete } = useUserStore()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        setUserId(currentUser?.id ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN' && currentUser) {
          if (!onboardingComplete) {
            router.push('/onboarding')
          } else {
            router.push('/dashboard')
          }
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null)
          router.push('/login')
        }
      }
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setUserId(session?.user?.id ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  return { user, loading }
}
