/**
 * Script para verificar qué contenido se guardó en un request de email
 */

import { prisma } from '../lib/prisma'

const REQUEST_ID = process.argv[2] || 'cmj0r636q00007ufewmtd61gr' // El último request creado según los logs

async function verificarContenido() {
  console.log('🔍 Verificando contenido del request:', REQUEST_ID, '\n')

  try {
    const request = await prisma.request.findUnique({
      where: { id: REQUEST_ID },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!request) {
      console.error('❌ Request no encontrado')
      return
    }

    console.log('📋 Información del Request:')
    console.log('  ID:', request.id)
    console.log('  Source:', request.source)
    console.log('  Raw Content:', request.rawContent?.substring(0, 200) || '(vacío)')
    console.log('  Raw Content Length:', request.rawContent?.length || 0)
    console.log('')

    console.log('📧 Mensajes asociados:')
    request.messages.forEach((msg, index) => {
      console.log(`\n  Mensaje ${index + 1}:`)
      console.log('    ID:', msg.id)
      console.log('    Source:', msg.source)
      console.log('    Direction:', msg.direction)
      console.log('    Subject:', msg.subject || '(sin subject)')
      console.log('    Content Length:', msg.content?.length || 0)
      console.log('    Content:', msg.content?.substring(0, 200) || '(vacío)')
      console.log('    From:', msg.from || '(sin from)')
      console.log('    SourceId:', msg.sourceId || '(sin sourceId)')
      console.log('    Created:', msg.createdAt.toISOString())
    })

    console.log('\n✅ Verificación completa')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verificarContenido()

