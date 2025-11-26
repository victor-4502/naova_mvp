import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticaci├│n
    const token = request.cookies.get('naova_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Datos simulados para desarrollo
    const resumenGlobal = {
      periodo: {
        inicio: '2024-01-01',
        fin: '2024-05-31',
        meses: 5
      },
      kpis: {
        totalLicitaciones: 45,
        licitacionesActivas: 12,
        licitacionesCerradas: 33,
        clientesActivos: 8,
        proveedoresActivos: 15,
        montoTotalTransacciones: 250000,
        ahorroTotalGenerado: 35000,
        ahorroPromedio: 14.0
      },
      tendencias: {
        crecimientoLicitaciones: 25.5,
        crecimientoClientes: 12.0,
        crecimientoProveedores: 8.0,
        tendenciaAhorro: 18.2
      },
      distribucionPorCliente: [
        { cliente: 'Industrias ABC', licitaciones: 12, monto: 85000, ahorro: 12000 },
        { cliente: 'Construcciones XYZ', licitaciones: 8, monto: 65000, ahorro: 9500 },
        { cliente: 'Metal├║rgica 123', licitaciones: 6, monto: 45000, ahorro: 6800 },
        { cliente: 'F├íbrica DEF', licitaciones: 4, monto: 35000, ahorro: 5200 },
        { cliente: 'Taller GHI', licitaciones: 3, monto: 20000, ahorro: 1500 }
      ],
      distribucionPorCategoria: [
        { categoria: 'Torniller├¡a', licitaciones: 18, monto: 120000, participacion: 48 },
        { categoria: 'Acero', licitaciones: 12, monto: 85000, participacion: 34 },
        { categoria: 'Herramientas', licitaciones: 8, monto: 30000, participacion: 12 },
        { categoria: 'Equipos', licitaciones: 7, monto: 15000, participacion: 6 }
      ],
      topProveedores: [
        { proveedor: 'Ferreter├¡a Central', licitaciones: 18, monto: 85000, tasaExito: 66.7 },
        { proveedor: 'Aceros del Norte', licitaciones: 15, monto: 72000, tasaExito: 53.3 },
        { proveedor: 'Materiales ABC', licitaciones: 20, monto: 68000, tasaExito: 50.0 }
      ],
      metricasTemporales: {
        licitacionesPorMes: [
          { mes: 'Enero', licitaciones: 8, monto: 45000 },
          { mes: 'Febrero', licitaciones: 10, monto: 52000 },
          { mes: 'Marzo', licitaciones: 12, monto: 68000 },
          { mes: 'Abril', licitaciones: 9, monto: 55000 },
          { mes: 'Mayo', licitaciones: 6, monto: 30000 }
        ],
        ahorroPorMes: [
          { mes: 'Enero', ahorro: 6500, porcentaje: 14.4 },
          { mes: 'Febrero', ahorro: 7200, porcentaje: 13.8 },
          { mes: 'Marzo', ahorro: 9800, porcentaje: 14.4 },
          { mes: 'Abril', ahorro: 7800, porcentaje: 14.2 },
          { mes: 'Mayo', ahorro: 3700, porcentaje: 12.3 }
        ]
      },
      alertas: [
        {
          tipo: 'precio',
          mensaje: 'Precios del acero subieron 8% en mayo. Considerar compra anticipada.',
          severidad: 'media',
          fecha: '2024-05-25'
        },
        {
          tipo: 'proveedor',
          mensaje: 'Materiales ABC redujo participaci├│n en 15%. Revisar relaci├│n comercial.',
          severidad: 'baja',
          fecha: '2024-05-20'
        },
        {
          tipo: 'cliente',
          mensaje: 'Industrias ABC aument├│ frecuencia de compras 25%. Cliente prioritario.',
          severidad: 'baja',
          fecha: '2024-05-22'
        }
      ],
      predicciones: {
        proximoMes: {
          licitacionesEsperadas: 8,
          montoEsperado: 45000,
          ahorroEsperado: 6500
        },
        proximos3Meses: {
          licitacionesEsperadas: 25,
          montoEsperado: 140000,
          ahorroEsperado: 20000
        }
      }
    }

    return NextResponse.json(resumenGlobal)
  } catch (error) {
    console.error('Error en resumenGlobal:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
