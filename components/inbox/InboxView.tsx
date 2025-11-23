'use client'

import { useRequests } from '@/lib/hooks/useRequests'
import { useRequestStore } from '@/lib/stores/requestStore'
import RequestCard from './RequestCard'
import { Inbox, Loader2 } from 'lucide-react'

export default function InboxView() {
  const { requests, isLoading } = useRequests()
  const { selectedRequest, setSelectedRequest } = useRequestStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Inbox className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900">Inbox Inteligente</h1>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay requests en el inbox</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              isSelected={selectedRequest?.id === request.id}
              onClick={() => setSelectedRequest(request)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

