# Cómo Deshabilitar OneDrive para el Proyecto

## Problema
OneDrive está sincronizando la carpeta del proyecto y causando corrupción de archivos durante la edición.

## Soluciones

### OPCIÓN 1: Excluir carpeta de sincronización (RECOMENDADO)

1. **Abre OneDrive:**
   - Haz clic en el ícono de OneDrive en la bandeja del sistema (esquina inferior derecha)
   - O busca "OneDrive" en el menú de inicio

2. **Accede a Configuración:**
   - Clic derecho en el ícono de OneDrive > **Configuración**
   - O abre OneDrive y ve a **Configuración** > **Cuenta**

3. **Elige carpetas:**
   - Ve a la pestaña **"Cuenta"**
   - Haz clic en **"Elegir carpetas"** o **"Administrar sincronización"**

4. **Excluye la carpeta:**
   - Desmarca la carpeta **"Documents"** completa, O
   - Si solo quieres excluir el proyecto, busca una opción de "Excluir carpeta" y agrega:
     ```
     Documents\naova2.0
     ```

### OPCIÓN 2: Mover proyecto fuera de OneDrive (MEJOR OPCIÓN)

1. **Cierra el servidor de desarrollo** (si está corriendo)

2. **Crea una nueva carpeta fuera de OneDrive:**
   ```
   C:\dev\naova2.0
   ```
   O
   ```
   C:\projects\naova2.0
   ```

3. **Mueve el proyecto:**
   - Abre PowerShell como administrador
   - Ejecuta:
     ```powershell
     Move-Item "C:\Users\user\OneDrive\Documents\naova2.0" "C:\dev\naova2.0"
     ```

4. **Actualiza la ruta en tu editor:**
   - Abre el proyecto desde la nueva ubicación
   - Vercel y otras configuraciones seguirán funcionando igual

### OPCIÓN 3: Pausar sincronización temporalmente

1. **Clic derecho en el ícono de OneDrive** (bandeja del sistema)

2. **Selecciona:**
   - **"Pausar sincronización"** > **"2 horas"** o **"8 horas"**

3. **Nota:** Esto es temporal, tendrás que repetirlo cada vez

### OPCIÓN 4: Desactivar OneDrive completamente (NO RECOMENDADO)

⚠️ **Solo si no usas OneDrive para nada más**

1. Presiona `Win + R`
2. Escribe: `ms-settings:storagesense`
3. Ve a **"Sincronización de archivos"**
4. Desactiva **"Guardar archivos en OneDrive"**

---

## Recomendación

**Usa la OPCIÓN 2** (mover proyecto fuera de OneDrive). Es la solución más permanente y evita cualquier problema de sincronización.

**Ruta actual del proyecto:**
```
C:\Users\user\OneDrive\Documents\naova2.0
```

**Ruta recomendada:**
```
C:\dev\naova2.0
```

---

## Después de mover el proyecto

1. Abre la nueva ubicación en tu editor (Cursor/VS Code)
2. El servidor de desarrollo seguirá funcionando igual
3. Git y todas las configuraciones se mantienen
4. Vercel seguirá funcionando (solo actualiza la ruta si usas CLI local)

