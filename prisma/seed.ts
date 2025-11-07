import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Usuarios base del sistema (mínimos para empezar)
  const baseUsers = [
    {
      email: 'admin@naova.com',
      name: 'Admin Principal',
      password: 'password123',
      role: 'admin' as const,
      company: 'Naova Admin',
      active: true,
    },
    {
      email: 'juan@abc.com',
      name: 'Juan Pérez',
      password: 'password123',
      role: 'client' as const,
      company: 'Industrias ABC',
      active: true,
    },
    {
      email: 'maria@xyz.com',
      name: 'María González',
      password: 'password123',
      role: 'client' as const,
      company: 'Comercial XYZ',
      active: true,
    },
    {
      email: 'carlos@pro.com',
      name: 'Carlos Rodríguez',
      password: 'password123',
      role: 'client' as const,
      company: 'Servicios Pro',
      active: true,
    },
  ]

  // Crear usuarios base
  console.log('👤 Creando usuarios base...')
  for (const userData of baseUsers) {
    try {
      // Verificar si el usuario ya existe
      const existing = await prisma.user.findUnique({
        where: { email: userData.email },
      })

      if (existing) {
        console.log(`   ⏭️  Usuario ${userData.email} ya existe, saltando...`)
        continue
      }

      // Hashear contraseña
      const passwordHash = await bcrypt.hash(userData.password, 10)

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          passwordHash,
          role: userData.role,
          company: userData.company,
          active: userData.active,
        },
      })

      console.log(`   ✅ Usuario ${userData.email} creado (ID: ${user.id})`)

      // Si es cliente, crear perfil de cliente
      if (userData.role === 'client') {
        await prisma.clientProfile.create({
          data: {
            userId: user.id,
            billingPlan: 'trial',
            trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          },
        })
        console.log(`   📋 Perfil de cliente creado para ${userData.email}`)
      }
    } catch (error) {
      console.error(`   ❌ Error creando usuario ${userData.email}:`, error)
    }
  }

  console.log('\n✅ Seed completado exitosamente!')
  console.log('\n📝 Credenciales de acceso:')
  console.log('   Admin: admin@naova.com / password123')
  console.log('   Cliente 1: juan@abc.com / password123')
  console.log('   Cliente 2: maria@xyz.com / password123')
  console.log('   Cliente 3: carlos@pro.com / password123')
  console.log('\n⚠️  IMPORTANTE: Cambia estas contraseñas en producción!')
  console.log('\n💡 Puedes migrar más datos después usando:')
  console.log('   - node scripts/migrate-users.js (para usuarios)')
  console.log('   - Scripts personalizados para tenders/requirements')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
