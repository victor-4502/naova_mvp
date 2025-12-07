# 🔧 Solución: Error 500 al Enviar Mensaje de WhatsApp

## ❌ Problema

Al intentar enviar un mensaje desde la página de detalle del request de WhatsApp, se obtiene:

```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Error sending reply: Error: Error al crear mensaje
```

## 🔍 Diagnóstico

1. **El mensaje de WhatsApp se recibió correctamente** ✅
   - Request ID: `cmiw1ornm0000aeob9nli93e2`
   - Número guardado: `5213312283639`
   - Contenido: "Hola prueba"

2. **El request aparece en `/admin/requests`** ✅
   - Estado: "Sin cliente" (normal, el número no está registrado como cliente)

3. **El error ocurre al intentar responder** ❌
   - Error 500 al crear el mensaje de respuesta

## 🔧 Soluciones Posibles

### 1. Verificar los Logs de Vercel

Ve a los logs de Vercel y busca el error específico:

1. Ve a tu proyecto en Vercel
2. Haz clic en "Logs" o "Deployment Logs"
3. Busca la entrada más reciente con error 500
4. Busca líneas que digan:
   - `[Create Message] Error al crear mensaje:`
   - `Error completo:`
   - `Error de Prisma:`

### 2. Errores Comunes

#### Error A: Número no encontrado

Si ves en los logs:
```
[Create Message] No se encontró número en el mensaje original para WhatsApp
```

**Solución:** Verificar que el mensaje original tenga el campo `from` guardado.

#### Error B: Error de Prisma

Si ves un error de Prisma (ej: `P2002`, `P2003`):

**Solución:** Puede ser un problema de constraint o foreign key. Revisar el schema de Prisma.

#### Error C: Error al enviar por WhatsApp

Si ves:
```
[WhatsAppService] Error enviando mensaje
```

**Solución:** Puede ser un problema con:
- El token de acceso (verificar que no haya expirado)
- El formato del número
- La ventana de 24 horas cerrada

### 3. Verificar que el Número se Obtiene Correctamente

El código ya está actualizado para obtener el número del mensaje original, incluso si no hay cliente asignado.

El número debería ser: `5213312283639`

## ✅ Pasos para Diagnosticar

1. **Ejecuta el script de diagnóstico:**
   ```bash
   npx tsx scripts/diagnosticar-mensaje-error.ts cmiw1ornm0000aeob9nli93e2
   ```

2. **Revisa los logs de Vercel:**
   - Ve a tu proyecto en Vercel
   - Busca el error 500 más reciente
   - Copia el error completo

3. **Comparte el error:**
   - Pega aquí el error completo que aparece en los logs

## 🔄 Código Actualizado

El código ya está actualizado para:
- ✅ Obtener el número del mensaje original incluso sin cliente
- ✅ Manejar errores con logging detallado
- ✅ Normalizar el número antes de enviarlo

## 📝 Próximos Pasos

1. Revisar los logs de Vercel para el error específico
2. Si el error persiste, compartir el mensaje de error completo
3. Verificar que las variables de entorno estén configuradas correctamente

## 🆘 Si Necesitas Ayuda

Comparte:
1. El error completo de los logs de Vercel
2. El Request ID: `cmiw1ornm0000aeob9nli93e2`
3. Qué mensaje intentaste enviar

