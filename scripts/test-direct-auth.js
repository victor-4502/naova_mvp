// Script para probar con conexión directa (sin pooler)
const { PrismaClient } = require('@prisma/client')

console.log('🔍 Probando autenticación con conexión directa...\n')

// Usar DIRECT_URL si está disponible, sino usar DATABASE_URL pero cambiar a directo
let directUrl = process.env.DIRECT_URL

if (!directUrl) {
  // Convertir DATABASE_URL a directo
  const dbUrl = process.env.DATABASE_URL
  if (dbUrl) {
    directUrl = dbUrl
      .replace('pooler.supabase.com:6543', 'db.aptijeklzfxcxemnqpil.supabase.co:5432')
      .replace('postgres.aptijeklzfxcxemnqpil', 'postgres')
      .replace('?pgbouncer=true', '')
      .replace('&pgbouncer=true', '')
  }
}

if (!directUrl) {
  console.log('❌ No se encontró DIRECT_URL ni DATABASE_URL')
  process.exit(1)
}

console.log('📋 Usando conexión directa (puerto 5432)')
console.log('   Esto ayuda a verificar si el problema es el pooler o la autenticación\n')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl
    }
  }
})

async function test() {
  try {
    console.log('🔌 Conectando...')
    await prisma.$connect()
    console.log('✅ ¡Conexión exitosa con conexión directa!\n')
    
    const count = await prisma.user.count()
    console.log(`📊 Usuarios en BD: ${count}\n`)
    
    if (count > 0) {
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
        console.log(`   ${i + 1}. ${u.email} (${u.role}) - ${u.name || 'Sin nombre'}`)
      })
    } else {
      console.log('⚠️  No hay usuarios. Ejecuta: npm run db:seed')
    }
    
    console.log('\n🎉 ¡Autenticación correcta!')
    console.log('\n💡 Si esto funciona pero el pooler no, puede ser un problema temporal del pooler.')
    console.log('   Para producción, el pooler debería funcionar. Prueba de nuevo en unos minutos.')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`)
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Error de autenticación confirmado.')
      console.log('\n📝 Verifica:')
      console.log('   1. Ve a Supabase Dashboard → Settings → Database')
      console.log('   2. Verifica la contraseña que configuraste')
      console.log('   3. Asegúrate de copiar la contraseña exactamente (sin espacios al inicio/final)')
      console.log('   4. Si cambiaste la contraseña, actualiza el .env')
      console.log('\n💡 También puedes:')
      console.log('   - Resetear la contraseña en Supabase')
      console.log('   - Usar una contraseña simple temporal para probar')
    } else if (error.message.includes("Can't reach")) {
      console.log('\n💡 No se puede alcanzar el servidor.')
      console.log('   El proyecto puede estar aún activándose o hay un problema de red.')
    }
  } finally {
    await prisma.$disconnect()
  }
}

test()

