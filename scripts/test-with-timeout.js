// Test con timeout extendido
const { PrismaClient } = require('@prisma/client')

console.log('🔌 Probando conexión con timeout extendido...\n')
console.log('⏳ Esto puede tardar 30-60 segundos si el proyecto se está activando...\n')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function test() {
  try {
    console.log('Conectando al pooler de Supabase...')
    
    // Timeout más largo
    const connectPromise = prisma.$connect()
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout después de 60 segundos')), 60000)
    )
    
    await Promise.race([connectPromise, timeoutPromise])
    
    console.log('✅ ¡Conexión exitosa!\n')
    
    const count = await prisma.user.count()
    console.log(`📊 Usuarios en BD: ${count}\n`)
    
    if (count > 0) {
      const users = await prisma.user.findMany({ take: 3 })
      console.log('👤 Primeros usuarios:')
      users.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`)
      })
    }
    
    console.log('\n🎉 ¡Base de datos funcionando correctamente!')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`)
    
    if (error.message.includes("Can't reach")) {
      console.log('💡 No se puede alcanzar el servidor. Posibles causas:')
      console.log('   1. El proyecto puede estar pausado - verifica en Supabase Dashboard')
      console.log('   2. El proyecto puede estar aún activándose (espera 2-3 minutos)')
      console.log('   3. Problema de red/firewall')
      console.log('\n💡 Verifica en Supabase:')
      console.log('   - Ve a tu proyecto en https://supabase.com/dashboard')
      console.log('   - Verifica que el estado sea "Active" (no "Paused" o "Resuming")')
      console.log('   - Si está pausado, haz clic en "Restore" o "Resume"')
    } else if (error.message.includes('Authentication failed')) {
      console.log('💡 Error de autenticación - la contraseña no es correcta')
    } else if (error.message.includes('Timeout')) {
      console.log('💡 Timeout - el servidor no responde')
      console.log('   El proyecto puede estar aún activándose')
    }
  } finally {
    await prisma.$disconnect()
  }
}

test()

