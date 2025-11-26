import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get('naova_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria') || 'todas'
    const prioridad = searchParams.get('prioridad') || 'alta'

    // Datos simulados para desarrollo
    const recomendaciones = {
      cliente: {
        id: payload.userId,
        nombre: payload.name || 'Cliente',
        patronCompra: 'regular',
        frecuenciaPromedio: 18, // días
        ultimaCompra: '2024-05-15'
      },
      recomendaciones: [
        {
          id: 'rec-001',
          tipo: 'compra_anticipada',
          prioridad: 'alta',
          titulo: 'Compra anticipada recomendada',
          descripcion: 'Basado en tu historial, compras tornillos cada 18 días. Tu próxima compra estimada es el 2 de junio.',
          producto: 'Tornillos M8',
          ahorroEstimado: 15.5,
          confianza: 85,
          fechaRecomendada: '2024-06-02',
          razon: 'Precios subirán 8% en junio según tendencias históricas',
          accion: 'Crear licitación antes del 30 de mayo'
        },
        {
          id: 'rec-002',
          tipo: 'volumen_consolidado',
          prioridad: 'media',
          titulo: 'Consolidar compras para mayor ahorro',
          descripcion: 'Agrupa tus compras de tornillería para obtener descuentos por volumen.',
          productos: ['Tornillos M8', 'Tuercas M8', 'Arandelas M8'],
          ahorroEstimado: 8.3,
          confianza: 78,
          fechaRecomendada: '2024-06-10',
          razon: 'Descuento del 5% en compras superiores a $10,000',
          accion: 'Crear licitación consolidada'
        },
        {
          id: 'rec-003',
          tipo: 'proveedor_alternativo',
          prioridad: 'baja',
          titulo: 'Evaluar proveedor alternativo',
          descripcion: 'Materiales ABC ofrece precios más estables para varillas de acero.',
          producto: 'Varillas Acero',
          ahorroEstimado: 6.7,
          confianza: 72,
          fechaRecomendada: '2024-06-15',
          razon: 'Precio 6% menor con misma calidad',
          accion: 'Incluir en próxima licitación'
        },
        {
          id: 'rec-004',
          tipo: 'estacional',
          prioridad: 'media',
          titulo: 'Aprovechar temporada baja',
          descripcion: 'Los precios del acero bajan en diciembre. Considera compra estacional.',
          producto: 'Acero estructural',
          ahorroEstimado: 12.0,
          confianza: 80,
          fechaRecomendada: '2024-12-01',
          razon: 'Reducción estacional del 12% en invierno',
          accion: 'Planificar compra para diciembre'
        },
        {
          id: 'rec-005',
          tipo: 'frecuencia',
          prioridad: 'baja',
          titulo: 'Optimizar frecuencia de compras',
          descripcion: 'Tu patrón de compra es muy regular. Considera compras más grandes con menor frecuencia.',
          ahorroEstimado: 5.2,
          confianza: 65,
          fechaRecomendada: '2024-06-20',
          razon: 'Reducción de costos de transacción',
          accion: 'Aumentar cantidad por compra'
        }
      ],
      patrones: {
        frecuenciaCompra: {
          actual: 18,
          optima: 25,
          variacion: 7
        },
        estacionalidad: {
          temporadaAlta: ['Marzo', 'Abril', 'Mayo'],
          temporadaBaja: ['Diciembre', 'Enero'],
          factorEstacional: 1.15
        },
        categoriasFrecuentes: [
          { categoria: 'Tornillería', frecuencia: 8, ultimaCompra: '2024-05-10' },
          { categoria: 'Acero', frecuencia: 3, ultimaCompra: '2024-04-20' },
          { categoria: 'Herramientas', frecuencia: 2, ultimaCompra: '2024-03-15' }
        ]
      },
      alertas: [
        {
          tipo: 'precio',
          mensaje: 'Precio del acero subió 5% esta semana',
          severidad: 'media',
          accion: 'Revisar proveedores alternativos'
        },
        {
          tipo: 'inventario',
          mensaje: 'Tienes 15 días de inventario de tornillos',
          severidad: 'baja',
          accion: 'Planificar próxima compra'
        }
      ],
      estadisticas: {
        recomendacionesActivas: 5,
        ahorroPotencial: 47.7,
        recomendacionesImplementadas: 12,
        ahorroRealizado: 28.5,
        tasaImplementacion: 65
      }
    }

    return NextResponse.json(recomendaciones)
  } catch (error) {
    console.error('Error en recomendaciones:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
