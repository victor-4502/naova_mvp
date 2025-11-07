// Script simple para verificar conexión a Supabase
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Verificando conexión a Supabase...\n')
  
  try {
    // Verificar variables de entorno
    console.log('📋 Variables de entorno:')
    console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada')
    console.log('   DIRECT_URL:', process.env.DIRECT_URL ? '✅ Configurada' : '❌ No configurada')
    console.log('')
    
    if (!process.env.DATABASE_URL) {
      console.log('⚠️  DATABASE_URL no encontrada en variables de entorno')
      console.log('   Asegúrate de tener un archivo .env con DATABASE_URL')
      return
    }
    
    // Intentar conectar
    console.log('🔌 Intentando conectar a la base de datos...')
    await prisma.$connect()
    console.log('✅ Conexión exitosa!\n')
    
    // Verificar tablas
    console.log('📊 Verificando tablas...')
    try {
      const userCount = await prisma.user.count()
      console.log(`   ✅ Tabla User existe (${userCount} usuarios)`)
    } catch (error) {
      console.log(`   ⚠️  Tabla User: ${error.message}`)
    }
    
    try {
      const requirementCount = await prisma.requirement.count()
      console.log(`   ✅ Tabla Requirement existe (${requirementCount} requerimientos)`)
    } catch (error) {
      console.log(`   ⚠️  Tabla Requirement: ${error.message}`)
    }
    
    try {
      const tenderCount = await prisma.tender.count()
      console.log(`   ✅ Tabla Tender existe (${tenderCount} licitaciones)`)
    } catch (error) {
      console.log(`   ⚠️  Tabla Tender: ${error.message}`)
    }
    
    console.log('\n🎉 ¡Conexión verificada exitosamente!')
    console.log('   La base de datos está lista para usar.')
    
  } catch (error) {
    console.log('\n❌ Error de conexión:')
    console.log(`   ${error.message}\n`)
    
    if (error.code === 'P1001') {
      console.log('💡 Posibles soluciones:')
      console.log('   1. Verificar que DATABASE_URL sea correcta')
      console.log('   2. Verificar que el proyecto de Supabase esté activo')
      console.log('   3. Verificar que la contraseña sea correcta')
      console.log('   4. Verificar firewall/red de Supabase')
    } else if (error.code === 'P1017') {
      console.log('💡 El servidor cerró la conexión')
      console.log('   Verifica que la base de datos esté activa en Supabase')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

