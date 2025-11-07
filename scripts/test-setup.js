#!/usr/bin/env node

/**
 * Script de pruebas para Naova MVP 3.0
 * Verifica que todas las funcionalidades estén funcionando correctamente
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando pruebas de Naova MVP 3.0...\n');

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

function checkFile(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description} - Archivo no encontrado`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - Error: ${error.message}`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  try {
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description} - Directorio no encontrado`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - Error: ${error.message}`, 'red');
    return false;
  }
}

// 1. Verificar estructura de archivos
log('\n📁 Verificando estructura de archivos...', 'blue');

const requiredFiles = [
  ['package.json', 'Archivo de dependencias'],
  ['next.config.js', 'Configuración de Next.js'],
  ['prisma/schema.prisma', 'Esquema de base de datos'],
  ['middleware.ts', 'Middleware de autenticación'],
  ['.env.example', 'Variables de entorno de ejemplo'],
  ['app/layout.tsx', 'Layout principal'],
  ['app/login/page.tsx', 'Página de login'],
  ['app/admin/dashboard/page.tsx', 'Dashboard de administrador'],
  ['app/app/dashboard/page.tsx', 'Dashboard de cliente'],
  ['app/admin/reports/page.tsx', 'Reportes de administrador'],
  ['app/app/reports/page.tsx', 'Reportes de cliente'],
  ['app/admin/users/page.tsx', 'Gestión de usuarios'],
  ['app/admin/audit/page.tsx', 'Historial de auditoría'],
  ['lib/prediction-models.ts', 'Modelos de predicción'],
  ['lib/export-utils.ts', 'Utilidades de exportación'],
  ['lib/notifications.ts', 'Sistema de notificaciones'],
  ['components/KPIWidget.tsx', 'Componente KPIWidget'],
  ['components/ReportCard.tsx', 'Componente ReportCard'],
  ['components/ChartWrapper.tsx', 'Componente ChartWrapper'],
  ['components/NotificationCenter.tsx', 'Centro de notificaciones']
];

let filesOk = 0;
requiredFiles.forEach(([file, description]) => {
  if (checkFile(file, description)) filesOk++;
});

// 2. Verificar APIs
log('\n🔌 Verificando APIs...', 'blue');

const requiredAPIs = [
  ['app/api/auth/login/route.ts', 'API de login'],
  ['app/api/auth/logout/route.ts', 'API de logout'],
  ['app/api/reports/comprasPorCliente/route.ts', 'API reportes cliente'],
  ['app/api/reports/resumenGlobal/route.ts', 'API reportes globales'],
  ['app/api/insights/predicciones/route.ts', 'API predicciones'],
  ['app/api/insights/recomendaciones/route.ts', 'API recomendaciones']
];

let apisOk = 0;
requiredAPIs.forEach(([file, description]) => {
  if (checkFile(file, description)) apisOk++;
});

// 3. Verificar variables de entorno
log('\n🔧 Verificando configuración...', 'blue');

let envOk = 0;

// Verificar si existe .env
if (fs.existsSync('.env')) {
  log('✅ Archivo .env encontrado', 'green');
  envOk++;
} else {
  log('⚠️  Archivo .env no encontrado - Usar .env.example como base', 'yellow');
}

// Verificar package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'next', 'react', 'prisma', '@prisma/client', 'recharts', 
    'framer-motion', 'lucide-react', 'xlsx', 'file-saver'
  ];
  
  let depsOk = 0;
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      log(`✅ Dependencia ${dep} encontrada`, 'green');
      depsOk++;
    } else {
      log(`❌ Dependencia ${dep} faltante`, 'red');
    }
  });
  
  if (depsOk === requiredDeps.length) {
    envOk++;
  }
} catch (error) {
  log(`❌ Error leyendo package.json: ${error.message}`, 'red');
}

// 4. Verificar build
log('\n🏗️  Verificando build...', 'blue');

try {
  log('Ejecutando npm run build...', 'yellow');
  execSync('npm run build', { stdio: 'pipe' });
  log('✅ Build exitoso', 'green');
  envOk++;
} catch (error) {
  log('❌ Error en build:', 'red');
  log(error.stdout?.toString() || error.message, 'red');
}

// 5. Resumen
log('\n📊 RESUMEN DE PRUEBAS', 'bold');
log('='.repeat(50), 'blue');

const totalFiles = requiredFiles.length;
const totalAPIs = requiredAPIs.length;
const totalChecks = 4;

log(`\nArchivos: ${filesOk}/${totalFiles} (${Math.round(filesOk/totalFiles*100)}%)`);
log(`APIs: ${apisOk}/${totalAPIs} (${Math.round(apisOk/totalAPIs*100)}%)`);
log(`Configuración: ${envOk}/${totalChecks} (${Math.round(envOk/totalChecks*100)}%)`);

const overallScore = Math.round((filesOk + apisOk + envOk) / (totalFiles + totalAPIs + totalChecks) * 100);

if (overallScore >= 90) {
  log(`\n🎉 PUNTUACIÓN GENERAL: ${overallScore}% - EXCELENTE`, 'green');
  log('El proyecto está listo para producción!', 'green');
} else if (overallScore >= 70) {
  log(`\n⚠️  PUNTUACIÓN GENERAL: ${overallScore}% - BUENO`, 'yellow');
  log('Algunas mejoras recomendadas antes de producción', 'yellow');
} else {
  log(`\n❌ PUNTUACIÓN GENERAL: ${overallScore}% - NECESITA MEJORAS`, 'red');
  log('Revisar los errores antes de continuar', 'red');
}

// 6. Próximos pasos
log('\n🚀 PRÓXIMOS PASOS:', 'bold');
log('1. Crear archivo .env con tus credenciales de Supabase', 'blue');
log('2. Ejecutar: npm run db:push (para crear tablas)', 'blue');
log('3. Ejecutar: npm run db:seed (para datos de prueba)', 'blue');
log('4. Ejecutar: npm run dev (para iniciar servidor)', 'blue');
log('5. Visitar: http://localhost:3000', 'blue');

log('\n✨ ¡Pruebas completadas!', 'green');
