'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface ReportCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconColor?: string
  children: React.ReactNode
  className?: string
  loading?: boolean
}

export default function ReportCard({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-500',
  children,
  className = '',
  loading = false
}: ReportCardProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${className}`}
      >
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            {Icon && <div className="h-6 w-6 bg-gray-200 rounded mr-3"></div>}
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          {description && <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>}
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${className}`}
    >
      <div className="flex items-center mb-4">
        {Icon && (
          <div className={`p-2 rounded-lg bg-gray-50 ${iconColor} mr-3`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        {children}
      </div>
    </motion.div>
  )
}
