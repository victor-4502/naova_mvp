'use client'

import { formatRelativeTime } from '@/lib/utils/formatting'
import { AlertCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PipelineCardProps {
  request: {
    id: string
    title: string
    category?: string
    urgency: string
    createdAt: Date
    clientName: string
  }
  onMove: (newStage: string) => void
}

export default function PipelineCard({ request }: PipelineCardProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border p-4 cursor-move hover:shadow-md transition-shadow',
        getUrgencyColor(request.urgency)
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm">{request.title}</h4>
        {request.urgency === 'urgent' && (
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
        )}
      </div>

      {request.category && (
        <p className="text-xs text-gray-600 mb-2">#{request.category}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{request.clientName}</span>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatRelativeTime(request.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

