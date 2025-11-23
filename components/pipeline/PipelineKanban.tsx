'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PipelineColumn from './PipelineColumn'
import { Loader2 } from 'lucide-react'

export default function PipelineKanban() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['pipeline'],
    queryFn: async () => {
      const response = await fetch('/api/pipeline')
      if (!response.ok) throw new Error('Error al obtener pipeline')
      return response.json()
    },
  })

  const moveMutation = useMutation({
    mutationFn: async ({
      requestId,
      newStage,
    }: {
      requestId: string
      newStage: string
    }) => {
      const response = await fetch(`/api/pipeline/${requestId}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStage }),
      })
      if (!response.ok) throw new Error('Error al mover request')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline'] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data?.pipeline) {
    return <div className="text-center py-8">No hay datos del pipeline</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Control Tower</h1>
        <p className="text-sm text-gray-600">
          Total: {data.pipeline.totalRequests} requests
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {data.pipeline.columns.map((column: any) => (
          <PipelineColumn
            key={column.stage}
            column={column}
            onMoveRequest={(requestId, newStage) =>
              moveMutation.mutate({ requestId, newStage })
            }
          />
        ))}
      </div>
    </div>
  )
}

