'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface KPIWidgetProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  subtitle?: string
  loading?: boolean
}

export default function KPIWidget({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-blue-500',
  subtitle,
  loading = false
}: KPIWidgetProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getChangeIcon = () => {
    if (change === undefined) return null
    if (change > 0) return '↗'
    if (change < 0) return '↘'
    return '→'
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 bg-gray-200 rounded-lg mr-3"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 ml-3">{title}</h3>
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium ${getChangeColor()}`}>
            <span className="mr-1">{getChangeIcon()}</span>
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}
