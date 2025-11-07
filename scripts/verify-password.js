// Script para verificar formato de contraseña
const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando contraseña en .env...\n')

const envPath = path.join(process.cwd(), '.env')

if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env no encontrado')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const dbUrlMatch = envContent.match(/^DATABASE_URL="([^"]+)"/m)

if (!dbUrlMatch) {
  console.log('❌ No se encontró DATABASE_URL en .env')
  process.exit(1)
}

const dbUrl = dbUrlMatch[1]
const passwordMatch = dbUrl.match(/postgresql:\/\/[^:]+:([^@]+)@/)

if (passwordMatch) {
  const password = passwordMatch[1]
  
  console.log('📋 Información de contraseña:')
  console.log(`   Longitud: ${password.length} caracteres`)
  console.log(`   Contiene espacios: ${password.includes(' ') ? 'SÍ ⚠️' : 'NO ✅'}`)
  console.log(`   Contiene saltos de línea: ${password.includes('\n') || password.includes('\r') ? 'SÍ ⚠️' : 'NO ✅'}`)
  console.log(`   Contiene tabs: ${password.includes('\t') ? 'SÍ ⚠️' : 'NO ✅'}`)
  
  // Mostrar primeros y últimos caracteres (sin mostrar toda la contraseña)
  if (password.length > 4) {
    console.log(`   Primeros 2 caracteres: "${password.substring(0, 2)}"`)
    console.log(`   Últimos 2 caracteres: "${password.substring(password.length - 2)}"`)
  }
  
  // Verificar caracteres especiales comunes
  const specialChars = /[@#$%^&*()+=\[\]{}|\\;:'"<>,.?\/~`]/
  if (specialChars.test(password)) {
    console.log(`   ⚠️  Contiene caracteres especiales que pueden necesitar codificación`)
    const specials = password.match(specialChars)
    console.log(`   Caracteres encontrados: ${specials.join(', ')}`)
  } else {
    console.log(`   ✅ No tiene caracteres especiales problemáticos`)
  }
  
  console.log('\n💡 Verifica en Supabase:')
  console.log('   1. Ve a Settings → Database')
  console.log('   2. La contraseña debe ser exactamente igual (sin espacios al inicio/final)')
  console.log('   3. Si no estás seguro, puedes resetear la contraseña en Supabase')
  console.log('\n💡 Para resetear contraseña en Supabase:')
  console.log('   - Settings → Database → Reset database password')
  
} else {
  console.log('❌ No se pudo extraer la contraseña de la URL')
}

