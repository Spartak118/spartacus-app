'use client'

import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import type { WeightEntry } from '@/types'

interface WeightChartProps {
  data: WeightEntry[]
  targetWeight?: number
  startWeight?: number
  unit?: string
}

export function WeightChart({ data, targetWeight, startWeight, unit = 'kg' }: WeightChartProps) {
  const chartData = data.slice().reverse().map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight,
  }))

  const minWeight = Math.min(...data.map(d => d.weight)) - 2
  const maxWeight = Math.max(...data.map(d => d.weight)) + 2

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-[#888] text-sm">No weight data yet</p>
          <p className="text-[#555] text-xs mt-1">Log your weight to see progress</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C8A96E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C8A96E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#555', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minWeight, maxWeight]}
            tick={{ fill: '#555', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(200,169,110,0.3)',
              borderRadius: '12px',
              color: '#F5F5F5',
            }}
            formatter={(value) => [`${value} ${unit}`, 'Weight']}
            labelStyle={{ color: '#888', fontSize: 11 }}
          />
          {targetWeight && (
            <ReferenceLine
              y={targetWeight}
              stroke="#C8A96E"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: `Goal: ${targetWeight}${unit}`, fill: '#C8A96E', fontSize: 10, position: 'right' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#C8A96E"
            strokeWidth={2.5}
            dot={{ fill: '#C8A96E', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#E8C98E', stroke: '#C8A96E', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
