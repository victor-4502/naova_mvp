// Script para probar con URL de pooler
const { PrismaClient } = require('@prisma/client')

// Intentar con pooler URL si existe
let databaseUrl = process.env.DATABASE_URL

// Si la URL usa puerto 5432, intentar cambiarla a pooler
if (databaseUrl && databaseUrl.includes(':5432')) {
  console.log('⚠️  URL usa puerto directo (5432)')
  console.log('   Intentando convertir a pooler (6543)...\n')
  
  // Convertir a pooler
  databaseUrl = databaseUrl
    .replace('db.', 'aws-0-us-east-1.pooler.')
    .replace(':5432', ':6543')
    .replace('/postgres', '/postgres?pgbouncer=true')
  
  console.log('🔗 Nueva URL (pooler):', databaseUrl.split('@')[0] + ':***@' + databaseUrl.split('@')[1])
  console.log('')
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

async function test() {
  try {
    console.log('🔌 Conectando...')
    await prisma.$connect()
    console.log('✅ ¡Conexión exitosa!\n')
    
    const userCount = await prisma.user.count()
    console.log(`📊 Usuarios en BD: ${userCount}\n`)
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          email: true,
          name: true,
          role: true
        }
      })
      
      console.log('👤 Usuarios encontrados:')
      users.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.email} (${u.role})`)
      })
    }
    
    console.log('\n🎉 ¡Conexión verificada!')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`)
    console.log('\n💡 Sugerencias:')
    console.log('   1. Verifica que el proyecto esté completamente activo (puede tardar 1-2 minutos)')
    console.log('   2. Verifica la URL en Supabase Dashboard → Settings → Database')
    console.log('   3. Usa la URL del "Connection Pooling" (puerto 6543) para mejor rendimiento')
  } finally {
    await prisma.$disconnect()
  }
}

test()

