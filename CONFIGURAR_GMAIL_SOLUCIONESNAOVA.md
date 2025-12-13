# 📧 Configurar solucionesnaova@gmail.com para Enviar Emails

## 🎯 Paso a Paso

### Paso 1: Generar Contraseña de Aplicación

Para usar Gmail con SMTP, necesitas una **contraseña de aplicación** (no tu contraseña normal).

1. **Ve a tu cuenta de Google:**
   - https://myaccount.google.com/apppasswords
   - O ve a: Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones

2. **Si no tienes verificación en 2 pasos:**
   - Primero actívala: https://myaccount.google.com/security
   - Luego genera la contraseña de aplicación

3. **Genera la contraseña:**
   - Selecciona "Correo"
   - Selecciona "Otro (nombre personalizado)"
   - Escribe: "Naova"
   - Haz clic en "Generar"
   - **Copia la contraseña de 16 caracteres** (ej: `abcd efgh ijkl mnop`)

### Paso 2: Agregar a .env

Agrega estas líneas a tu archivo `.env` o `.env.local`:

```env
# Configuración SMTP para ENVIAR emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=solucionesnaova@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion-aqui
SMTP_FROM="Naova" <solucionesnaova@gmail.com>
```

**⚠️ IMPORTANTE:**
- Reemplaza `tu-contraseña-de-aplicacion-aqui` con la contraseña de 16 caracteres que copiaste
- Quita los espacios de la contraseña si los tiene

### Paso 3: Probar

1. Reinicia tu servidor de desarrollo (si está corriendo)
2. Ve a la plataforma admin
3. Abre un request
4. Intenta enviar un mensaje
5. Verifica que se envíe el email

---

## ✅ Configuración Completa

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=solucionesnaova@gmail.com
SMTP_PASS=ABCDEFGHIJKLMNOP
SMTP_FROM="Naova" <solucionesnaova@gmail.com>
```

---

## 🔒 Seguridad

- ✅ La contraseña de aplicación es segura (solo funciona para SMTP)
- ✅ No uses tu contraseña normal de Gmail
- ✅ Puedes revocar la contraseña cuando quieras

---

## 🆘 Si No Funciona

1. **Verifica que tengas verificación en 2 pasos activada**
2. **Verifica que la contraseña no tenga espacios**
3. **Revisa los logs del servidor para ver el error**

