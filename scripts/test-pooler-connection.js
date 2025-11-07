// Script para probar conexión usando Transaction Pooler
const { PrismaClient } = require('@prisma/client')

// Crear cliente con solo DATABASE_URL (pooler)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function testPooler() {
  console.log('🔍 Probando conexión con Transaction Pooler...\n')
  console.log('📋 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada')
  console.log('')
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL no encontrada')
    return
  }
  
  // Mostrar URL (sin password)
  const urlParts = process.env.DATABASE_URL.split('@')
  if (urlParts.length > 1) {
    console.log('🔗 URL (sin password):', urlParts[0].split(':')[0] + ':***@' + urlParts[1])
  }
  console.log('')
  
  try {
    console.log('🔌 Intentando conectar...')
    await prisma.$connect()
    console.log('✅ ¡Conexión exitosa con Pooler!\n')
    
    // Intentar una consulta simple
    console.log('📊 Probando consulta...')
    const userCount = await prisma.user.count()
    console.log(`✅ Consulta exitosa! Usuarios en BD: ${userCount}\n`)
    
    // Leer algunos usuarios
    if (userCount > 0) {
      console.log('👤 Primeros usuarios:')
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          email: true,
          name: true,
          role: true,
          active: true
        }
      })
      
      users.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.email} (${user.role}) - ${user.name || 'Sin nombre'}`)
      })
    } else {
      console.log('⚠️  No hay usuarios en la base de datos')
      console.log('   Ejecuta: npm run db:seed')
    }
    
    console.log('\n🎉 ¡Conexión verificada exitosamente!')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`)
    console.log(`   Código: ${error.code || 'N/A'}`)
    
    if (error.message.includes('password')) {
      console.log('\n💡 Posible problema con la contraseña')
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Timeout - verifica que el proyecto esté activo en Supabase')
    } else if (error.message.includes('Can\'t reach')) {
      console.log('\n💡 No se puede alcanzar el servidor:')
      console.log('   1. Verifica que el proyecto esté activo en Supabase')
      console.log('   2. Verifica que la URL sea correcta')
      console.log('   3. Verifica firewall/red')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testPooler()

