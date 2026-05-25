'use client'

import { BottomNav } from '@/components/ui/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col bg-bg relative">
      <main className="flex-1 overflow-hidden pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
