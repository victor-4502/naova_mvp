// Script para verificar el login y la conexión a la base de datos
// Ejecuta: npx tsx scripts/verificar-login.ts

import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function verificarLogin() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...\n')

    // 1. Verificar conexión
    await prisma.$connect()
    console.log('✅ Conexión a la base de datos exitosa\n')

    // 2. Buscar usuario admin
    const user = await prisma.user.findUnique({
      where: { email: 'admin@naova.com' },
    })

    if (!user) {
      console.log('❌ Usuario admin@naova.com NO encontrado')
      console.log('\n📝 Ejecuta en Supabase SQL Editor:')
      console.log('   prisma/create_admin_ready.sql\n')
      return
    }

    console.log('✅ Usuario encontrado:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Nombre: ${user.name}`)
    console.log(`   Rol: ${user.role}`)
    console.log(`   Activo: ${user.active}`)
    console.log(`   Hash: ${user.passwordHash.substring(0, 20)}...`)

    // 3. Verificar contraseña
    const password = 'AdminNaova2024!'
    const isValid = await bcrypt.compare(password, user.passwordHash)

    console.log(`\n🔐 Verificación de contraseña:`)
    console.log(`   Contraseña: ${password}`)
    console.log(`   Hash válido: ${isValid ? '✅ SÍ' : '❌ NO'}`)

    if (!user.active) {
      console.log('\n⚠️  Usuario está INACTIVO')
      console.log('   Ejecuta en Supabase:')
      console.log('   UPDATE "User" SET active = true WHERE email = \'admin@naova.com\';')
    }

    if (!isValid) {
      console.log('\n⚠️  El hash de la contraseña NO coincide')
      console.log('   Ejecuta en Supabase:')
      console.log('   prisma/create_admin_ready.sql para actualizar el hash')
    }

    if (user.active && isValid) {
      console.log('\n✅ TODO ESTÁ CORRECTO')
      console.log('   El login debería funcionar correctamente')
    }

    // 4. Verificar otros usuarios
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        active: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    console.log(`\n📊 Total de usuarios en la base de datos: ${allUsers.length}`)
    if (allUsers.length > 0) {
      console.log('\nUsuarios:')
      allUsers.forEach((u) => {
        console.log(`   - ${u.email} (${u.role}) ${u.active ? '✅' : '❌'}`)
      })
    }
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('\n💡 Posibles soluciones:')
    console.log('   1. Verifica que DATABASE_URL esté configurado en .env')
    console.log('   2. Verifica que la base de datos esté activa en Supabase')
    console.log('   3. Ejecuta: npx prisma generate')
  } finally {
    await prisma.$disconnect()
  }
}

verificarLogin()

