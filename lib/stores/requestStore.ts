// Zustand Store para Requests

import { create } from 'zustand'
import type { RequestWithDetails } from '@/lib/services/inbox/InboxService'

interface RequestStore {
  requests: RequestWithDetails[]
  selectedRequest: RequestWithDetails | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setRequests: (requests: RequestWithDetails[]) => void
  addRequest: (request: RequestWithDetails) => void
  updateRequest: (id: string, updates: Partial<RequestWithDetails>) => void
  setSelectedRequest: (request: RequestWithDetails | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  selectedRequest: null,
  isLoading: false,
  error: null,
  
  setRequests: (requests) => set({ requests }),
  
  addRequest: (request) =>
    set((state) => ({
      requests: [request, ...state.requests],
    })),
  
  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, ...updates } : req
      ),
      selectedRequest:
        state.selectedRequest?.id === id
          ? { ...state.selectedRequest, ...updates }
          : state.selectedRequest,
    })),
  
  setSelectedRequest: (request) => set({ selectedRequest: request }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}))

