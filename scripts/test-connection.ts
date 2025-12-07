/**
 * Script para probar la conexión a la base de datos
 * y verificar que la tabla Request existe
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...\n')
    
    // Mostrar DATABASE_URL (sin contraseña)
    const dbUrl = process.env.DATABASE_URL || 'NO CONFIGURADO'
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@')
    console.log('📝 DATABASE_URL:', maskedUrl)
    console.log('')
    
    // Intentar consultar la tabla Request
    console.log('1️⃣ Intentando consultar la tabla Request...')
    try {
      const count = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::int as count FROM "Request"
      `
      console.log('   ✅ Tabla Request existe!')
      console.log(`   📊 Total de requests: ${count[0]?.count || 0}\n`)
    } catch (tableError) {
      console.error('   ❌ Error al consultar Request:', tableError)
      if (tableError instanceof Error) {
        console.error('   Mensaje:', tableError.message)
        if (tableError.message.includes('does not exist') || tableError.message.includes('relation')) {
          console.error('   ⚠️  La tabla Request NO existe en esta base de datos')
          console.error('   💡 Verifica que estés conectado al proyecto correcto de Supabase\n')
        }
      }
    }
    
    // Verificar columnas de la tabla Request
    console.log('2️⃣ Verificando columnas de la tabla Request...')
    try {
      const columns = await prisma.$queryRaw<Array<{ column_name: string, data_type: string }>>`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Request'
        ORDER BY ordinal_position
      `
      
      if (columns.length > 0) {
        console.log('   ✅ Columnas encontradas:')
        columns.forEach(col => {
          console.log(`      - ${col.column_name} (${col.data_type})`)
        })
        
        // Verificar si tiene normalizedContent
        const hasNormalized = columns.some(col => col.column_name === 'normalizedContent')
        if (!hasNormalized) {
          console.log('\n   ⚠️  Falta la columna "normalizedContent"')
          console.log('   💡 Ejecuta: ALTER TABLE "Request" ADD COLUMN "normalizedContent" JSONB;\n')
        } else {
          console.log('\n   ✅ Columna "normalizedContent" existe\n')
        }
      } else {
        console.log('   ⚠️  No se encontraron columnas (la tabla puede no existir)\n')
      }
    } catch (columnError) {
      console.error('   ❌ Error al consultar columnas:', columnError)
    }
    
    // Verificar enums
    console.log('3️⃣ Verificando enums necesarios...')
    try {
      const enums = await prisma.$queryRaw<Array<{ typname: string }>>`
        SELECT typname 
        FROM pg_type 
        WHERE typname IN ('RequestSource', 'RequestStatus', 'PipelineStage', 'UrgencyLevel')
      `
      
      const requiredEnums = ['RequestSource', 'RequestStatus', 'PipelineStage', 'UrgencyLevel']
      const foundEnums = enums.map(e => e.typname)
      
      requiredEnums.forEach(enumName => {
        if (foundEnums.includes(enumName)) {
          console.log(`   ✅ ${enumName} existe`)
        } else {
          console.log(`   ❌ ${enumName} NO existe`)
        }
      })
      console.log('')
    } catch (enumError) {
      console.error('   ❌ Error al consultar enums:', enumError)
    }
    
    // Probar una consulta simple con Prisma
    console.log('4️⃣ Probando consulta con Prisma...')
    try {
      const requests = await prisma.request.findMany({ take: 1 })
      console.log('   ✅ Prisma puede consultar Request correctamente')
      console.log(`   📊 Requests encontrados: ${requests.length}\n`)
    } catch (prismaError) {
      console.error('   ❌ Error con Prisma:', prismaError)
      if (prismaError instanceof Error) {
        console.error('   Mensaje:', prismaError.message)
        console.error('   Stack:', prismaError.stack)
      }
    }
    
    console.log('✅ Prueba de conexión completada\n')
    
  } catch (error) {
    console.error('❌ Error general:', error)
    if (error instanceof Error) {
      console.error('Mensaje:', error.message)
      console.error('Stack:', error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

