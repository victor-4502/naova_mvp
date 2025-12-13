# 🔑 Cómo Generar Contraseña de Aplicación para Gmail

## 🎯 ¿Qué es una Contraseña de Aplicación?

Es una contraseña especial de 16 caracteres que Gmail genera para que aplicaciones externas (como Naova) puedan usar tu correo de forma segura. **NO es tu contraseña normal de Gmail**.

---

## 📋 Pasos Detallados

### Paso 1: Verificar que Tienes Verificación en 2 Pasos Activada

**IMPORTANTE**: Para generar contraseña de aplicación, **debes tener activada la verificación en 2 pasos**.

#### 1.1. Ve a tu cuenta de Google:
🔗 **https://myaccount.google.com/security**

#### 1.2. Busca "Verificación en 2 pasos"
- Debe decir **"Activada"** (en verde)
- Si dice "Desactivada", haz clic y actívala primero

#### 1.3. Activar Verificación en 2 Pasos (si no está activada):
1. Haz clic en "Verificación en 2 pasos"
2. Sigue las instrucciones
3. Te pedirá:
   - Confirmar tu contraseña
   - Agregar un número de teléfono
   - Verificar el teléfono con un código
4. Una vez activada, continúa al Paso 2

---

### Paso 2: Generar la Contraseña de Aplicación

#### 2.1. Ve a Contraseñas de Aplicación:
🔗 **https://myaccount.google.com/apppasswords**

O también puedes:
1. Ir a: https://myaccount.google.com/security
2. Buscar "Contraseñas de aplicaciones"
3. Hacer clic

#### 2.2. Selecciona la Aplicación:
- En el menú desplegable, selecciona: **"Correo"**

#### 2.3. Selecciona el Dispositivo:
- Selecciona: **"Otro (nombre personalizado)"**
- Escribe: **"Naova"** (o cualquier nombre que quieras)
- Haz clic en **"Generar"**

#### 2.4. Copia la Contraseña:
- Gmail te mostrará una contraseña de **16 caracteres**
- Formato: `abcd efgh ijkl mnop` (con espacios)
- O: `abcdefghijklmnop` (sin espacios)

**⚠️ IMPORTANTE**: 
- Copia esta contraseña inmediatamente
- **Solo se muestra UNA VEZ**
- Si la pierdes, tendrás que generar una nueva

---

## 📝 Ejemplo Visual del Proceso

```
1. Ve a: https://myaccount.google.com/apppasswords
   ↓
2. Selecciona "Correo"
   ↓
3. Selecciona "Otro (nombre personalizado)"
   ↓
4. Escribe "Naova"
   ↓
5. Clic en "Generar"
   ↓
6. Copia la contraseña de 16 caracteres
```

---

## ✅ Después de Generar la Contraseña

### Agregar a .env

Abre tu archivo `.env` y agrega:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=solucionesnaova@gmail.com
SMTP_PASS=abcdefghijklmnop  # ← Pega aquí la contraseña de 16 caracteres
SMTP_FROM="Naova" <solucionesnaova@gmail.com>
```

**Nota**: Quita los espacios de la contraseña si los tiene.
- Con espacios: `abcd efgh ijkl mnop` ❌
- Sin espacios: `abcdefghijklmnop` ✅

---

## 🆘 Problemas Comunes

### Problema 1: No Veo la Opción "Contraseñas de Aplicaciones"

**Solución:**
- Debes tener **Verificación en 2 pasos ACTIVADA**
- Si no la tienes activada, no verás esta opción
- Ve a: https://myaccount.google.com/security y actívala primero

### Problema 2: Dice "Esta función no está disponible"

**Posibles causas:**
- Tu cuenta no tiene verificación en 2 pasos activada
- Tu cuenta es una cuenta de organización que bloquea esta función
- Tu cuenta es muy nueva

**Solución:**
- Activa verificación en 2 pasos
- Espera unos días si la cuenta es nueva
- Contacta al administrador si es cuenta de organización

### Problema 3: Perdí la Contraseña

**Solución:**
- Simplemente genera una nueva
- La contraseña antigua dejará de funcionar
- Agrega la nueva al `.env`

### Problema 4: No Funciona la Contraseña

**Solución:**
1. Verifica que copiaste bien (sin espacios)
2. Verifica que usaste la contraseña de aplicación, no tu contraseña normal
3. Genera una nueva contraseña e intenta de nuevo

---

## 🔒 Seguridad

- ✅ La contraseña de aplicación es segura
- ✅ Solo funciona para SMTP (enviar emails)
- ✅ Puedes revocarla cuando quieras
- ✅ Si la pierdes o crees que está comprometida, genera una nueva

---

## 📱 Versión Móvil

Si estás en móvil, el proceso es igual:

1. Abre navegador en móvil
2. Ve a: https://myaccount.google.com/apppasswords
3. Sigue los mismos pasos

---

## ✅ Checklist

- [ ] Tienes verificación en 2 pasos activada
- [ ] Fuiste a https://myaccount.google.com/apppasswords
- [ ] Seleccionaste "Correo"
- [ ] Seleccionaste "Otro (nombre personalizado)"
- [ ] Escribiste "Naova"
- [ ] Generaste la contraseña
- [ ] Copiaste la contraseña de 16 caracteres
- [ ] La agregaste al `.env`

---

## 🎯 Resumen Rápido

1. Ve a: **https://myaccount.google.com/apppasswords**
2. Selecciona: **"Correo"**
3. Selecciona: **"Otro (nombre personalizado)"**
4. Escribe: **"Naova"**
5. Genera y copia la contraseña de **16 caracteres**
6. Pégala en `.env` en `SMTP_PASS`

---

## 💡 Tip Extra

Si ya tienes otras contraseñas de aplicación generadas, puedes verlas y revocarlas en la misma página. Cada aplicación debería tener su propia contraseña.

