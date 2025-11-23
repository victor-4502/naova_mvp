// Custom Hook para Requests con React Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRequestStore } from '@/lib/stores/requestStore'

export function useRequests() {
  const queryClient = useQueryClient()
  const { setRequests, setLoading, setError } = useRequestStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await fetch('/api/requests')
      if (!response.ok) throw new Error('Error al obtener requests')
      const data = await response.json()
      setRequests(data.requests)
      return data.requests
    },
  })

  return {
    requests: data || [],
    isLoading,
    error,
  }
}

export function useRequest(requestId: string) {
  const queryClient = useQueryClient()
  const { setSelectedRequest } = useRequestStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['request', requestId],
    queryFn: async () => {
      const response = await fetch(`/api/requests/${requestId}`)
      if (!response.ok) throw new Error('Error al obtener request')
      const data = await response.json()
      setSelectedRequest(data.request)
      return data.request
    },
    enabled: !!requestId,
  })

  return {
    request: data,
    isLoading,
    error,
  }
}

export function useCreateRequest() {
  const queryClient = useQueryClient()
  const { addRequest } = useRequestStore()

  return useMutation({
    mutationFn: async (input: {
      source: string
      content: string
      attachments?: any[]
      metadata?: Record<string, any>
    }) => {
      const response = await fetch('/api/inbox/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) throw new Error('Error al crear request')
      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
      if (data.request) {
        addRequest(data.request)
      }
    },
  })
}

