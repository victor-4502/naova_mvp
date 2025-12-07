/**
 * Script para verificar el token de WhatsApp directamente con Meta
 * 
 * Uso: tsx scripts/verificar-token-whatsapp.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

async function verificarToken() {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  console.log('\n🔍 VERIFICANDO TOKEN DE WHATSAPP\n')
  console.log('='.repeat(80))

  if (!phoneNumberId) {
    console.error('❌ WHATSAPP_PHONE_NUMBER_ID no está configurado')
    process.exit(1)
  }

  if (!accessToken) {
    console.error('❌ WHATSAPP_ACCESS_TOKEN no está configurado')
    process.exit(1)
  }

  console.log(`📱 Phone Number ID: ${phoneNumberId}`)
  console.log(`🔑 Access Token: ${accessToken.substring(0, 30)}...`)
  console.log(`   Longitud total: ${accessToken.length} caracteres\n`)

  // Verificar el token usando la API de debug de Meta
  console.log('📡 Verificando token con Meta API...\n')

  try {
    // Primero, intentar verificar usando el endpoint de debug
    const debugUrl = `https://graph.facebook.com/v22.0/debug_token?input_token=${accessToken}&access_token=${accessToken}`
    
    const debugResponse = await fetch(debugUrl)
    const debugData = await debugResponse.json()

    console.log('📋 RESULTADO DE VERIFICACIÓN:')
    console.log('-'.repeat(80))
    
    if (debugData.data) {
      const tokenInfo = debugData.data
      
      console.log(`✅ Token válido: ${tokenInfo.is_valid ? 'SÍ' : 'NO'}`)
      console.log(`📱 App ID: ${tokenInfo.app_id || 'N/A'}`)
      console.log(`👤 User ID: ${tokenInfo.user_id || 'N/A'}`)
      
      if (tokenInfo.expires_at) {
        const expiresDate = new Date(tokenInfo.expires_at * 1000)
        console.log(`⏰ Expira: ${expiresDate.toLocaleString()}`)
      } else {
        console.log(`⏰ Expira: Nunca (permanente)`)
      }
      
      console.log(`📋 Scopes: ${tokenInfo.scopes?.join(', ') || 'N/A'}`)
      
      if (!tokenInfo.is_valid) {
        console.log(`\n❌ ERROR: ${debugData.data.error?.message || 'Token inválido'}`)
      }
    } else {
      console.log('❌ No se pudo obtener información del token')
      console.log('Respuesta:', JSON.stringify(debugData, null, 2))
    }

    // Intentar hacer una llamada de prueba (solo verificar permisos, no enviar mensaje)
    console.log('\n📡 Probando acceso a la API de WhatsApp...\n')
    
    const testUrl = `https://graph.facebook.com/v22.0/${phoneNumberId}?access_token=${accessToken}`
    const testResponse = await fetch(testUrl)
    const testData = await testResponse.json()

    if (testResponse.ok) {
      console.log('✅ Acceso a Phone Number ID: OK')
      console.log(`   Número: ${testData.display_phone_number || 'N/A'}`)
      console.log(`   Verificado: ${testData.verified_name || 'N/A'}`)
    } else {
      console.log('❌ Error al acceder al Phone Number ID:')
      console.log(JSON.stringify(testData, null, 2))
    }

  } catch (error) {
    console.error('❌ Error al verificar token:', error)
    console.error(error instanceof Error ? error.stack : '')
  }

  console.log('\n' + '='.repeat(80))
  console.log('✨ Verificación completada!\n')
}

verificarToken()

