# 🧪 Cómo Probar el Email Después del Deploy

## ✅ Lo que Ya Está Configurado

- ✅ SMTP configurado con `solucionesnaova@gmail.com`
- ✅ Sistema listo para **ENVIAR** emails desde la plataforma

---

## 🧪 Prueba de Envío de Emails

### Paso 1: Ir a la Plataforma

1. Ve a tu sitio en producción: `https://www.naova.com.mx/admin/requests`
2. O en local: `http://localhost:3000/admin/requests`

### Paso 2: Abrir un Request

- Abre cualquier request existente
- O crea uno de prueba si no hay ninguno

### Paso 3: Enviar Mensaje de Prueba

1. En la página del request, busca el área para enviar mensaje
2. Escribe un mensaje de prueba (ej: "Hola, este es un email de prueba")
3. Haz clic en "Enviar"

### Paso 4: Verificar

**Si el request es de EMAIL:**
- ✅ El sistema debería enviar el email automáticamente
- ✅ Verifica en los logs si hubo errores
- ✅ El cliente debería recibir el email en su buzón

**Si el request NO es de email:**
- El mensaje se guardará en la BD pero no se enviará email
- Para probar envío, necesitas un request que vino por email

---

## 📊 Ver Logs para Diagnosticar

### En Vercel (Producción):

1. Ve a tu proyecto en Vercel
2. Haz clic en "Logs" o "Deployment Logs"
3. Busca líneas que digan:
   ```
   [EmailService] Email enviado exitosamente
   ```
   o
   ```
   [EmailService] Error enviando email
   ```

### En Local:

- Mira la consola donde corre `npm run dev`
- Deberías ver logs sobre el envío del email

---

## ✅ Qué Esperar

### Si Todo Funciona:

```
✅ El mensaje se guarda en la BD
✅ El email se envía desde solucionesnaova@gmail.com
✅ El cliente recibe el email
✅ Los logs muestran: "Email enviado exitosamente"
```

### Si Hay Problemas:

**Error: "SMTP not configured"**
- Las variables de entorno no están en Vercel
- Agrégalas en Vercel → Settings → Environment Variables

**Error: "Authentication failed"**
- La contraseña de aplicación está incorrecta
- Verifica que copiaste bien la contraseña (sin espacios)

**Error: "Connection timeout"**
- Problema de red o credenciales incorrectas
- Verifica SMTP_HOST y SMTP_PORT

---

## 📝 Próximos Pasos

### Ya Listo:
- ✅ Enviar emails desde la plataforma

### Falta Configurar:
- ⏳ Recibir emails (configurar webhook)
- ⏳ Continuación de conversaciones por email (ya implementado, solo falta probar)

---

## 🎯 Resumen

**AHORA puedes:**
- ✅ Responder a clientes por email desde la plataforma
- ✅ Los emails se enviarán desde `solucionesnaova@gmail.com`

**DESPUÉS podrás:**
- 📨 Recibir emails y crear requests automáticamente
- 📨 Responder a emails recibidos

---

¡Todo listo para probar! 🚀

