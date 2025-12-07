/**
 * Script para verificar templates de WhatsApp disponibles
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env') })

async function verificarTemplates() {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !accessToken) {
    console.error('❌ Faltan variables de entorno')
    process.exit(1)
  }

  console.log('🔍 Verificando templates disponibles...\n')

  try {
    const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/message_templates`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Error:', data)
      return
    }

    if (data.data && data.data.length > 0) {
      console.log('✅ Templates disponibles:\n')
      data.data.forEach((t: any) => {
        console.log(`   - ${t.name} (${t.language})`)
        console.log(`     Status: ${t.status}`)
        console.log(`     Category: ${t.category}\n`)
      })
    } else {
      console.log('⚠️  No hay templates aprobados.')
      console.log('\n📋 Para crear un template:')
      console.log('   1. Ve a: https://business.facebook.com/')
      console.log('   2. WhatsApp > Message Templates')
      console.log('   3. Crea un nuevo template')
      console.log('   4. Espera a que sea aprobado\n')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

verificarTemplates()

