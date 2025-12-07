# 🧪 Prueba Completa de Webhooks

## 📋 Objetivo

Verificar que:
1. ✅ Los webhooks de WhatsApp y Email funcionen correctamente
2. ✅ Los requests se creen en la base de datos
3. ✅ Los requests aparezcan en `/admin/requests`
4. ✅ Los mensajes automáticos se generen cuando falte información

---

## ⚠️ PREREQUISITOS

### 1. Servidor Corriendo

Asegúrate de que el servidor de desarrollo esté corriendo:

```powershell
npm run dev
```

Debería estar en `http://localhost:3000`

### 2. Base de Datos Configurada

**IMPORTANTE:** La columna `sourceId` debe existir en la tabla `Request`.

**Si no la has agregado, ejecuta esto en Supabase SQL Editor:**

```sql
ALTER TABLE "Request" 
ADD COLUMN IF NOT EXISTS "sourceId" TEXT;
```

**Luego sincroniza Prisma:**

```powershell
npx prisma db push
```

### 3. Cliente con Contactos Adicionales

Debe existir un cliente con:
- Al menos un contacto adicional de tipo `phone` (para WhatsApp)
- Al menos un contacto adicional de tipo `email` (para Email)

---

## 🚀 PASOS DE PRUEBA

### Paso 1: Verificar que el Servidor Está Corriendo

```powershell
# Verifica que no haya error en la consola del servidor
# Deberías ver algo como:
# ✓ Ready in 2.5s
# ○ Compiling / ...
# ○ Local: http://localhost:3000
```

### Paso 2: Ejecutar Prueba de WhatsApp

```powershell
npm run test:webhook:whatsapp
```

**Qué debería pasar:**
- ✅ Encuentra un cliente con contacto adicional de teléfono
- ✅ Simula un payload de WhatsApp
- ✅ Envía el webhook a `http://localhost:3000/api/inbox/webhook/whatsapp`
- ✅ Recibe respuesta exitosa (status 200)
- ✅ Muestra el ID del request creado

**Ejemplo de salida esperada:**
```
🧪 Probando webhook de WhatsApp desde un CONTACTO ADICIONAL del cliente...

✅ Cliente encontrado: Operador Naova
   Email principal: operador@naova.com
   Teléfono principal: 3312283639
   📱 Usando contacto adicional: 3315993127 (Teléfono adicional)

📱 Payload de WhatsApp simulado: {...}

🌐 Enviando a: http://localhost:3000/api/inbox/webhook/whatsapp

✅ Webhook recibido correctamente:
{
  "success": true,
  "requestId": "clxxxxx..."
}
```

### Paso 3: Ejecutar Prueba de Email

```powershell
npm run test:webhook:email
```

**Qué debería pasar:**
- ✅ Encuentra un cliente con contacto adicional de email
- ✅ Simula un payload de email
- ✅ Envía el webhook a `http://localhost:3000/api/inbox/webhook/email`
- ✅ Recibe respuesta exitosa (status 200)
- ✅ Muestra el ID del request creado

### Paso 4: Verificar en `/admin/requests`

1. **Abre tu navegador:**
   ```
   http://localhost:3000/admin/requests
   ```

2. **Verifica que aparezcan los requests:**
   - ✅ Deberías ver 2 requests nuevos (uno de WhatsApp y uno de Email)
   - ✅ Cada request debe mostrar:
     - Badge con el canal (WhatsApp o Email)
     - Contenido del mensaje
     - Cliente asociado
     - Fecha y hora
     - Estado del request

3. **Verifica mensajes automáticos:**
   - ✅ Si el mensaje es incompleto (como "Necesito servicio de mantenimiento"), deberías ver:
     - Una sección "Mensaje sugerido para pedir información faltante"
     - Un texto con preguntas sobre los datos faltantes
     - Un checkbox "Activar respuesta automática por el mismo canal"

---

## ✅ VERIFICACIÓN COMPLETA

### Checklist de Pruebas

- [ ] Servidor corriendo sin errores
- [ ] Columna `sourceId` existe en la BD
- [ ] Existe un cliente con contactos adicionales
- [ ] Prueba de WhatsApp ejecutada exitosamente
- [ ] Prueba de Email ejecutada exitosamente
- [ ] Los requests aparecen en `/admin/requests`
- [ ] Los requests muestran el canal correcto (WhatsApp/Email)
- [ ] Los requests tienen el cliente asociado
- [ ] Los mensajes automáticos se generan para requests incompletos
- [ ] El checkbox de auto-respuesta funciona

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "The column `sourceId` does not exist"

**Solución:**
1. Ejecuta en Supabase SQL Editor:
   ```sql
   ALTER TABLE "Request" ADD COLUMN IF NOT EXISTS "sourceId" TEXT;
   ```
2. Luego:
   ```powershell
   npx prisma db push
   ```

### Error: "Cliente no encontrado"

**Solución:**
1. Ve a `/admin/clients`
2. Crea un cliente o agrega contactos adicionales a uno existente
3. Asegúrate de agregar:
   - Un contacto de tipo "phone" para WhatsApp
   - Un contacto de tipo "email" para Email

### Error: "Error al procesar webhook"

**Solución:**
1. Revisa la consola del servidor para ver el error específico
2. Verifica que todas las tablas existan en la BD
3. Verifica que el schema de Prisma esté sincronizado:
   ```powershell
   npx prisma db push
   ```

### Los requests no aparecen en `/admin/requests`

**Solución:**
1. Recarga la página
2. Verifica que no haya errores en la consola del navegador
3. Verifica que la API `/api/admin/requests` funcione:
   - Abre `http://localhost:3000/api/admin/requests` en el navegador
   - Deberías ver un JSON con los requests

---

## 📊 RESULTADOS ESPERADOS

Después de ejecutar las pruebas, deberías tener:

1. **2 requests nuevos** en `/admin/requests`:
   - Uno con badge "WhatsApp" 
   - Uno con badge "Email"

2. **Cliente asociado correctamente:**
   - Ambos requests deben mostrar el mismo cliente
   - El cliente debe ser el que tiene los contactos adicionales

3. **Mensajes automáticos generados:**
   - Si el mensaje es incompleto, deberías ver un mensaje sugerido
   - El mensaje debe pedir los datos faltantes

---

## 🎯 SIGUIENTE PASO

Una vez que todo funcione:
1. Verifica que puedas activar la auto-respuesta desde `/admin/requests`
2. Prueba con mensajes más completos para ver cómo se comporta
3. Verifica que los mensajes se envíen realmente por WhatsApp/Email (cuando implementes esa funcionalidad)

---

**¿Todo funcionando? ¡Excelente! 🎉**

