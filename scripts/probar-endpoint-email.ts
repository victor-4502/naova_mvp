/**
 * Script para probar manualmente el endpoint de email
 * Esto ayuda a verificar que el endpoint funciona correctamente
 */

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://www.naova.com.mx/api/inbox/webhook/email'

async function probarEndpoint() {
  console.log('🧪 Probando endpoint de email webhook...\n')
  console.log(`📍 URL: ${WEBHOOK_URL}\n`)

  const testPayload = {
    from: {
      email: 'test@example.com',
      name: 'Test User'
    },
    to: ['test@naova.mx'],
    subject: 'Test email desde script',
    text: 'Este es un email de prueba enviado manualmente desde el script de diagnóstico.',
    html: '<p>Este es un email de prueba enviado manualmente desde el script de diagnóstico.</p>',
    messageId: `test-${Date.now()}`,
    timestamp: new Date().toISOString()
  }

  try {
    console.log('📤 Enviando payload...')
    console.log(JSON.stringify(testPayload, null, 2))
    console.log('\n')

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    })

    const responseText = await response.text()
    let responseData
    
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = responseText
    }

    console.log(`📥 Status: ${response.status} ${response.statusText}`)
    console.log('\n📥 Response:')
    console.log(JSON.stringify(responseData, null, 2))

    if (response.ok) {
      console.log('\n✅ Endpoint funcionando correctamente!')
      if (responseData.requestId) {
        console.log(`✅ Request creado: ${responseData.requestId}`)
      }
    } else {
      console.log('\n❌ El endpoint respondió con error')
      console.log('Revisa los logs de Vercel para más detalles')
    }
  } catch (error) {
    console.error('\n❌ Error al probar endpoint:')
    console.error(error)
    console.log('\n💡 Verifica que:')
    console.log('  - La URL sea correcta')
    console.log('  - El endpoint esté desplegado en Vercel')
    console.log('  - No haya problemas de red')
  }
}

probarEndpoint()

