// Script simple para verificar formato de URL
const { PrismaClient } = require('@prisma/client')

console.log('🔍 Verificando formato de URL...\n')

const dbUrl = process.env.DATABASE_URL

if (!dbUrl) {
  console.log('❌ DATABASE_URL no encontrada')
  process.exit(1)
}

// Analizar URL
const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/)

if (urlMatch) {
  console.log('📋 Análisis de URL:')
  console.log(`   Usuario: ${urlMatch[1]}`)
  console.log(`   Password: ${'*'.repeat(urlMatch[2].length)} (${urlMatch[2].length} caracteres)`)
  console.log(`   Host: ${urlMatch[3]}`)
  console.log(`   Database: ${urlMatch[4]}`)
  console.log('')
  
  // Verificar formato
  if (!urlMatch[1].includes('.')) {
    console.log('⚠️  ADVERTENCIA: El usuario debería ser "postgres.PROJECT-REF"')
    console.log('   Ejemplo: postgres.aptijeklzfxcxemnqpil')
  }
  
  if (urlMatch[3].includes('pooler')) {
    console.log('✅ Usando Transaction Pooler (correcto)')
  } else {
    console.log('⚠️  No está usando pooler')
  }
  
  if (urlMatch[4].includes('pgbouncer')) {
    console.log('✅ Parámetro pgbouncer=true presente')
  } else {
    console.log('⚠️  Falta parámetro ?pgbouncer=true')
  }
}

console.log('\n🔌 Intentando conectar...\n')

const prisma = new PrismaClient()

async function test() {
  try {
    await prisma.$connect()
    console.log('✅ ¡Conexión exitosa!\n')
    
    const count = await prisma.user.count()
    console.log(`📊 Usuarios en BD: ${count}`)
    
    if (count > 0) {
      const users = await prisma.user.findMany({ take: 3 })
      console.log('\n👤 Primeros usuarios:')
      users.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.email} (${u.role})`)
      })
    }
    
    console.log('\n🎉 ¡Base de datos funcionando correctamente!')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`)
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Error de autenticación:')
      console.log('   1. Verifica que la contraseña sea correcta')
      console.log('   2. Si la contraseña tiene caracteres especiales, necesitan URL-encoding:')
      console.log('      @ → %40')
      console.log('      # → %23')
      console.log('      $ → %24')
      console.log('      & → %26')
      console.log('      + → %2B')
      console.log('      / → %2F')
      console.log('      = → %3D')
      console.log('      ? → %3F')
      console.log('   3. Verifica que el usuario sea: postgres.aptijeklzfxcxemnqpil')
    }
  } finally {
    await prisma.$disconnect()
  }
}

test()

