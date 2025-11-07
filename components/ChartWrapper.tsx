'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ChartWrapperProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  loading?: boolean
  height?: string
}

export default function ChartWrapper({
  title,
  description,
  children,
  className = '',
  loading = false,
  height = 'h-64'
}: ChartWrapperProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
          {description && <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>}
          <div className={`${height} bg-gray-200 rounded`}></div>
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
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      <div className={height}>
        {children}
      </div>
    </motion.div>
  )
}
