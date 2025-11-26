import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { appStore } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticaci+¦n
    const token = request.cookies.get('naova_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Obtener datos del cliente autenticado
    const clientId = payload.userId

    // Obtener datos reales del store
    const allTenders = appStore.getTenders()
    const clientTenders = allTenders.filter(tender => tender.clientId === clientId)
    
    // Calcular m+¬tricas reales
    const totalCompras = clientTenders.length
    const licitacionesActivas = clientTenders.filter(t => t.status === 'active').length
    const licitacionesCerradas = clientTenders.filter(t => t.status === 'closed').length
    const licitacionesSeleccionadas = clientTenders.filter(t => t.status === 'selected').length
    
    console.log(`Cliente ${clientId}:`, {
      totalCompras,
      licitacionesActivas,
      licitacionesCerradas,
      licitacionesSeleccionadas
    })
    
    // Calcular monto total y ahorro
    let montoTotal = 0
    let ahorroTotal = 0
    const proveedoresUnicos = new Set<string>()
    
    // Incluir licitaciones cerradas, seleccionadas y activas con ofertas
    const licitacionesConOfertas = clientTenders.filter(t => 
      (t.status === 'closed' || t.status === 'selected' || t.status === 'active') && t.offers.length > 0
    )
    
    console.log('Licitaciones con ofertas:', licitacionesConOfertas.length)
    
    licitacionesConOfertas.forEach(tender => {
      // Buscar la oferta aceptada (seleccionada/cerrada) o la mejor oferta
      const acceptedOffer = tender.offers.find(offer => offer.status === 'accepted')
      const bestOffer = acceptedOffer || tender.offers.reduce((best, current) => 
        (current.totalAmount || 0) < (best.totalAmount || 0) ? current : best
      )
      
      montoTotal += bestOffer.totalAmount || 0
      
      console.log(`Tender ${tender.id}: monto ${bestOffer.totalAmount}`)
      
      // Calcular ahorro (diferencia entre oferta m+ís cara y la seleccionada)
      if (tender.offers.length > 1) {
        const mostExpensive = tender.offers.reduce((max, current) => 
          (current.totalAmount || 0) > (max.totalAmount || 0) ? current : max
        )
        const ahorro = (mostExpensive.totalAmount || 0) - (bestOffer.totalAmount || 0)
        ahorroTotal += ahorro
        console.log(`Ahorro en ${tender.id}: ${ahorro}`)
      }
      
      // Contar proveedores +¦nicos
      tender.offers.forEach(offer => {
        if (offer.provider?.name) {
          proveedoresUnicos.add(offer.provider.name)
        }
      })
    })
    
    console.log('Total calculado:', { montoTotal, ahorroTotal, proveedoresUnicos: proveedoresUnicos.size })
    
    // Generar datos por mes (+¦ltimos 6 meses)
    const comprasPorMes = []
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
    for (let i = 0; i < 6; i++) {
      const fecha = new Date()
      fecha.setMonth(fecha.getMonth() - i)
      const mesTenders = clientTenders.filter(t => {
        const tenderDate = new Date(t.createdAt)
        return tenderDate.getMonth() === fecha.getMonth() && tenderDate.getFullYear() === fecha.getFullYear()
      })
      
      const cantidad = mesTenders.length
      const monto = mesTenders.reduce((sum, t) => {
        if (t.offers.length > 0) {
          const bestOffer = t.offers.reduce((best, current) => 
            (current.totalAmount || 0) < (best.totalAmount || 0) ? current : best
          )
          return sum + (bestOffer.totalAmount || 0)
        }
        return sum
      }, 0)
      
      comprasPorMes.unshift({
        mes: meses[fecha.getMonth()],
        cantidad,
        monto: Math.round(monto),
        ahorro: Math.round(monto * 0.12) // 12% de ahorro estimado
      })
    }
    
    // Productos m+ís frecuentes (solo de licitaciones con ofertas)
    const productosFrecuentes = new Map<string, {cantidad: number, monto: number, frecuencia: number}>()
    licitacionesConOfertas.forEach(tender => {
      tender.products.forEach(product => {
        const key = product.name
        if (productosFrecuentes.has(key)) {
          const existing = productosFrecuentes.get(key)!
          existing.cantidad += product.quantity
          existing.frecuencia += 1
          existing.monto += product.budget * product.quantity
        } else {
          productosFrecuentes.set(key, {
            cantidad: product.quantity,
            monto: product.budget * product.quantity,
            frecuencia: 1
          })
        }
      })
    })
    
    const comprasPorProducto = Array.from(productosFrecuentes.entries())
      .map(([producto, data]) => ({
        producto,
        cantidad: data.cantidad,
        monto: Math.round(data.monto),
        frecuencia: data.frecuencia
      }))
      .sort((a, b) => b.frecuencia - a.frecuencia)
      .slice(0, 5)
    
    // Proveedores m+ís frecuentes (solo de licitaciones con ofertas)
    const proveedoresFrecuentes = new Map<string, {monto: number, participacion: number, calificacion: number}>()
    licitacionesConOfertas.forEach(tender => {
      tender.offers.forEach(offer => {
        if (offer.provider?.name) {
          const key = offer.provider.name
          if (proveedoresFrecuentes.has(key)) {
            const existing = proveedoresFrecuentes.get(key)!
            existing.monto += offer.totalAmount || 0
          } else {
            proveedoresFrecuentes.set(key, {
              monto: offer.totalAmount || 0,
              participacion: 0,
              calificacion: offer.provider.rating || 4.0
            })
          }
        }
      })
    })
    
    // Calcular participaci+¦n porcentual
    const totalMontoProveedores = Array.from(proveedoresFrecuentes.values())
      .reduce((sum, p) => sum + p.monto, 0)
    
    const comprasPorProveedor = Array.from(proveedoresFrecuentes.entries())
      .map(([proveedor, data]) => ({
        proveedor,
        monto: Math.round(data.monto),
        participacion: totalMontoProveedores > 0 ? Math.round((data.monto / totalMontoProveedores) * 100) : 0,
        calificacion: data.calificacion
      }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 3)
    
    const comprasPorCliente = {
      cliente: {
        id: clientId,
        nombre: payload.name || 'Cliente',
        email: payload.email
      },
      resumen: {
        totalCompras,
        montoTotal: Math.round(montoTotal),
        ahorroTotal: Math.round(ahorroTotal),
        licitacionesActivas,
        proveedoresFrecuentes: proveedoresUnicos.size
      },
      comprasPorMes,
      comprasPorProducto,
      comprasPorProveedor,
      tendencias: {
        crecimientoMensual: totalCompras > 0 ? Math.round((licitacionesActivas / totalCompras) * 100) : 0,
        ahorroPromedio: montoTotal > 0 ? Math.round((ahorroTotal / montoTotal) * 100) : 0,
        frecuenciaCompra: totalCompras > 0 ? Math.round(180 / totalCompras) : 0, // d+¡as promedio
        proximaCompraEstimada: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    }

    return NextResponse.json(comprasPorCliente)
  } catch (error) {
    console.error('Error en comprasPorCliente:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
