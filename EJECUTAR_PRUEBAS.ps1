# Script para ejecutar todas las pruebas
# Ejecuta: .\EJECUTAR_PRUEBAS.ps1

Write-Host "🚀 Iniciando pruebas del sistema Naova..." -ForegroundColor Cyan
Write-Host ""

# Verificar que el servidor esté corriendo
Write-Host "1️⃣ Verificando servidor..." -ForegroundColor Yellow
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 2 -ErrorAction Stop
    $serverRunning = $true
    Write-Host "   ✅ Servidor corriendo en http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Servidor no está corriendo. Iniciando..." -ForegroundColor Yellow
    Write-Host "   💡 Ejecuta en otra terminal: npm run dev" -ForegroundColor Cyan
    Write-Host ""
    $startServer = Read-Host "   ¿Quieres que inicie el servidor ahora? (S/N)"
    if ($startServer -eq "S" -or $startServer -eq "s") {
        Write-Host "   Iniciando servidor en segundo plano..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
        Write-Host "   ⏳ Esperando 10 segundos para que el servidor inicie..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $serverRunning = $true
    }
}

if (-not $serverRunning) {
    Write-Host ""
    Write-Host "❌ No se puede continuar sin el servidor. Por favor inicia el servidor primero." -ForegroundColor Red
    Write-Host "   Ejecuta: npm run dev" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "2️⃣ Probando webhook de Email..." -ForegroundColor Yellow
Write-Host ""
try {
    npm run tsx scripts/probar-webhook-email.ts
    Write-Host ""
    Write-Host "   ✅ Prueba de Email completada" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error en prueba de Email: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "3️⃣ Probando webhook de WhatsApp..." -ForegroundColor Yellow
Write-Host ""
try {
    npm run tsx scripts/probar-webhook-whatsapp.ts
    Write-Host ""
    Write-Host "   ✅ Prueba de WhatsApp completada" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error en prueba de WhatsApp: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Pruebas completadas!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Siguiente paso:" -ForegroundColor Cyan
Write-Host "   1. Ve a http://localhost:3000/admin/requests" -ForegroundColor White
Write-Host "   2. Deberías ver los requests creados con source 'Email' y 'WhatsApp'" -ForegroundColor White
Write-Host "   3. Verifica que aparezcan los mensajes sugeridos para información faltante" -ForegroundColor White
Write-Host ""
Write-Host "💡 También puedes crear un requerimiento desde:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/app/requests (inicia sesión como cliente primero)" -ForegroundColor White
Write-Host ""

