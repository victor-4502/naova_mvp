/**
 * Script de prueba para WhatsApp
 * 
 * Uso:
 *   npm run test:whatsapp -- <numero> <mensaje>
 *   
 * Ejemplo:
 *   npm run test:whatsapp -- 523312283639 "Hola, este es un mensaje de prueba"
 */

// Cargar variables de entorno desde .env o .env.local
import { config } from 'dotenv'
import { resolve } from 'path'

// Intentar cargar .env.local primero, luego .env
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

import { WhatsAppService } from '@/lib/services/whatsapp/WhatsAppService'

async function testWhatsApp() {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.log('❌ Uso: npm run test:whatsapp -- <numero> [mensaje]')
    console.log('')
    console.log('Ejemplos:')
    console.log('  npm run test:whatsapp -- 523312283639')
    console.log('  npm run test:whatsapp -- 523312283639 "Hola desde Naova"')
    console.log('')
    process.exit(1)
  }

  const phoneNumber = args[0]
  const message = args[1] || 'Hola, este es un mensaje de prueba desde Naova'

  console.log('🧪 Probando integración de WhatsApp...\n')
  console.log(`📱 Número destino: ${phoneNumber}`)
  console.log(`💬 Mensaje: ${message}\n`)

  // Verificar variables de entorno
  console.log('🔍 Verificando configuración...')
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId) {
    console.error('❌ Error: WHATSAPP_PHONE_NUMBER_ID no está configurado')
    console.log('   Agrega esta variable a tu archivo .env.local')
    process.exit(1)
  }

  if (!accessToken) {
    console.error('❌ Error: WHATSAPP_ACCESS_TOKEN no está configurado')
    console.log('   Agrega esta variable a tu archivo .env.local')
    process.exit(1)
  }

  console.log(`✅ Phone Number ID: ${phoneNumberId}`)
  console.log(`✅ Access Token: ${accessToken.substring(0, 20)}...`)
  console.log('')

  // Probar envío de mensaje
  console.log('📤 Intentando enviar mensaje de texto libre...\n')

  try {
    const result = await WhatsAppService.sendTextMessage({
      to: phoneNumber,
      message,
    })

    if (result.success) {
      console.log('✅ Mensaje enviado exitosamente!')
      console.log(`   Message ID: ${result.messageId}\n`)
    } else {
      console.log('⚠️  El mensaje de texto libre falló')
      console.log(`   Error: ${result.error}\n`)

      // Intentar con template como fallback
      console.log('📤 Intentando con template (hello_world)...\n')

      const templateResult = await WhatsAppService.sendTemplateMessage({
        to: phoneNumber,
        templateName: 'hello_world',
        languageCode: 'es',
      })

      if (templateResult.success) {
        console.log('✅ Template enviado exitosamente!')
        console.log(`   Message ID: ${templateResult.messageId}\n`)
      } else {
        console.error('❌ Error enviando template:')
        console.error(`   ${templateResult.error}\n`)
      }
    }
  } catch (error) {
    console.error('❌ Error inesperado:')
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }

  console.log('✨ Prueba completada!')
}

testWhatsApp()

