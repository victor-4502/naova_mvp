import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { appStore } from '@/lib/store'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticaci├│n
    const token = request.cookies.get('naova_token')?.value || request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inv├ílido' }, { status: 401 })
    }

    // Obtener par├ímetros de consulta
    const { searchParams } = new URL(request.url)
    const productName = searchParams.get('productName')
    const providerId = searchParams.get('providerId')
    const clientId = payload.role === 'client_enterprise' ? payload.userId : searchParams.get('clientId')

    // Obtener hist├│rico de precios
    let priceHistory = appStore.getPriceHistory()

    // Filtrar por cliente si es client_enterprise
    if (payload.role === 'client_enterprise') {
      priceHistory = priceHistory.filter(p => p.clientId === clientId)
    } else if (clientId) {
      priceHistory = priceHistory.filter(p => p.clientId === clientId)
    }

    // Filtrar por producto
    if (productName) {
      priceHistory = priceHistory.filter(p => 
        p.productName.toLowerCase().includes(productName.toLowerCase())
      )
    }

    // Filtrar por proveedor
    if (providerId) {
      priceHistory = priceHistory.filter(p => p.providerId === providerId)
    }

    // Ordenar por fecha (m├ís reciente primero)
    priceHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Agrupar por producto para an├ílisis
    const productGroups = new Map<string, any[]>()
    priceHistory.forEach(entry => {
      if (!productGroups.has(entry.productName)) {
        productGroups.set(entry.productName, [])
      }
      productGroups.get(entry.productName)!.push(entry)
    })

    // Calcular estad├¡sticas por producto
    const productStats = Array.from(productGroups.entries()).map(([productName, entries]) => {
      const prices = entries.map(e => e.unitPrice)
      const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const lastPrice = entries[0].unitPrice
      const priceChange = entries.length > 1 
        ? ((lastPrice - entries[entries.length - 1].unitPrice) / entries[entries.length - 1].unitPrice) * 100
        : 0

      return {
        productName,
        category: entries[0].productCategory,
        avgPrice: Math.round(avgPrice * 100) / 100,
        minPrice,
        maxPrice,
        lastPrice,
        priceChange: Math.round(priceChange * 100) / 100,
        entries: entries.length,
        providers: new Set(entries.map(e => e.providerName)).size,
        history: entries.map(e => ({
          date: e.date,
          price: e.unitPrice,
          provider: e.providerName,
          tenderId: e.tenderId,
          tenderTitle: e.tenderTitle
        }))
      }
    })

    // Ordenar por n├║mero de entradas (productos m├ís frecuentes)
    productStats.sort((a, b) => b.entries - a.entries)

    return NextResponse.json({
      totalEntries: priceHistory.length,
      products: productStats.length,
      data: productStats
    })
  } catch (error) {
    console.error('Error en preciosHistoricos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
