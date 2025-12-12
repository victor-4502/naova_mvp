import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admins / operadores
    if (user.role !== 'admin_naova' && user.role !== 'operator_naova') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener parámetro de ordenamiento
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'recent_activity'

    // Verificar que la tabla Request existe y obtener requests
    try {
      // Determinar el ordenamiento según el parámetro
      let orderBy: any = { createdAt: 'desc' } // Default
      
      if (sortBy === 'recent_activity') {
        orderBy = { updatedAt: 'desc' } // Por última actividad
      } else if (sortBy === 'oldest') {
        orderBy = { createdAt: 'asc' } // Más antiguos primero
      } else if (sortBy === 'newest') {
        orderBy = { createdAt: 'desc' } // Más nuevos primero
      }

      const requests = await prisma.request.findMany({
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 3, // Últimos 3 mensajes para previsualización
            select: {
              id: true,
              direction: true,
              content: true,
              subject: true,
              source: true,
              createdAt: true,
              from: true,
              to: true,
            },
          },
        },
        orderBy,
        take: 100,
      })

      return NextResponse.json(
        {
          requests: requests.map((r) => {
            const normalized = (r.normalizedContent as any) || {}
            const rules = normalized.rules || null

            return {
              id: r.id,
              source: r.source,
              clientId: r.clientId,
              status: r.status,
              pipelineStage: r.pipelineStage,
              rawContent: r.rawContent,
              category: r.category,
              urgency: r.urgency,
              createdAt: r.createdAt.toISOString(),
              updatedAt: r.updatedAt.toISOString(),
              client: r.client,
              rules,
              messages: r.messages.map((m) => ({
                id: m.id,
                direction: m.direction,
                content: m.content,
                subject: m.subject,
                source: m.source,
                createdAt: m.createdAt.toISOString(),
                from: m.from,
                to: m.to,
              })),
            }
          }),
        },
        { status: 200 }
      )
    } catch (dbError) {
      console.error('Error en consulta a base de datos:', dbError)
      const dbErrorMessage = dbError instanceof Error ? dbError.message : 'Error desconocido en BD'
      const dbErrorStack = dbError instanceof Error ? dbError.stack : undefined
      
      // Log completo del error para diagnóstico
      console.error('Error completo:', {
        message: dbErrorMessage,
        stack: dbErrorStack,
        error: dbError
      })
      
      // Si es un error de tabla no existe
      if (dbErrorMessage.includes('does not exist') || dbErrorMessage.includes('relation') || dbErrorMessage.includes('table')) {
        return NextResponse.json(
          { 
            error: 'La tabla Request no existe. Ejecuta las migraciones de base de datos en Supabase.',
            details: process.env.NODE_ENV === 'development' ? dbErrorMessage : undefined,
            hint: 'Verifica que DATABASE_URL apunte al proyecto correcto de Supabase. Revisa los logs del servidor para el error completo.'
          },
          { status: 500 }
        )
      }
      
      throw dbError
    }
  } catch (error) {
    console.error('Error al obtener requests (admin):', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error details:', { errorMessage, errorStack })
    
    return NextResponse.json(
      { 
        error: 'Error al obtener requests',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
