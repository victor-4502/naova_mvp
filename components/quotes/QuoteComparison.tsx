'use client'

import { useQuery } from '@tanstack/react-query'
import { formatCurrency } from '@/lib/utils/formatting'
import { Trophy, Package, Clock, DollarSign } from 'lucide-react'

interface QuoteComparisonProps {
  rfqId: string
}

export default function QuoteComparison({ rfqId }: QuoteComparisonProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['quote-comparison', rfqId],
    queryFn: async () => {
      const response = await fetch(`/api/rfqs/${rfqId}/quotes/compare`)
      if (!response.ok) throw new Error('Error al comparar cotizaciones')
      return response.json()
    },
  })

  if (isLoading) {
    return <div className="text-center py-8">Cargando comparación...</div>
  }

  if (!data?.comparison || data.comparison.quotes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay cotizaciones para comparar
      </div>
    )
  }

  const { quotes, scores, bestQuote, summary } = data.comparison

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Resumen de Comparación</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Cotizaciones</p>
            <p className="text-2xl font-bold">{summary.totalQuotes}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rango de Precio</p>
            <p className="text-lg font-semibold">
              {formatCurrency(summary.priceRange.min)} -{' '}
              {formatCurrency(summary.priceRange.max)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rango de Entrega</p>
            <p className="text-lg font-semibold">
              {summary.deliveryRange.min} - {summary.deliveryRange.max} días
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Precio Promedio</p>
            <p className="text-lg font-semibold">
              {formatCurrency(summary.averagePrice)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de Comparación */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Proveedor
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Entrega
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Ranking
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quotes.map((quote: any, index: number) => {
                const score = scores.find((s: any) => s.quoteId === quote.quoteId)
                const isBest = bestQuote?.quoteId === quote.quoteId

                return (
                  <tr
                    key={quote.quoteId}
                    className={isBest ? 'bg-green-50' : ''}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isBest && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className="font-medium">
                          {quote.supplierName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(quote.normalizedTotal)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {quote.deliveryDays} días
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${score?.totalScore || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(score?.totalScore || 0)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">
                        #{index + 1}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

