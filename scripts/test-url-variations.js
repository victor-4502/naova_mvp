// Script para probar diferentes formatos de URL
const { PrismaClient } = require('@prisma/client')

console.log('🔍 Probando diferentes formatos de URL...\n')

const originalUrl = process.env.DATABASE_URL

if (!originalUrl) {
  console.log('❌ DATABASE_URL no encontrada')
  process.exit(1)
}

// Extraer componentes
const urlMatch = originalUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/)

if (!urlMatch) {
  console.log('❌ No se pudo parsear la URL')
  process.exit(1)
}

const user = urlMatch[1]
const password = urlMatch[2]
const host = urlMatch[3]
const database = urlMatch[4]

console.log('📋 Componentes extraídos:')
console.log(`   Usuario: ${user}`)
console.log(`   Password: ${'*'.repeat(password.length)} (${password.length} chars)`)
console.log(`   Host: ${host}`)
console.log(`   Database: ${database}`)
console.log('')

// Probar diferentes variaciones
const variations = [
  {
    name: 'Original (con ?pgbouncer=true)',
    url: originalUrl
  },
  {
    name: 'Sin parámetro pgbouncer',
    url: originalUrl.replace('?pgbouncer=true', '').replace('&pgbouncer=true', '')
  },
  {
    name: 'Con parámetro pgbouncer al final',
    url: originalUrl.includes('?') 
      ? originalUrl.replace('?pgbouncer=true', '').replace('&pgbouncer=true', '') + '?pgbouncer=true'
      : originalUrl + '?pgbouncer=true'
  },
  {
    name: 'Usuario solo "postgres" (sin project ref)',
    url: originalUrl.replace('postgres.aptijeklzfxcxemnqpil', 'postgres')
  }
]

async function testVariation(name, url) {
  console.log(`\n🧪 Probando: ${name}`)
  console.log(`   URL: ${url.split('@')[0]}@${url.split('@')[1]}`)
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  })
  
  try {
    await prisma.$connect()
    const count = await prisma.user.count()
    console.log(`   ✅ ¡ÉXITO! Usuarios: ${count}`)
    await prisma.$disconnect()
    return true
  } catch (error) {
    if (error.message.includes('Authentication failed')) {
      console.log(`   ❌ Error de autenticación`)
    } else if (error.message.includes("Can't reach")) {
      console.log(`   ❌ No se puede alcanzar el servidor`)
    } else {
      console.log(`   ❌ ${error.message.substring(0, 60)}...`)
    }
    await prisma.$disconnect()
    return false
  }
}

async function runTests() {
  for (const variation of variations) {
    const success = await testVariation(variation.name, variation.url)
    if (success) {
      console.log(`\n🎉 ¡FORMATO CORRECTO ENCONTRADO!`)
      console.log(`\n✅ Usa esta URL en tu .env:`)
      console.log(`DATABASE_URL="${variation.url}"`)
      return
    }
  }
  
  console.log(`\n❌ Ninguna variación funcionó`)
  console.log(`\n💡 Posibles problemas:`)
  console.log(`   1. La contraseña puede estar incorrecta (verifica en Supabase)`)
  console.log(`   2. El proyecto puede no estar completamente activo`)
  console.log(`   3. Puede haber un problema de red/firewall`)
  console.log(`\n💡 Prueba esto:`)
  console.log(`   1. Ve a Supabase Dashboard → SQL Editor`)
  console.log(`   2. Ejecuta: SELECT 1;`)
  console.log(`   3. Si funciona, el proyecto está activo y la contraseña es correcta`)
  console.log(`   4. Si no funciona, resetea la contraseña en Settings → Database`)
}

runTests()

