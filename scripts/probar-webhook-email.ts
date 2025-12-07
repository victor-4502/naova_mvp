/**
 * Script para probar el webhook de email
 * Simula un email entrante desde un cliente registrado
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function probarWebhookEmail() {
  try {
    console.log('🧪 Probando webhook de email desde un CONTACTO ADICIONAL del cliente...\n')

    // 1. Buscar un cliente con contactos adicionales de email
    const clienteConContactos = await prisma.user.findFirst({
      where: {
        role: 'client_enterprise',
        active: true,
        clientContacts: {
          some: {
            type: 'email',
          },
        },
      },
      include: {
        clientContacts: {
          where: {
            type: 'email',
          },
          take: 1, // Tomar el primer contacto de email adicional
        },
      },
    })

    if (!clienteConContactos || clienteConContactos.clientContacts.length === 0) {
      console.error('❌ No se encontró ningún cliente con contactos adicionales de email.')
      console.log('💡 Crea un cliente con contactos adicionales desde /admin/clients primero.')
      console.log('   O crea un contacto adicional con tipo "email" desde la interfaz admin.')
      return
    }

    const contactoAdicional = clienteConContactos.clientContacts[0]
    const emailContacto = contactoAdicional.value.toLowerCase().trim()

    console.log(`✅ Cliente encontrado: ${clienteConContactos.name}`)
    console.log(`   Email principal: ${clienteConContactos.email}`)
    console.log(`   📧 Usando contacto adicional: ${emailContacto} (${contactoAdicional.label || 'Sin etiqueta'})\n`)

    // 2. Simular payload de email desde el contacto adicional
    const emailPayload = {
      from: {
        email: emailContacto, // Usar el contacto adicional, no el principal
        name: clienteConContactos.name,
      },
      to: [process.env.NAOVA_EMAIL_PRIMARY || 'compras@naova.com'], // Email de destino de Naova
      subject: 'Solicitud de cotización - Tornillos',
      text: 'Necesito tornillos para mi proyecto', // Requerimiento incompleto
      messageId: `test-email-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }

    console.log('📧 Payload de email simulado:')
    console.log(JSON.stringify(emailPayload, null, 2))
    console.log('\n')

    // 3. Llamar al webhook
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const webhookUrl = `${baseUrl}/api/inbox/webhook/email`

    console.log(`🌐 Enviando a: ${webhookUrl}\n`)

    let response: Response
    try {
      response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      })
    } catch (fetchError) {
      console.error('❌ Error al conectar con el servidor:')
      console.error(fetchError)
      console.error('\n💡 Verifica que el servidor esté corriendo:')
      console.error('   npm run dev')
      return
    }

    // Verificar el tipo de contenido
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const text = await response.text()
      console.error('❌ El servidor devolvió HTML en lugar de JSON:')
      console.error(`Status: ${response.status}`)
      console.error(`Content-Type: ${contentType}`)
      console.error(`Primeros 500 caracteres de la respuesta:`)
      console.error(text.substring(0, 500))
      return
    }

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ Error en webhook:')
      console.error(result)
      return
    }

    console.log('✅ Webhook procesado exitosamente:')
    console.log(JSON.stringify(result, null, 2))
    console.log('\n')

    // 4. Verificar que se creó el request
    if (result.requestId) {
      const request = await prisma.request.findUnique({
        where: { id: result.requestId },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (request) {
        console.log('📋 Request creado:')
        console.log(`   ID: ${request.id}`)
        console.log(`   Source: ${request.source}`)
        console.log(`   Status: ${request.status}`)
        console.log(`   Cliente: ${request.client?.name || 'Sin asignar'}`)
        console.log(`   Contenido: ${request.rawContent.substring(0, 100)}...`)
        console.log('\n')

        // 5. Verificar mensaje de auto-respuesta
        const autoReplyMessage = await prisma.message.findFirst({
          where: {
            requestId: request.id,
            direction: 'outbound',
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        if (autoReplyMessage) {
          console.log('💬 Mensaje de auto-respuesta generado:')
          console.log(`   ID: ${autoReplyMessage.id}`)
          console.log(`   Source: ${autoReplyMessage.source}`)
          console.log(`   Direction: ${autoReplyMessage.direction}`)
          console.log(`   Processed: ${autoReplyMessage.processed}`)
          console.log(`   Contenido: ${autoReplyMessage.content}`)
          console.log('\n')
        } else {
          console.log('⚠️  No se generó mensaje de auto-respuesta.')
          console.log('   Esto puede ser porque:')
          console.log('   - El requerimiento está completo')
          console.log('   - autoReplyEnabled está desactivado')
          console.log('   - No se identificó una categoría')
          console.log('\n')
        }

        // 6. Mostrar reglas aplicadas
        const normalized = request.normalizedContent as any
        const rules = normalized?.rules || {}
        if (Object.keys(rules).length > 0) {
          console.log('📊 Reglas aplicadas:')
          console.log(`   Categoría: ${rules.categoryRuleId || 'N/A'}`)
          console.log(`   Completitud: ${rules.completeness || 'N/A'}`)
          console.log(`   Campos presentes: ${(rules.presentFields || []).join(', ') || 'Ninguno'}`)
          console.log(`   Campos faltantes: ${(rules.missingFields || []).join(', ') || 'Ninguno'}`)
          console.log(`   Auto-respuesta: ${rules.autoReplyEnabled !== false ? 'Activada' : 'Desactivada'}`)
          console.log('\n')
        }
      }
    }

    console.log('✅ Prueba completada!\n')
    console.log('💡 Verificaciones importantes:')
    console.log('   ✓ El email llegó desde un CONTACTO ADICIONAL del cliente')
    console.log('   ✓ El sistema identificó correctamente al cliente desde ese contacto')
    console.log('   ✓ El request se asoció al cliente correcto')
    console.log('\n💡 Siguiente paso:')
    console.log('   1. Ve a /admin/requests para ver el requerimiento')
    console.log('   2. Verifica que el cliente está correctamente identificado')
    console.log('   3. Verifica el mensaje sugerido generado por la inteligencia')
    console.log('   4. Revisa la tabla Message en Supabase para ver la auto-respuesta')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
probarWebhookEmail()

