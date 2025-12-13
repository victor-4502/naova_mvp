/**
 * Script para limpiar todos los requests y mensajes de prueba
 * 
 * ⚠️ ADVERTENCIA: Este script elimina TODOS los requests y mensajes de la base de datos.
 * Solo úsalo para limpiar datos de prueba antes de producción.
 * 
 * Uso:
 *   npm run limpiar:requests
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function limpiarRequests() {
  console.log('🧹 Iniciando limpieza de requests y mensajes...\n')

  try {
    // Contar antes de eliminar
    const countRequests = await prisma.request.count()
    const countMessages = await prisma.message.count()
    const countAttachments = await prisma.attachment.count()

    console.log('📊 Estado actual:')
    console.log(`   - Requests: ${countRequests}`)
    console.log(`   - Messages: ${countMessages}`)
    console.log(`   - Attachments: ${countAttachments}\n`)

    if (countRequests === 0 && countMessages === 0) {
      console.log('✅ No hay datos para limpiar. La base de datos ya está vacía.\n')
      return
    }

    // Confirmar antes de eliminar (en producción, descomentar esto)
    // console.log('⚠️  ADVERTENCIA: Esto eliminará TODOS los requests y mensajes.')
    // console.log('Presiona Ctrl+C para cancelar, o Enter para continuar...')
    // await new Promise(resolve => setTimeout(resolve, 5000))

    console.log('🗑️  Eliminando datos...\n')

    // Eliminar attachments primero (dependencia de Message)
    const deletedAttachments = await prisma.attachment.deleteMany({})
    console.log(`   ✅ Attachments eliminados: ${deletedAttachments.count}`)

    // Eliminar messages (dependencia de Request)
    const deletedMessages = await prisma.message.deleteMany({})
    console.log(`   ✅ Messages eliminados: ${deletedMessages.count}`)

    // Eliminar requests
    const deletedRequests = await prisma.request.deleteMany({})
    console.log(`   ✅ Requests eliminados: ${deletedRequests.count}\n`)

    // Verificar estado final
    const finalCountRequests = await prisma.request.count()
    const finalCountMessages = await prisma.message.count()
    const finalCountAttachments = await prisma.attachment.count()

    console.log('📊 Estado final:')
    console.log(`   - Requests: ${finalCountRequests}`)
    console.log(`   - Messages: ${finalCountMessages}`)
    console.log(`   - Attachments: ${finalCountAttachments}\n`)

    console.log('✅ Limpieza completada exitosamente!\n')

  } catch (error) {
    console.error('❌ Error al limpiar:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
limpiarRequests()
  .then(() => {
    console.log('✨ Script finalizado.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })

