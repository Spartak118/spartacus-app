'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  label?: string
  sublabel?: string
  className?: string
  animate?: boolean
}

export function ProgressRing({
  value, max, size = 120, strokeWidth = 8,
  color = '#C8A96E', bgColor = 'rgba(255,255,255,0.06)',
  label, sublabel, className, animate = true,
}: ProgressRingProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percent = Math.min(100, Math.max(0, (displayValue / max) * 100))
  const dashOffset = circumference - (percent / 100) * circumference

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value)
      return
    }
    const start = Date.now()
    const duration = 1500
    const startVal = 0
    const endVal = value

    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(startVal + (endVal - startVal) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [value, animate])

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      {(label || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label && <span className="text-lg font-black text-[#F5F5F5] leading-none">{label}</span>}
          {sublabel && <span className="text-xs text-[#888] mt-0.5">{sublabel}</span>}
        </div>
      )}
    </div>
  )
}
