# Cómo Desactivar Sincronización de OneDrive

## Método 1: Desactivar sincronización para esta carpeta específica

### Pasos:

1. **Abre la configuración de OneDrive:**
   - Haz clic en el ícono de OneDrive en la bandeja del sistema (esquina inferior derecha)
   - O busca "OneDrive" en el menú de inicio y abre "OneDrive"

2. **Ve a la configuración:**
   - Haz clic en el ícono de engranaje (⚙️) o clic derecho en el ícono de OneDrive
   - Selecciona "Configuración" o "Settings"

3. **Ve a la pestaña "Cuenta":**
   - En la ventana de configuración, busca la pestaña "Cuenta" o "Account"

4. **Selecciona "Elegir carpetas":**
   - Haz clic en "Elegir carpetas" o "Choose folders"
   - Esto abrirá una lista de todas las carpetas que OneDrive está sincronizando

5. **Desmarca la carpeta `naova2.0`:**
   - Busca la carpeta `Documents` en la lista
   - Expándela si es necesario
   - Desmarca la carpeta `naova2.0` o toda la carpeta `Documents` si prefieres
   - Haz clic en "Aceptar" o "OK"

6. **Confirma:**
   - OneDrive te preguntará si quieres mantener los archivos en tu PC pero dejar de sincronizarlos
   - Selecciona "Mantener en este dispositivo" o "Keep on this device"
   - Esto mantendrá los archivos en tu PC pero dejará de sincronizarlos con la nube

## Método 2: Mover el proyecto fuera de OneDrive (RECOMENDADO)

### Pasos:

1. **Cierra VS Code/Cursor completamente**

2. **Crea una nueva carpeta fuera de OneDrive:**
   ```powershell
   # Abre PowerShell y ejecuta:
   New-Item -ItemType Directory -Path "C:\Projects" -Force
   ```

3. **Copia el proyecto:**
   ```powershell
   # Desde PowerShell:
   Copy-Item -Path "C:\Users\user\OneDrive\Documents\naova2.0" -Destination "C:\Projects\naova2.0" -Recurse
   ```

4. **Abre el proyecto desde la nueva ubicación:**
   - Abre VS Code/Cursor
   - File > Open Folder
   - Selecciona `C:\Projects\naova2.0`

5. **Actualiza las variables de entorno si es necesario:**
   - El archivo `.env` debería haberse copiado también
   - Verifica que todo esté correcto

6. **Reinicia el servidor:**
   ```powershell
   npm run dev
   ```

## Método 3: Desactivar OneDrive completamente (NO RECOMENDADO)

⚠️ **Advertencia:** Esto desactivará OneDrive para todo tu sistema. Solo hazlo si no necesitas OneDrive para nada más.

1. Abre la configuración de OneDrive
2. Ve a "Cuenta"
3. Haz clic en "Desvincular este PC" o "Unlink this PC"
4. Confirma la acción

## Verificación

Después de desactivar la sincronización:

1. **Verifica que los archivos no se borren:**
   - Abre `middleware.ts` o `app/api/inbox/webhook/email/route.ts`
   - Haz un cambio pequeño
   - Guarda el archivo
   - Espera unos segundos
   - Verifica que el cambio se mantenga

2. **Si los archivos siguen borrándose:**
   - Usa el Método 2 (mover el proyecto fuera de OneDrive)
   - Es la solución más confiable

## Recomendación

**El Método 2 (mover el proyecto) es el más recomendado** porque:
- ✅ Evita completamente los problemas de sincronización
- ✅ No afecta otras carpetas de OneDrive
- ✅ Es más rápido para proyectos de desarrollo
- ✅ Evita conflictos con archivos que cambian frecuentemente


