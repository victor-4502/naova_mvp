// Test simple y directo con Prisma
const { PrismaClient } = require('@prisma/client')

console.log('🔌 Probando conexión directa con Prisma...\n')

const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Conectando...')
    await prisma.$connect()
    console.log('✅ Conexión exitosa!\n')
    
    console.log('Consultando usuarios...')
    const count = await prisma.user.count()
    console.log(`✅ Usuarios encontrados: ${count}\n`)
    
    if (count > 0) {
      const users = await prisma.user.findMany({ take: 3 })
      users.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`)
      })
    }
    
    console.log('\n🎉 ¡Funciona correctamente!')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`)
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 La contraseña no es correcta.')
      console.log('   Verifica en Supabase Dashboard → Settings → Database')
      console.log('   Asegúrate de usar la contraseña EXACTA (sin espacios)')
    }
  } finally {
    await prisma.$disconnect()
  }
}

test()

