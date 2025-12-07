# Script para mover el proyecto fuera de OneDrive
# Ejecuta este script como Administrador

Write-Host "=== MOVER PROYECTO FUERA DE ONEDRIVE ===" -ForegroundColor Cyan
Write-Host ""

$rutaOrigen = "C:\Users\user\OneDrive\Documents\naova2.0"
$rutaDestino = "C:\dev\naova2.0"

# Verificar si el proyecto existe
if (-not (Test-Path $rutaOrigen)) {
    Write-Host "❌ Error: No se encontró el proyecto en:" -ForegroundColor Red
    Write-Host $rutaOrigen -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Verifica la ruta del proyecto." -ForegroundColor Yellow
    exit 1
}

# Crear carpeta destino si no existe
$carpetaDestino = Split-Path $rutaDestino -Parent
if (-not (Test-Path $carpetaDestino)) {
    Write-Host "📁 Creando carpeta: $carpetaDestino" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $carpetaDestino -Force | Out-Null
}

# Verificar si ya existe en destino
if (Test-Path $rutaDestino) {
    Write-Host "⚠️  ADVERTENCIA: Ya existe una carpeta en el destino:" -ForegroundColor Yellow
    Write-Host $rutaDestino -ForegroundColor Yellow
    Write-Host ""
    $respuesta = Read-Host "¿Deseas sobrescribir? (S/N)"
    if ($respuesta -ne "S" -and $respuesta -ne "s") {
        Write-Host "❌ Operación cancelada." -ForegroundColor Red
        exit 0
    }
    Remove-Item -Path $rutaDestino -Recurse -Force
}

Write-Host ""
Write-Host "🔄 Moviendo proyecto..." -ForegroundColor Yellow
Write-Host "   De: $rutaOrigen" -ForegroundColor Gray
Write-Host "   A:  $rutaDestino" -ForegroundColor Gray
Write-Host ""

try {
    # Mover el proyecto
    Move-Item -Path $rutaOrigen -Destination $rutaDestino -Force
    
    Write-Host "✅ Proyecto movido exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📂 Nueva ubicación:" -ForegroundColor Cyan
    Write-Host $rutaDestino -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Abre Cursor/VS Code" -ForegroundColor White
    Write-Host "2. Abre la carpeta: $rutaDestino" -ForegroundColor White
    Write-Host "3. Ejecuta 'npm run dev' para continuar" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ Error al mover el proyecto:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Sugerencia: Ejecuta PowerShell como Administrador" -ForegroundColor Yellow
    exit 1
}

