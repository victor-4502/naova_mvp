'use client'

import { formatRelativeTime } from '@/lib/utils/formatting'
import type { RequestWithDetails } from '@/lib/services/inbox/InboxService'
import { MessageSquare, Paperclip, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface RequestCardProps {
  request: RequestWithDetails
  isSelected?: boolean
  onClick?: () => void
}

export default function RequestCard({
  request,
  isSelected,
  onClick,
}: RequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new_request':
        return 'bg-blue-100 text-blue-800'
      case 'incomplete_information':
        return 'bg-yellow-100 text-yellow-800'
      case 'ready_for_supplier_matching':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'normal':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md',
        isSelected && 'border-primary shadow-md'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-900">
              {request.source.toUpperCase()}
            </span>
            <span
              className={cn(
                'px-2 py-1 rounded text-xs font-medium',
                getStatusColor(request.status)
              )}
            >
              {request.status.replace(/_/g, ' ')}
            </span>
            <span
              className={cn(
                'px-2 py-1 rounded text-xs font-medium',
                getUrgencyColor(request.urgency)
              )}
            >
              {request.urgency}
            </span>
          </div>
          {request.category && (
            <span className="text-sm text-gray-600">#{request.category}</span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {formatRelativeTime(request.createdAt)}
        </span>
      </div>

      <p className="text-sm text-gray-700 line-clamp-2 mb-3">
        {request.rawContent}
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        {request.messages.length > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{request.messages.length}</span>
          </div>
        )}
        {request.attachments.length > 0 && (
          <div className="flex items-center gap-1">
            <Paperclip className="h-4 w-4" />
            <span>{request.attachments.length}</span>
          </div>
        )}
        {request.status === 'incomplete_information' && (
          <div className="flex items-center gap-1 text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            <span>Falta información</span>
          </div>
        )}
        {request.status === 'ready_for_supplier_matching' && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Listo para procesar</span>
          </div>
        )}
      </div>
    </div>
  )
}

