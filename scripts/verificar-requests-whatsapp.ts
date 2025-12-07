/**
 * Script para verificar requests recientes de WhatsApp
 */

import { prisma } from '@/lib/prisma'

async function verificarRequests() {
  try {
    console.log('🔍 Buscando requests recientes de WhatsApp...\n')

    // Buscar los últimos 10 requests de WhatsApp
    const requests = await prisma.request.findMany({
      where: {
        source: 'whatsapp',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    console.log(`📊 Total de requests encontrados: ${requests.length}\n`)

    if (requests.length === 0) {
      console.log('⚠️  No se encontraron requests de WhatsApp')
      console.log('\nPosibles causas:')
      console.log('  1. El webhook no está recibiendo mensajes')
      console.log('  2. Hay un error al procesar los mensajes')
      console.log('  3. Los mensajes no se están guardando en la BD\n')
    } else {
      console.log('✅ Requests encontrados:\n')
      requests.forEach((req, index) => {
        console.log(`${index + 1}. Request ID: ${req.id}`)
        console.log(`   Contenido: ${req.rawContent.substring(0, 50)}...`)
        console.log(`   Cliente: ${req.client?.name || req.client?.email || 'Sin cliente'}`)
        console.log(`   Estado: ${req.status}`)
        console.log(`   Creado: ${req.createdAt.toLocaleString()}`)
        console.log(`   Mensajes: ${req.messages.length}`)
        if (req.messages.length > 0) {
          console.log(`   Último mensaje: ${req.messages[0].content.substring(0, 50)}...`)
        }
        console.log('')
      })
    }

    // También verificar mensajes directamente
    console.log('\n📱 Verificando mensajes de WhatsApp directamente...\n')
    const messages = await prisma.message.findMany({
      where: {
        source: 'whatsapp',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    console.log(`📊 Total de mensajes encontrados: ${messages.length}\n`)
    if (messages.length > 0) {
      messages.forEach((msg, index) => {
        console.log(`${index + 1}. Mensaje ID: ${msg.id}`)
        console.log(`   Contenido: ${msg.content.substring(0, 50)}...`)
        console.log(`   De: ${msg.from || 'N/A'}`)
        console.log(`   Para: ${msg.to || 'N/A'}`)
        console.log(`   Creado: ${msg.createdAt.toLocaleString()}`)
        console.log(`   Request ID: ${msg.requestId || 'Sin request'}`)
        console.log('')
      })
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verificarRequests()

