/**
 * Script para migrar usuarios de server-users.json a Prisma
 * Ejecutar: node scripts/migrate-users.js
 */

const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function migrateUsers() {
  try {
    console.log('🔄 Iniciando migración de usuarios...')
    
    // Leer usuarios del archivo JSON
    const usersPath = path.join(process.cwd(), 'server-users.json')
    
    if (!fs.existsSync(usersPath)) {
      console.log('⚠️  No se encontró server-users.json')
      console.log('✅ Los usuarios base ya están en la base de datos')
      return
    }
    
    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))
    const users = Array.isArray(usersData) ? usersData : usersData.users || []
    
    console.log(`📦 Encontrados ${users.length} usuarios para migrar`)
    
    let migrated = 0
    let skipped = 0
    let errors = 0
    
    for (const user of users) {
      try {
        // Verificar si el usuario ya existe
        const existing = await prisma.user.findUnique({
          where: { email: user.email }
        })
        
        if (existing) {
          console.log(`⏭️  Usuario ${user.email} ya existe, saltando...`)
          skipped++
          continue
        }
        
        // Hashear contraseña
        const passwordHash = await bcrypt.hash(user.password || 'password123', 10)
        
        // Crear usuario en la base de datos
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name || user.email.split('@')[0],
            passwordHash,
            role: user.role === 'ADMIN' ? 'admin' : 'client',
            company: user.company || null,
            phone: user.phone || null,
            active: user.isActive !== false,
          }
        })
        
        console.log(`✅ Usuario ${user.email} migrado exitosamente`)
        migrated++
      } catch (error) {
        console.error(`❌ Error migrando usuario ${user.email}:`, error.message)
        errors++
      }
    }
    
    console.log('\n📊 Resumen de migración:')
    console.log(`   ✅ Migrados: ${migrated}`)
    console.log(`   ⏭️  Saltados: ${skipped}`)
    console.log(`   ❌ Errores: ${errors}`)
    console.log('\n🎉 Migración completada!')
    
  } catch (error) {
    console.error('❌ Error en la migración:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar migración
migrateUsers()

