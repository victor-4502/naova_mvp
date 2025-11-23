'use client'

import PipelineCard from './PipelineCard'
import { formatRelativeTime } from '@/lib/utils/formatting'

interface PipelineColumnProps {
  column: {
    stage: string
    title: string
    requests: Array<{
      id: string
      title: string
      category?: string
      urgency: string
      createdAt: Date
      clientName: string
    }>
  }
  onMoveRequest: (requestId: string, newStage: string) => void
}

export default function PipelineColumn({
  column,
  onMoveRequest,
}: PipelineColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{column.title}</h3>
        <p className="text-sm text-gray-500">
          {column.requests.length} {column.requests.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="space-y-3">
        {column.requests.map((request) => (
          <PipelineCard
            key={request.id}
            request={request}
            onMove={(newStage) => onMoveRequest(request.id, newStage)}
          />
        ))}
      </div>
    </div>
  )
}

