// Script final para probar conexión (Prisma carga .env automáticamente)
const { PrismaClient } = require('@prisma/client')

console.log('🔍 Verificando conexión final...\n')

// Prisma carga automáticamente las variables de .env
const prisma = new PrismaClient({
  log: ['error']
})

async function test() {
  try {
    console.log('📋 Verificando variables de entorno...')
    const dbUrl = process.env.DATABASE_URL
    
    if (!dbUrl) {
      console.log('❌ DATABASE_URL no encontrada en process.env')
      console.log('   Verifica que el archivo .env esté en la raíz del proyecto')
      return
    }
    
    // Analizar URL (sin mostrar contraseña completa)
    const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/)
    
    if (urlMatch) {
      const password = urlMatch[2]
      console.log(`✅ DATABASE_URL encontrada`)
      console.log(`   Usuario: ${urlMatch[1]}`)
      console.log(`   Host: ${urlMatch[3]}`)
      console.log(`   Password length: ${password.length} caracteres`)
      
      // Verificar si tiene placeholder
      if (password.includes('YOUR-PASSWORD') || password.includes('[YOUR-PASSWORD]')) {
        console.log(`\n⚠️  PROBLEMA: La contraseña todavía tiene placeholder`)
        console.log(`   Reemplaza [YOUR-PASSWORD] con tu contraseña real en el archivo .env`)
        return
      }
      
      console.log(`   ✅ Contraseña configurada (no es placeholder)\n`)
    }
    
    console.log('🔌 Conectando a Supabase...')
    await prisma.$connect()
    console.log('✅ ¡Conexión exitosa!\n')
    
    console.log('📊 Consultando base de datos...')
    const userCount = await prisma.user.count()
    console.log(`✅ Consulta exitosa!`)
    console.log(`   Usuarios en BD: ${userCount}\n`)
    
    if (userCount > 0) {
      console.log('👤 Leyendo usuarios...')
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
    } else {
      console.log('⚠️  No hay usuarios en la base de datos')
      console.log('   Ejecuta: npm run db:seed')
    }
    
    // Leer otras tablas
    console.log('\n📋 Estadísticas:')
    const stats = {
      requirements: await prisma.requirement.count(),
      tenders: await prisma.tender.count(),
      offers: await prisma.offer.count(),
      providers: await prisma.provider.count()
    }
    
    console.log(`   📋 Requerimientos: ${stats.requirements}`)
    console.log(`   🏛️  Licitaciones: ${stats.tenders}`)
    console.log(`   💰 Ofertas: ${stats.offers}`)
    console.log(`   🏢 Proveedores: ${stats.providers}`)
    
    console.log('\n🎉 ¡Base de datos conectada y funcionando correctamente!')
    console.log('\n✅ Todo listo para continuar con el deployment')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`)
    
    if (error.message.includes('Authentication failed')) {
      console.log('💡 Error de autenticación - Posibles causas:')
      console.log('   1. La contraseña en .env no coincide con la de Supabase')
      console.log('   2. Hay espacios invisibles antes/después de la contraseña')
      console.log('   3. La contraseña tiene caracteres que necesitan URL-encoding')
      console.log('\n💡 Solución:')
      console.log('   1. Ve a Supabase Dashboard → Settings → Database')
      console.log('   2. Haz clic en "Reset database password"')
      console.log('   3. Copia la nueva contraseña EXACTAMENTE')
      console.log('   4. Pégala en tu .env (sin espacios)')
      console.log('   5. Guarda el archivo y prueba de nuevo')
    } else if (error.message.includes("Can't reach")) {
      console.log('💡 No se puede alcanzar el servidor')
      console.log('   Verifica que el proyecto esté activo en Supabase')
    } else {
      console.log(`   Código de error: ${error.code || 'N/A'}`)
    }
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Desconectado')
  }
}

test()

