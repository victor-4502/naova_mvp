import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { generatePredictions, analyzeMarketTrends, type PriceDataPoint } from '@/lib/prediction-models'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get('naova_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') || 'precios'
    const horizonte = searchParams.get('horizonte') || '3m'

    // Generar datos de ejemplo para predicciones
    const sampleData: PriceDataPoint[] = [
      { date: '2024-01-01', price: 2.85, quantity: 500, category: 'Tornillería' },
      { date: '2024-02-01', price: 2.90, quantity: 750, category: 'Tornillería' },
      { date: '2024-03-01', price: 2.95, quantity: 600, category: 'Tornillería' },
      { date: '2024-04-01', price: 3.05, quantity: 800, category: 'Tornillería' },
      { date: '2024-05-01', price: 3.15, quantity: 650, category: 'Tornillería' },
      { date: '2024-06-01', price: 3.20, quantity: 700, category: 'Tornillería' }
    ]

    // Generar predicciones usando los modelos
    const pricePrediction = generatePredictions(sampleData, 'price')
    const demandPrediction = generatePredictions(sampleData, 'demand')
    const marketTrends = analyzeMarketTrends(sampleData)

    // Datos simulados para desarrollo
    const predicciones = {
      tipo: tipo,
      horizonte: horizonte,
      confianza: 78,
      ultimaActualizacion: new Date().toISOString(),
      predicciones: {
        precios: [
          {
            producto: 'Tornillos M8',
            precioActual: 3.20,
            prediccion1Mes: ('predictedPrice' in pricePrediction) ? pricePrediction.predictedPrice : 3.20,
            prediccion3Meses: ('nextPrediction' in pricePrediction) ? pricePrediction.nextPrediction || 3.35 : 3.35,
            prediccion6Meses: 3.50,
            tendencia: ('trend' in pricePrediction) ? (pricePrediction.trend === 'ascending' ? 'ascendente' : 
                     pricePrediction.trend === 'descending' ? 'descendente' : 'estable') : 'estable',
            confianza: ('confidence' in pricePrediction) ? Math.round(pricePrediction.confidence * 100) : 75,
            factores: ('factors' in pricePrediction) ? pricePrediction.factors : []
          },
          {
            producto: 'Varillas Acero',
            precioActual: 85.50,
            prediccion1Mes: 87.20,
            prediccion3Meses: 89.80,
            prediccion6Meses: 92.50,
            tendencia: 'ascendente',
            confianza: 75,
            factores: ['Precio internacional acero', 'Demanda construcción']
          },
          {
            producto: 'Tuercas M8',
            precioActual: 2.80,
            prediccion1Mes: 2.75,
            prediccion3Meses: 2.70,
            prediccion6Meses: 2.65,
            tendencia: 'descendente',
            confianza: 68,
            factores: ['Competencia', 'Eficiencia producción']
          }
        ],
        demanda: [
          {
            categoria: 'Tornillería',
            demandaActual: 1500,
            prediccion1Mes: 1650,
            prediccion3Meses: 1800,
            prediccion6Meses: 1950,
            estacionalidad: 'alta',
            confianza: 85
          },
          {
            categoria: 'Acero',
            demandaActual: 200,
            prediccion1Mes: 180,
            prediccion3Meses: 160,
            prediccion6Meses: 140,
            estacionalidad: 'baja',
            confianza: 72
          }
        ],
        ahorro: [
          {
            estrategia: 'Compra anticipada',
            ahorroEstimado: 12.5,
            confianza: 80,
            recomendacion: 'Comprar en los próximos 15 días'
          },
          {
            estrategia: 'Volumen consolidado',
            ahorroEstimado: 8.3,
            confianza: 75,
            recomendacion: 'Agrupar compras de múltiples categorías'
          },
          {
            estrategia: 'Proveedor alternativo',
            ahorroEstimado: 6.7,
            confianza: 70,
            recomendacion: 'Evaluar Materiales ABC para tornillería'
          }
        ]
      },
      insights: [
        {
          tipo: 'alerta',
          mensaje: 'Precios del acero subirán 8% en los próximos 3 meses',
          severidad: 'alta',
          accion: 'Considerar compra anticipada'
        },
        {
          tipo: 'oportunidad',
          mensaje: 'Demanda de tornillería aumentará 20% en verano',
          severidad: 'media',
          accion: 'Preparar inventario'
        },
        {
          tipo: 'recomendacion',
          mensaje: 'Tuercas M8 bajarán de precio, esperar 2 meses',
          severidad: 'baja',
          accion: 'Posponer compra'
        }
      ],
      metodologia: {
        algoritmo: 'Regresión lineal con factores estacionales',
        datosHistoricos: '12 meses',
        factoresConsiderados: ['Precios históricos', 'Estacionalidad', 'Inflación', 'Demanda'],
        precision: '78% promedio'
      }
    }

    return NextResponse.json(predicciones)
  } catch (error) {
    console.error('Error en predicciones:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
