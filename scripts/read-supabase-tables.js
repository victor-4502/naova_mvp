// Script para leer tablas de Supabase
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function readTables() {
  console.log('📊 Leyendo tablas de Supabase...\n')
  
  try {
    await prisma.$connect()
    console.log('✅ Conectado a Supabase\n')
    
    // Leer usuarios
    console.log('👤 USUARIOS:')
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          company: true,
          active: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
      
      if (users.length === 0) {
        console.log('   ⚠️  No hay usuarios en la base de datos')
      } else {
        console.log(`   ✅ Encontrados ${users.length} usuario(s):`)
        users.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.email} (${user.role}) - ${user.name || 'Sin nombre'}`)
          console.log(`      Empresa: ${user.company || 'N/A'}`)
          console.log(`      Activo: ${user.active ? 'Sí' : 'No'}`)
          console.log(`      Creado: ${user.createdAt.toLocaleDateString()}`)
          console.log('')
        })
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    // Leer requerimientos
    console.log('📋 REQUERIMIENTOS:')
    try {
      const requirements = await prisma.requirement.findMany({
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          createdAt: true,
          client: {
            select: {
              email: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
      
      if (requirements.length === 0) {
        console.log('   ⚠️  No hay requerimientos en la base de datos')
      } else {
        console.log(`   ✅ Encontrados ${requirements.length} requerimiento(s):`)
        requirements.forEach((req, index) => {
          console.log(`   ${index + 1}. ${req.title}`)
          console.log(`      Categoría: ${req.category}`)
          console.log(`      Estado: ${req.status}`)
          console.log(`      Cliente: ${req.client?.email || 'N/A'}`)
          console.log(`      Creado: ${req.createdAt.toLocaleDateString()}`)
          console.log('')
        })
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    // Leer licitaciones
    console.log('🏛️  LICITACIONES:')
    try {
      const tenders = await prisma.tender.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          requirement: {
            select: {
              title: true,
              client: {
                select: {
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              offers: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
      
      if (tenders.length === 0) {
        console.log('   ⚠️  No hay licitaciones en la base de datos')
      } else {
        console.log(`   ✅ Encontradas ${tenders.length} licitación(es):`)
        tenders.forEach((tender, index) => {
          console.log(`   ${index + 1}. ${tender.title}`)
          console.log(`      Estado: ${tender.status}`)
          console.log(`      Requerimiento: ${tender.requirement?.title || 'N/A'}`)
          console.log(`      Cliente: ${tender.requirement?.client?.email || 'N/A'}`)
          console.log(`      Ofertas: ${tender._count.offers}`)
          console.log(`      Creado: ${tender.createdAt.toLocaleDateString()}`)
          console.log('')
        })
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    // Leer proveedores
    console.log('🏢 PROVEEDORES:')
    try {
      const providers = await prisma.provider.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          email: true,
          rating: true,
          active: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
      
      if (providers.length === 0) {
        console.log('   ⚠️  No hay proveedores en la base de datos')
      } else {
        console.log(`   ✅ Encontrados ${providers.length} proveedor(es):`)
        providers.forEach((provider, index) => {
          console.log(`   ${index + 1}. ${provider.name}`)
          console.log(`      Categoría: ${provider.category}`)
          console.log(`      Email: ${provider.email || 'N/A'}`)
          console.log(`      Rating: ${provider.rating}`)
          console.log(`      Activo: ${provider.active ? 'Sí' : 'No'}`)
          console.log('')
        })
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    // Estadísticas generales
    console.log('📈 ESTADÍSTICAS:')
    try {
      const stats = {
        users: await prisma.user.count(),
        clients: await prisma.user.count({ where: { role: 'client' } }),
        admins: await prisma.user.count({ where: { role: 'admin' } }),
        requirements: await prisma.requirement.count(),
        tenders: await prisma.tender.count(),
        offers: await prisma.offer.count(),
        providers: await prisma.provider.count(),
        purchaseHistory: await prisma.purchaseHistory.count()
      }
      
      console.log(`   👥 Usuarios totales: ${stats.users}`)
      console.log(`   👤 Clientes: ${stats.clients}`)
      console.log(`   🔑 Admins: ${stats.admins}`)
      console.log(`   📋 Requerimientos: ${stats.requirements}`)
      console.log(`   🏛️  Licitaciones: ${stats.tenders}`)
      console.log(`   💰 Ofertas: ${stats.offers}`)
      console.log(`   🏢 Proveedores: ${stats.providers}`)
      console.log(`   📊 Historial de compras: ${stats.purchaseHistory}`)
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    console.log('\n✅ Lectura completada exitosamente!')
    
  } catch (error) {
    console.log(`\n❌ Error de conexión: ${error.message}`)
    if (error.code) {
      console.log(`   Código de error: ${error.code}`)
    }
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Desconectado de Supabase')
  }
}

readTables()

