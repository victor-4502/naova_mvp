/**
 * Script para probar la verificación del webhook de WhatsApp
 * Simula lo que Meta hace cuando verifica el webhook
 */

async function probarVerificacion() {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'naova_verify_token_secreto'
  const webhookUrl = 'https://www.naova.com.mx/api/inbox/webhook/whatsapp'
  
  console.log('🧪 Probando verificación del webhook...\n')
  console.log(`URL: ${webhookUrl}`)
  console.log(`Verify Token: ${verifyToken}\n`)
  
  // Simular la petición GET que Meta hace
  const challenge = 'test_challenge_12345'
  const testUrl = `${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=${challenge}`
  
  console.log(`📡 Enviando GET request a: ${testUrl}\n`)
  
  try {
    const response = await fetch(testUrl)
    const text = await response.text()
    
    console.log(`📋 Respuesta del servidor:`)
    console.log(`   Status: ${response.status}`)
    console.log(`   Content-Type: ${response.headers.get('content-type')}`)
    console.log(`   Body: ${text}\n`)
    
    if (response.status === 200 && text === challenge) {
      console.log('✅ ¡Webhook verificado correctamente!')
      console.log('   El servidor respondió con el challenge, como Meta espera.\n')
    } else {
      console.log('❌ La verificación falló')
      console.log(`   Esperado: ${challenge}`)
      console.log(`   Recibido: ${text}\n`)
    }
  } catch (error) {
    console.error('❌ Error al probar el webhook:', error)
    console.log('\n⚠️  Posibles causas:')
    console.log('   1. El servidor no está accesible')
    console.log('   2. La URL es incorrecta')
    console.log('   3. Hay un error en el código del webhook\n')
  }
}

probarVerificacion()

