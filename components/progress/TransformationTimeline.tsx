'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

interface Milestone {
  week: number
  title: string
  description: string
  completed: boolean
}

interface TransformationTimelineProps {
  startDate: string
  totalWeeks: number
  currentWeek: number
}

function getMilestones(totalWeeks: number): Milestone[] {
  return [
    {
      week: 1,
      title: 'The Beginning',
      description: 'Foundation habits established. Body adapts to new stimulus.',
      completed: false,
    },
    {
      week: Math.round(totalWeeks * 0.25),
      title: 'First Signs of Change',
      description: 'Clothes start fitting differently. Energy levels up.',
      completed: false,
    },
    {
      week: Math.round(totalWeeks * 0.5),
      title: 'Halfway Warrior',
      description: 'Visible body composition change. Strength PR incoming.',
      completed: false,
    },
    {
      week: Math.round(totalWeeks * 0.75),
      title: 'Almost There',
      description: 'Definition visible. Discipline is your superpower now.',
      completed: false,
    },
    {
      week: totalWeeks,
      title: 'Transformation Complete',
      description: 'You\'ve become the person you decided to be.',
      completed: false,
    },
  ].map(m => ({ ...m, completed: m.week <= 0 }))
}

export function TransformationTimeline({ startDate, totalWeeks, currentWeek }: TransformationTimelineProps) {
  const milestones = getMilestones(totalWeeks).map(m => ({
    ...m,
    completed: m.week <= currentWeek,
  }))

  return (
    <div className="space-y-0">
      {milestones.map((milestone, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={milestone.completed ? 'text-gold' : 'text-white/20'}
            >
              {milestone.completed
                ? <CheckCircle2 size={20} className="fill-gold/20" />
                : <Circle size={20} />
              }
            </motion.div>
            {i < milestones.length - 1 && (
              <div className={`w-0.5 flex-1 my-1 ${milestone.completed ? 'bg-gold/40' : 'bg-white/5'}`} />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.1 }}
            className="pb-5 flex-1"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-xs font-bold ${milestone.completed ? 'text-gold' : 'text-[#555]'}`}>
                Week {milestone.week}
              </span>
              {milestone.week === currentWeek && (
                <span className="text-[10px] bg-gold/10 text-gold border border-gold/20 rounded-full px-2 py-0.5">
                  You are here
                </span>
              )}
            </div>
            <h4 className={`text-sm font-bold mb-0.5 ${milestone.completed ? 'text-[#F5F5F5]' : 'text-[#555]'}`}>
              {milestone.title}
            </h4>
            <p className={`text-xs leading-relaxed ${milestone.completed ? 'text-[#888]' : 'text-[#444]'}`}>
              {milestone.description}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  )
}
