'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUserStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <>{children}</>
}
