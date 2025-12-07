/**
 * Script para diagnosticar por qué un request no generó mensaje automático
 * 
 * Uso: tsx scripts/diagnosticar-request.ts [requestId]
 * Si no se proporciona requestId, se muestra el más reciente
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function diagnosticarRequest(requestId?: string) {
  try {
    // Obtener el request
    let request
    if (requestId) {
      request = await prisma.request.findUnique({
        where: { id: requestId },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
          },
          client: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      })
    } else {
      // Obtener el más reciente
      request = await prisma.request.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
          },
          client: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      })
    }

    if (!request) {
      console.error('❌ No se encontró el request')
      process.exit(1)
    }

    console.log('\n' + '='.repeat(80))
    console.log('🔍 DIAGNÓSTICO DE REQUEST')
    console.log('='.repeat(80))
    console.log(`\n📋 Request ID: ${request.id}`)
    console.log(`📅 Creado: ${request.createdAt.toLocaleString()}`)
    console.log(`📨 Source: ${request.source}`)
    console.log(`📊 Status: ${request.status}`)
    console.log(`🔄 Pipeline Stage: ${request.pipelineStage}`)
    console.log(`📦 Categoría: ${request.category || 'N/A'}`)
    console.log(`⚡ Urgencia: ${request.urgency}`)
    console.log(`👤 Cliente: ${request.client?.name || request.client?.email || 'Sin cliente'}`)
    console.log(`\n💬 Mensajes (${request.messages.length}):`)
    request.messages.forEach((msg, idx) => {
      console.log(
        `  ${idx + 1}. [${msg.direction}] ${msg.source} - ${msg.createdAt.toLocaleString()}`
      )
      console.log(`     Contenido: ${msg.content.substring(0, 80)}...`)
    })

    // Analizar normalizedContent
    console.log('\n' + '-'.repeat(80))
    console.log('📝 ANÁLISIS DE CONTENIDO NORMALIZADO')
    console.log('-'.repeat(80))

    let normalized: any = request.normalizedContent
    if (typeof normalized === 'string') {
      try {
        normalized = JSON.parse(normalized)
      } catch (e) {
        console.error('❌ Error al parsear normalizedContent como JSON:', e)
        normalized = {}
      }
    }

    // Definir variables fuera del bloque condicional para que estén disponibles después
    const outboundMessages = request.messages.filter((m) => m.direction === 'outbound')
    let missingFields: string[] = []
    let normalizedRules: any = null

    if (!normalized || Object.keys(normalized).length === 0) {
      console.log('⚠️  normalizedContent está vacío o es null')
    } else {
      console.log('✅ normalizedContent existe')

      const rules = normalized.rules || {}
      normalizedRules = rules
      missingFields = rules.missingFields || []
      
      console.log('\n📋 REGLAS:')
      console.log(`  • categoryRuleId: ${rules.categoryRuleId || 'N/A'}`)
      console.log(`  • autoReplyEnabled: ${rules.autoReplyEnabled ?? true} (default: true)`)
      console.log(`  • completeness: ${rules.completeness ?? 'N/A'}`)
      console.log(
        `  • presentFields: ${rules.presentFields ? JSON.stringify(rules.presentFields) : 'N/A'}`
      )
      console.log(
        `  • missingFields: ${rules.missingFields ? JSON.stringify(rules.missingFields) : 'N/A'}`
      )

      // Diagnosticar por qué no se generó mensaje automático
      console.log('\n' + '-'.repeat(80))
      console.log('🔎 DIAGNÓSTICO: ¿Por qué NO se generó mensaje automático?')
      console.log('-'.repeat(80))

      const autoReplyEnabled = typeof rules.autoReplyEnabled === 'boolean' ? rules.autoReplyEnabled : true
      const categoryRuleId = rules.categoryRuleId
      const completeness = rules.completeness

      if (!autoReplyEnabled) {
        console.log('❌ RAZÓN: autoReplyEnabled está en false')
        console.log('   → El auto-reply está deshabilitado para este request')
      } else if (!categoryRuleId) {
        console.log('❌ RAZÓN: No se identificó una categoría (categoryRuleId es null/undefined)')
        console.log('   → El sistema no pudo determinar qué tipo de requerimiento es')
        console.log('   → Revisa si el contenido tiene palabras clave reconocidas')
      } else if (!missingFields || missingFields.length === 0) {
        console.log('✅ RAZÓN: No hay campos faltantes')
        console.log('   → El request está completo, no necesita información adicional')
        console.log(`   → Completitud: ${completeness ?? 'N/A'}`)
      } else {
        console.log('⚠️  RAZÓN DESCONOCIDA: Tiene todos los elementos pero no se generó mensaje')
        console.log('   → categoryRuleId:', categoryRuleId)
        console.log('   → missingFields:', JSON.stringify(missingFields))
        console.log('   → Revisa los logs del servidor al momento de crear el request')
      }

      // Verificar si hay mensaje outbound pendiente
      const processedOutbound = outboundMessages.filter((m) => m.processed)

      if (outboundMessages.length > 0) {
        console.log('\n✅ HAY MENSAJES OUTBOUND:')
        console.log(`   • Total: ${outboundMessages.length}`)
        console.log(`   • Procesados: ${processedOutbound.length}`)
        console.log(`   • Pendientes: ${outboundMessages.length - processedOutbound.length}`)
      } else {
        console.log('\n❌ NO HAY MENSAJES OUTBOUND')
        console.log('   → No se generó ningún mensaje de respuesta automática')
      }
    }

    console.log('\n' + '='.repeat(80))
    console.log('📋 CONTENIDO ORIGINAL:')
    console.log('='.repeat(80))
    console.log(request.rawContent)
    console.log('\n')

    // Sugerencias
    console.log('\n💡 SUGERENCIAS:')
    if (!normalized || !normalizedRules || !normalizedRules.categoryRuleId) {
      console.log('   • Agrega más palabras clave relacionadas con categorías en el contenido')
      console.log('   • Revisa CATEGORY_MAPPINGS en lib/utils/constants.ts')
    }
    if (outboundMessages.length === 0 && missingFields && missingFields.length > 0) {
      console.log('   • El mensaje debería haberse generado pero no se creó')
      console.log('   • Revisa los logs del servidor durante la creación del request')
      console.log('   • Verifica que AutoReplyService.maybeSendAutoReply se llamó correctamente')
    }

    console.log('\n')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar
const requestId = process.argv[2]
diagnosticarRequest(requestId)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error fatal:', error)
    process.exit(1)
  })

