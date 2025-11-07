#!/usr/bin/env node

/**
 * Script de validación de conexión a Supabase
 * Verifica que la base de datos esté configurada correctamente
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function validateSupabase() {
  log('🔍 Validando conexión a Supabase...\n', 'blue');

  try {
    // 1. Verificar variables de entorno
    log('1. Verificando variables de entorno...', 'yellow');
    
    const requiredEnvVars = ['DATABASE_URL', 'DIRECT_URL'];
    let envVarsOk = 0;
    
    requiredEnvVars.forEach(varName => {
      if (process.env[varName]) {
        log(`   ✅ ${varName} configurada`, 'green');
        envVarsOk++;
      } else {
        log(`   ❌ ${varName} faltante`, 'red');
      }
    });

    if (envVarsOk < requiredEnvVars.length) {
      log('\n❌ Variables de entorno faltantes. Crear archivo .env con:', 'red');
      log('DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"', 'yellow');
      log('DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"', 'yellow');
      return false;
    }

    // 2. Probar conexión
    log('\n2. Probando conexión a la base de datos...', 'yellow');
    
    await prisma.$connect();
    log('   ✅ Conexión exitosa', 'green');

    // 3. Verificar tablas
    log('\n3. Verificando estructura de tablas...', 'yellow');
    
    const tables = [
      'User', 'ClientProfile', 'Requirement', 'Tender', 
      'Provider', 'Offer', 'PurchaseHistory', 'ContactLead', 'AuditLog'
    ];

    let tablesOk = 0;
    for (const table of tables) {
      try {
        await prisma[table].findFirst();
        log(`   ✅ Tabla ${table} existe`, 'green');
        tablesOk++;
      } catch (error) {
        log(`   ❌ Tabla ${table} no encontrada: ${error.message}`, 'red');
      }
    }

    // 4. Verificar datos de prueba
    log('\n4. Verificando datos de prueba...', 'yellow');
    
    const userCount = await prisma.user.count();
    const requirementCount = await prisma.requirement.count();
    const tenderCount = await prisma.tender.count();
    
    log(`   📊 Usuarios: ${userCount}`, userCount > 0 ? 'green' : 'yellow');
    log(`   📊 Requerimientos: ${requirementCount}`, requirementCount > 0 ? 'green' : 'yellow');
    log(`   📊 Licitaciones: ${tenderCount}`, tenderCount > 0 ? 'green' : 'yellow');

    // 5. Probar operaciones CRUD
    log('\n5. Probando operaciones de base de datos...', 'yellow');
    
    try {
      // Crear usuario de prueba
      const testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashed_password',
          role: 'client'
        }
      });
      log('   ✅ Crear usuario: OK', 'green');

      // Leer usuario
      const foundUser = await prisma.user.findUnique({
        where: { id: testUser.id }
      });
      log('   ✅ Leer usuario: OK', 'green');

      // Actualizar usuario
      await prisma.user.update({
        where: { id: testUser.id },
        data: { name: 'Updated Test User' }
      });
      log('   ✅ Actualizar usuario: OK', 'green');

      // Eliminar usuario de prueba
      await prisma.user.delete({
        where: { id: testUser.id }
      });
      log('   ✅ Eliminar usuario: OK', 'green');

    } catch (error) {
      log(`   ❌ Error en operaciones CRUD: ${error.message}`, 'red');
    }

    // 6. Resumen
    log('\n📊 RESUMEN DE VALIDACIÓN', 'bold');
    log('='.repeat(40), 'blue');
    
    const totalChecks = 5;
    const passedChecks = (envVarsOk === requiredEnvVars.length ? 1 : 0) + 
                        (tablesOk === tables.length ? 1 : 0) + 3; // Conexión, datos, CRUD

    log(`\nPuntuación: ${passedChecks}/${totalChecks} (${Math.round(passedChecks/totalChecks*100)}%)`);

    if (passedChecks === totalChecks) {
      log('\n🎉 ¡SUPABASE CONFIGURADO CORRECTAMENTE!', 'green');
      log('La base de datos está lista para usar.', 'green');
    } else {
      log('\n⚠️  Configuración incompleta', 'yellow');
      log('Revisar los errores antes de continuar.', 'yellow');
    }

    return passedChecks === totalChecks;

  } catch (error) {
    log(`\n❌ Error de conexión: ${error.message}`, 'red');
    
    if (error.code === 'P1001') {
      log('\n💡 Posibles soluciones:', 'yellow');
      log('1. Verificar que las credenciales de Supabase sean correctas', 'blue');
      log('2. Verificar que el proyecto de Supabase esté activo', 'blue');
      log('3. Verificar que la contraseña no tenga caracteres especiales', 'blue');
      log('4. Verificar que la URL de conexión sea correcta', 'blue');
    }
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar validación
validateSupabase()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`\n💥 Error inesperado: ${error.message}`, 'red');
    process.exit(1);
  });
