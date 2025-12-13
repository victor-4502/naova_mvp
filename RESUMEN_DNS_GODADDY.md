# 📋 Resumen Rápido: Registros DNS para GoDaddy

## 🎯 Registros que Necesitas Agregar (en orden)

### ✅ Registro 1: DKIM (Verificación)
```
Tipo: TXT
Nombre: resend._domainkey
Valor: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfUcAe+lymGX2jTnxjiHlAJLrcIjFp5eH16tz6sPHZ6nHT5o54RAjr6VRgOiiTROXpab/mnBCUkdvFHNB9dI/keQN2pssg06o/UqJho37pVHueOyPPSXq1NUvpkaeR1579BQqmOighHXv/R++0G/If1FaqjuH04cmJ/qy724vcCQIDAQAB
TTL: Déjalo como está
```

### ✅ Registro 2: MX para Envío
```
Tipo: MX
Nombre: send
Valor: feedback-smtp.us-east-1.amazonses.com
Prioridad: 10
TTL: 60
```

### ✅ Registro 3: TXT para SPF (Envío)
```
Tipo: TXT
Nombre: send
Valor: v=spf1 include:amazonses.com ~all
TTL: 60
```

### ✅ Registro 4: DMARC (Opcional)
```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=none;
TTL: Déjalo como está
```

### 🔴 Registro 5: MX para RECEPCIÓN (MUY IMPORTANTE)
```
Tipo: MX
Nombre: @ (o déjalo vacío)
Valor: inbound-smtp.us-east-1.amazonaws.com
Prioridad: 10
TTL: 60
```

**⚠️ Este es el MÁS IMPORTANTE para recibir emails!**

---

## 🚀 Pasos Rápidos en GoDaddy

1. **Ve a**: https://www.godaddy.com → Inicia sesión
2. **Ve a**: "Mis Productos" → Busca `naova.com.mx` → Haz clic en "DNS"
3. **Agrega los 5 registros** uno por uno (ver arriba)
4. **Espera** 10-30 minutos
5. **Verifica** en Resend que el dominio está verificado

---

## 📖 Guía Completa

Para instrucciones detalladas paso a paso, abre:
**`CONFIGURAR_DNS_GODADDY_RESEND.md`**

---

## ✅ Checklist

- [ ] Registro 1: TXT `resend._domainkey` agregado
- [ ] Registro 2: MX `send` agregado
- [ ] Registro 3: TXT `send` agregado
- [ ] Registro 4: TXT `_dmarc` agregado (opcional)
- [ ] Registro 5: MX `@` agregado ← **IMPORTANTE**
- [ ] Esperé 10-30 minutos
- [ ] Verifiqué en Resend

---

¡Vamos paso a paso!

