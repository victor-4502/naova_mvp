/**
 * Script para diagnosticar errores al enviar mensajes
 */

import { prisma } from '@/lib/prisma'

async function diagnosticar() {
  const requestId = process.argv[2]
  
  if (!requestId) {
    console.log('❌ Uso: npx tsx scripts/diagnosticar-mensaje-error.ts <requestId>')
    console.log('')
    console.log('Ejemplo:')
    console.log('  npx tsx scripts/diagnosticar-mensaje-error.ts cmiw1ornm0000aeob9nli93e2')
    process.exit(1)
  }
  
  console.log(`🔍 Diagnosticando request: ${requestId}\n`)
  
  try {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })
    
    if (!request) {
      console.log('❌ Request no encontrado')
      process.exit(1)
    }
    
    console.log('📋 Información del Request:')
    console.log(`   ID: ${request.id}`)
    console.log(`   Source: ${request.source}`)
    console.log(`   Cliente: ${request.client ? request.client.email : 'Sin cliente'}`)
    console.log(`   Total mensajes: ${request.messages.length}\n`)
    
    console.log('📱 Mensajes:')
    request.messages.forEach((msg, index) => {
      console.log(`\n   ${index + 1}. Mensaje ${msg.direction}:`)
      console.log(`      ID: ${msg.id}`)
      console.log(`      Source: ${msg.source}`)
      console.log(`      From: ${msg.from || 'N/A'}`)
      console.log(`      To: ${msg.to || 'N/A'}`)
      console.log(`      Contenido: ${msg.content.substring(0, 50)}...`)
      console.log(`      Creado: ${msg.createdAt.toLocaleString()}`)
    })
    
    // Analizar el problema
    console.log('\n🔍 ANÁLISIS:\n')
    
    const lastInbound = request.messages.find(m => m.direction === 'inbound')
    
    if (!lastInbound) {
      console.log('❌ No se encontró ningún mensaje entrante')
    } else {
      if (request.source === 'whatsapp') {
        if (!lastInbound.from) {
          console.log('❌ PROBLEMA: El mensaje entrante no tiene campo "from"')
          console.log('   Esto impide obtener el número de teléfono para responder')
        } else {
          console.log(`✅ Número encontrado: ${lastInbound.from}`)
          console.log(`   Este número se usará para enviar la respuesta`)
        }
      }
    }
    
    if (!request.client && request.source === 'whatsapp') {
      console.log('\n⚠️  ADVERTENCIA: Request sin cliente asignado')
      console.log('   El mensaje se puede enviar usando el número del mensaje original')
      console.log('   Pero sería mejor asignar un cliente al request')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

diagnosticar()

