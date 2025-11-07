// Script para codificar contraseña con caracteres especiales
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🔐 Codificador de Contraseña para URL\n')
console.log('Si tu contraseña tiene caracteres especiales, necesitan codificarse.\n')

rl.question('Ingresa tu contraseña de Supabase: ', (password) => {
  const encoded = encodeURIComponent(password)
  
  console.log('\n📋 Resultado:')
  console.log(`   Original: ${password}`)
  console.log(`   Codificada: ${encoded}`)
  
  if (password !== encoded) {
    console.log('\n⚠️  Tu contraseña tiene caracteres especiales que necesitan codificación')
    console.log('\n✅ Usa esta contraseña codificada en tu .env:')
    console.log(`   ${encoded}`)
  } else {
    console.log('\n✅ Tu contraseña no necesita codificación')
  }
  
  console.log('\n📝 URL completa (ejemplo):')
  console.log(`DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:${encoded}@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"`)
  
  rl.close()
})

