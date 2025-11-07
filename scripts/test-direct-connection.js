// Script para probar conexión directa con timeout extendido
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['error', 'warn']
})

async function testDirect() {
  console.log('🔍 Probando conexión directa a Supabase...\n')
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL no configurada')
    return
  }
  
  // Mostrar info de la URL (sin password)
  const urlMatch = process.env.DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@(.+)/)
  if (urlMatch) {
    console.log('📋 Información de conexión:')
    console.log(`   Usuario: ${urlMatch[1]}`)
    console.log(`   Host: ${urlMatch[3].split('/')[0]}`)
    console.log(`   Base de datos: ${urlMatch[3].split('/')[1] || 'postgres'}`)
    console.log('')
  }
  
  try {
    console.log('🔌 Conectando (esto puede tardar 10-30 segundos si el proyecto se acaba de activar)...')
    
    // Timeout extendido
    const timeout = setTimeout(() => {
      console.log('⏳ Esperando respuesta del servidor...')
    }, 5000)
    
    await prisma.$connect()
    clearTimeout(timeout)
    
    console.log('✅ ¡Conexión exitosa!\n')
    
    // Probar consulta
    console.log('📊 Probando consulta a la base de datos...')
    const userCount = await prisma.user.count()
    console.log(`✅ Consulta exitosa!`)
    console.log(`   Usuarios en BD: ${userCount}\n`)
    
    // Leer tablas principales
    console.log('📋 Leyendo tablas:')
    
    const tables = {
      users: await prisma.user.count(),
      requirements: await prisma.requirement.count(),
      tenders: await prisma.tender.count(),
      offers: await prisma.offer.count(),
      providers: await prisma.provider.count()
    }
    
    console.log(`   👥 Usuarios: ${tables.users}`)
    console.log(`   📋 Requerimientos: ${tables.requirements}`)
    console.log(`   🏛️  Licitaciones: ${tables.tenders}`)
    console.log(`   💰 Ofertas: ${tables.offers}`)
    console.log(`   🏢 Proveedores: ${tables.providers}`)
    
    if (tables.users > 0) {
      console.log('\n👤 Primeros usuarios:')
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          email: true,
          name: true,
          role: true,
          active: true
        }
      })
      
      users.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.email} (${u.role}) - ${u.name || 'Sin nombre'} - ${u.active ? 'Activo' : 'Inactivo'}`)
      })
    }
    
    console.log('\n🎉 ¡Base de datos conectada y funcionando!')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`)
    
    if (error.code === 'P1001') {
      console.log('\n💡 El servidor no responde. Posibles causas:')
      console.log('   1. El proyecto puede estar aún activándose (espera 1-2 minutos)')
      console.log('   2. La URL puede estar incorrecta')
      console.log('   3. El proyecto puede estar en otra región')
    } else if (error.code === 'P1000') {
      console.log('\n💡 Error de autenticación:')
      console.log('   1. Verifica que la contraseña sea correcta')
      console.log('   2. Algunos caracteres especiales deben estar URL-encoded')
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Timeout - el servidor no responde a tiempo')
      console.log('   El proyecto puede estar aún activándose')
    }
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Desconectado')
  }
}

testDirect()

