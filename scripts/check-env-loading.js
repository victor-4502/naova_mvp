// Script para verificar si las variables de entorno se cargan correctamente
require('dotenv').config({ path: '.env' })

console.log('🔍 Verificando carga de variables de entorno...\n')

// Verificar si dotenv está instalado
try {
  require('dotenv')
  console.log('✅ dotenv está disponible')
} catch (e) {
  console.log('❌ dotenv no está instalado')
  console.log('   Instala con: npm install dotenv')
  process.exit(1)
}

// Verificar si existe el archivo .env
const fs = require('fs')
const path = require('path')
const envPath = path.join(process.cwd(), '.env')

if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env encontrado')
  console.log(`   Ruta: ${envPath}\n`)
} else {
  console.log('❌ Archivo .env NO encontrado')
  console.log(`   Buscando en: ${envPath}\n`)
}

// Verificar variables
console.log('📋 Variables de entorno cargadas:')
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada'}`)
console.log(`   DIRECT_URL: ${process.env.DIRECT_URL ? '✅ Configurada' : '❌ No configurada'}`)
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configurada' : '❌ No configurada'}\n`)

if (process.env.DATABASE_URL) {
  // Analizar DATABASE_URL sin mostrar la contraseña completa
  const dbUrl = process.env.DATABASE_URL
  const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/)
  
  if (urlMatch) {
    console.log('📊 Análisis de DATABASE_URL:')
    console.log(`   Usuario: ${urlMatch[1]}`)
    console.log(`   Password: ${urlMatch[2].substring(0, 2)}...${urlMatch[2].substring(urlMatch[2].length - 2)} (${urlMatch[2].length} caracteres)`)
    console.log(`   Host: ${urlMatch[3]}`)
    console.log(`   Database: ${urlMatch[4]}\n`)
    
    // Verificar si todavía tiene placeholder
    if (urlMatch[2].includes('YOUR-PASSWORD') || urlMatch[2].includes('[YOUR-PASSWORD]')) {
      console.log('⚠️  PROBLEMA: La contraseña todavía tiene placeholder')
      console.log('   Reemplaza [YOUR-PASSWORD] o YOUR-PASSWORD con tu contraseña real\n')
    } else {
      console.log('✅ La contraseña parece estar configurada (no es placeholder)\n')
    }
  }
}

// Intentar conectar
console.log('🔌 Intentando conectar con Prisma...\n')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    await prisma.$connect()
    console.log('✅ ¡Conexión exitosa!\n')
    
    const count = await prisma.user.count()
    console.log(`📊 Usuarios en BD: ${count}\n`)
    
    if (count > 0) {
      const users = await prisma.user.findMany({ take: 3 })
      console.log('👤 Primeros usuarios:')
      users.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.email} (${u.role})`)
      })
    }
    
    console.log('\n🎉 ¡Todo funciona correctamente!')
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`)
    
    if (error.message.includes('Authentication failed')) {
      console.log('💡 Error de autenticación:')
      console.log('   1. Verifica que la contraseña en .env sea exactamente igual a la de Supabase')
      console.log('   2. Asegúrate de no tener espacios al inicio/final de la contraseña')
      console.log('   3. Si la contraseña tiene caracteres especiales, pueden necesitar codificación')
      console.log('   4. Prueba resetear la contraseña en Supabase y usar la nueva')
    } else if (error.message.includes("Can't reach")) {
      console.log('💡 No se puede alcanzar el servidor:')
      console.log('   1. Verifica que el proyecto esté activo en Supabase')
      console.log('   2. Verifica que la URL sea correcta')
    }
  } finally {
    await prisma.$disconnect()
  }
}

test()

