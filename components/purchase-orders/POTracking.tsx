'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDateTime } from '@/lib/utils/formatting'
import { CheckCircle, Clock, Package, Truck, DollarSign } from 'lucide-react'

interface POTrackingProps {
  poId: string
}

export default function POTracking({ poId }: POTrackingProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['po-tracking', poId],
    queryFn: async () => {
      const response = await fetch(`/api/purchase-orders/${poId}/timeline`)
      if (!response.ok) throw new Error('Error al obtener tracking')
      return response.json()
    },
  })

  if (isLoading) {
    return <div className="text-center py-8">Cargando tracking...</div>
  }

  if (!data?.tracking) {
    return <div className="text-center py-8 text-gray-500">No hay información de tracking</div>
  }

  const { timeline, currentStatus, nextStatus } = data.tracking

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved_by_client':
      case 'purchase_order_created':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'payment_pending':
      case 'payment_received':
        return <DollarSign className="h-5 w-5 text-blue-500" />
      case 'supplier_confirmed':
      case 'in_transit':
        return <Truck className="h-5 w-5 text-orange-500" />
      case 'delivered':
        return <Package className="h-5 w-5 text-purple-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Estado Actual</h3>
        <div className="flex items-center gap-3">
          {getStatusIcon(currentStatus)}
          <div>
            <p className="font-medium">{currentStatus.replace(/_/g, ' ')}</p>
            {nextStatus && (
              <p className="text-sm text-gray-500">
                Siguiente: {nextStatus.replace(/_/g, ' ')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Timeline</h3>
        <div className="space-y-4">
          {timeline.map((event: any, index: number) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                {getStatusIcon(event.status)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{event.description}</p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(event.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

