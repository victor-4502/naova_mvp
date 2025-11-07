// Script para debuggear la contraseña sin mostrarla completa
const { PrismaClient } = require('@prisma/client')

const dbUrl = process.env.DATABASE_URL

if (!dbUrl) {
  console.log('❌ DATABASE_URL no encontrada')
  process.exit(1)
}

const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@/)

if (urlMatch) {
  const password = urlMatch[2]
  
  console.log('🔍 Análisis de contraseña:')
  console.log(`   Longitud: ${password.length} caracteres`)
  console.log(`   Primeros 5 caracteres: "${password.substring(0, 5)}"`)
  console.log(`   Últimos 5 caracteres: "${password.substring(password.length - 5)}"`)
  console.log(`   Contiene "YOUR": ${password.includes('YOUR') ? 'SÍ ⚠️' : 'NO ✅'}`)
  console.log(`   Contiene "[": ${password.includes('[') ? 'SÍ ⚠️' : 'NO ✅'}`)
  console.log(`   Contiene "]": ${password.includes(']') ? 'SÍ ⚠️' : 'NO ✅'}`)
  console.log(`   Contiene "-": ${password.includes('-') ? 'SÍ' : 'NO'}`)
  
  // Mostrar cada carácter (ocultando algunos en el medio)
  if (password.length <= 20) {
    console.log(`\n   Contenido completo (oculto): ${'*'.repeat(password.length)}`)
    console.log(`   Caracteres ASCII: ${password.split('').map(c => c.charCodeAt(0)).join(', ')}`)
  }
  
  if (password.includes('YOUR') || password.includes('[YOUR')) {
    console.log('\n⚠️  PROBLEMA DETECTADO:')
    console.log('   La contraseña todavía contiene el texto "YOUR-PASSWORD"')
    console.log('   Esto significa que NO se reemplazó con tu contraseña real')
    console.log('\n💡 SOLUCIÓN:')
    console.log('   1. Abre el archivo .env')
    console.log('   2. Busca [YOUR-PASSWORD] o YOUR-PASSWORD')
    console.log('   3. Bórralo COMPLETAMENTE')
    console.log('   4. Pega tu contraseña real de Supabase')
    console.log('   5. Guarda el archivo')
  } else {
    console.log('\n✅ La contraseña NO contiene placeholder')
    console.log('   El problema puede ser que la contraseña sea incorrecta')
    console.log('   Verifica en Supabase Dashboard que la contraseña sea correcta')
  }
}

