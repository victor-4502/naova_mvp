# Script PowerShell para ejecutar pruebas de webhooks
# Ejecuta: .\EJECUTAR_PRUEBAS_WEBHOOKS.ps1

Write-Host "🧪 Ejecutando Pruebas de Webhooks de Naova" -ForegroundColor Cyan
Write-Host ""

# Verificar que el servidor esté corriendo
Write-Host "1️⃣ Verificando servidor..." -ForegroundColor Yellow
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 2 -ErrorAction Stop
    $serverRunning = $true
    Write-Host "   ✅ Servidor corriendo en http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Servidor no está corriendo" -ForegroundColor Yellow
    Write-Host "   💡 Por favor inicia el servidor primero:" -ForegroundColor Cyan
    Write-Host "      npm run dev" -ForegroundColor White
    Write-Host ""
    $startServer = Read-Host "   ¿Quieres que inicie el servidor ahora? (S/N)"
    if ($startServer -eq "S" -or $startServer -eq "s") {
        Write-Host "   Iniciando servidor en segundo plano..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
        Write-Host "   ⏳ Esperando 10 segundos para que el servidor inicie..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Verificar nuevamente
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 2 -ErrorAction Stop
            $serverRunning = $true
            Write-Host "   ✅ Servidor iniciado correctamente" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  El servidor aún no está listo, pero continuando..." -ForegroundColor Yellow
        }
    }
}

if (-not $serverRunning) {
    Write-Host ""
    Write-Host "⚠️  Continuando sin verificación del servidor..." -ForegroundColor Yellow
    Write-Host "   Asegúrate de que el servidor esté corriendo en otra terminal" -ForegroundColor Cyan
    Write-Host ""
}

# Probar webhook de WhatsApp
Write-Host ""
Write-Host "2️⃣ Probando webhook de WhatsApp desde contacto adicional..." -ForegroundColor Yellow
Write-Host ""
try {
    npm run test:webhook:whatsapp
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "   ✅ Prueba de WhatsApp completada" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "   ⚠️  La prueba de WhatsApp terminó con errores" -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "   ❌ Error en prueba de WhatsApp: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# Probar webhook de Email
Write-Host "3️⃣ Probando webhook de Email desde contacto adicional..." -ForegroundColor Yellow
Write-Host ""
try {
    npm run test:webhook:email
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "   ✅ Prueba de Email completada" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "   ⚠️  La prueba de Email terminó con errores" -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "   ❌ Error en prueba de Email: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""
Write-Host "✅ Pruebas completadas!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Siguiente paso:" -ForegroundColor Cyan
Write-Host "   1. Ve a http://localhost:3000/admin/requests" -ForegroundColor White
Write-Host "   2. Deberías ver los requests creados con source 'WhatsApp' y 'Email'" -ForegroundColor White
Write-Host "   3. Verifica que ambos estén identificados con el cliente correcto" -ForegroundColor White
Write-Host "   4. Verifica que aparezcan los mensajes sugeridos para información faltante" -ForegroundColor White
Write-Host ""

