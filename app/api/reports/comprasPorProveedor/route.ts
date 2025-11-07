import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get('naova_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Datos simulados para desarrollo
    const comprasPorProveedor = {
      resumen: {
        totalProveedores: 15,
        proveedoresActivos: 12,
        montoTotalTransacciones: 250000,
        licitacionesTotales: 45
      },
      rankingProveedores: [
        {
          id: 'prov-001',
          nombre: 'Ferretería Central',
          montoTotal: 85000,
          licitacionesParticipadas: 18,
          licitacionesGanadas: 12,
          tasaExito: 66.7,
          precioPromedio: 4500,
          calificacion: 4.5,
          ultimaActividad: '2024-05-20',
          especialidades: ['Tornillería', 'Herramientas']
        },
        {
          id: 'prov-002',
          nombre: 'Aceros del Norte',
          montoTotal: 72000,
          licitacionesParticipadas: 15,
          licitacionesGanadas: 8,
          tasaExito: 53.3,
          precioPromedio: 4800,
          calificacion: 4.2,
          ultimaActividad: '2024-05-18',
          especialidades: ['Acero', 'Estructuras']
        },
        {
          id: 'prov-003',
          nombre: 'Materiales ABC',
          montoTotal: 68000,
          licitacionesParticipadas: 20,
          licitacionesGanadas: 10,
          tasaExito: 50.0,
          precioPromedio: 4200,
          calificacion: 4.0,
          ultimaActividad: '2024-05-15',
          especialidades: ['Materiales', 'Construcción']
        },
        {
          id: 'prov-004',
          nombre: 'Suministros Industriales',
          montoTotal: 55000,
          licitacionesParticipadas: 12,
          licitacionesGanadas: 7,
          tasaExito: 58.3,
          precioPromedio: 5200,
          calificacion: 4.3,
          ultimaActividad: '2024-05-22',
          especialidades: ['Equipos', 'Mantenimiento']
        },
        {
          id: 'prov-005',
          nombre: 'Proveedor Premium',
          montoTotal: 45000,
          licitacionesParticipadas: 8,
          licitacionesGanadas: 6,
          tasaExito: 75.0,
          precioPromedio: 6800,
          calificacion: 4.8,
          ultimaActividad: '2024-05-25',
          especialidades: ['Alta Calidad', 'Especializado']
        }
      ],
      metricasPorCategoria: [
        {
          categoria: 'Tornillería',
          proveedores: 5,
          montoTotal: 120000,
          precioPromedio: 2500,
          crecimiento: 8.5
        },
        {
          categoria: 'Acero',
          proveedores: 4,
          montoTotal: 95000,
          precioPromedio: 8500,
          crecimiento: 12.3
        },
        {
          categoria: 'Herramientas',
          proveedores: 6,
          montoTotal: 35000,
          precioPromedio: 1200,
          crecimiento: -2.1
        }
      ],
      tendencias: {
        nuevosProveedores: 3,
        proveedoresInactivos: 1,
        crecimientoPromedio: 15.2,
        competenciaPromedio: 4.2
      }
    }

    return NextResponse.json(comprasPorProveedor)
  } catch (error) {
    console.error('Error en comprasPorProveedor:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
