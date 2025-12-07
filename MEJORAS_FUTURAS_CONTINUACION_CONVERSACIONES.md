# 🚀 Mejoras Futuras: Continuación de Conversaciones Inteligente

## 🎯 Problemas con la Lógica Actual (Solo por Tiempo)

La lógica actual usa **solo el tiempo** (7 días) para determinar si un mensaje es nuevo o viejo. Esto tiene limitaciones:

### ❌ Problema 1: Nuevo Request en Menos de 7 Días

**Situación:**
```
Lunes 10:00 AM
Cliente: "Necesito tornillos"
→ Request #123 creado

Martes 2:00 PM (1 día después)
Cliente: "Necesito también tuercas" (NUEVA solicitud)
→ ❌ Se agregaría a Request #123 (INCORRECTO)
```

**Problema:** El cliente quiere hacer una **nueva solicitud** pero como hay menos de 7 días, se agrega al request anterior.

### ❌ Problema 2: Respuesta Tardía a Request Antiguo

**Situación:**
```
Lunes 10:00 AM
Cliente: "Necesito tornillos"
→ Request #123 creado
Naova: "¿Qué tipo de tornillos?"
→ Cliente no responde...

Lunes siguiente (8 días después)
Cliente: "De acero inoxidable" (RESPUESTA al request anterior)
→ ❌ Se crea Request #124 (INCORRECTO)
```

**Problema:** El cliente está **respondiendo** a una pregunta anterior, pero como pasaron más de 7 días, se crea un nuevo request.

---

## ✅ Solución Propuesta: Análisis Inteligente con IA

### Enfoque Híbrido

Combinar múltiples señales para decidir:

1. **Análisis del Contenido** (IA) - Principal
2. **Contexto del Request Anterior** - Complementario
3. **Tiempo Transcurrido** - Ajuste fino

---

## 🔍 Análisis del Contenido (IA)

### Señales de "Continuación" (Es Viejo)

El mensaje parece ser una **respuesta o continuación** si contiene:

- ✅ Respuestas directas a preguntas:
  - "Sí, esos"
  - "Para el viernes"
  - "De acero inoxidable"
  - "100 unidades"

- ✅ Referencias al tema anterior:
  - "De lo que hablamos antes"
  - "Sobre el pedido anterior"
  - "Eso que te pedí"

- ✅ Aclaraciones/correcciones:
  - "Mejor cambia a..."
  - "Corrige, necesito..."
  - "Olvida lo anterior"

- ✅ Continuación de conversación:
  - "También necesito..."
  - "Y además..."
  - "A eso agrega..."

### Señales de "Nuevo Request" (Es Nuevo)

El mensaje parece ser una **nueva solicitud** si contiene:

- ✅ Nuevos temas/productos:
  - "Ahora necesito..." (cambio de tema)
  - "También quiero..." (nuevo producto diferente)
  - "Aparte, necesito..." (nuevo requerimiento)

- ✅ Inicio de nueva conversación:
  - "Hola, necesito..."
  - "Quiero hacer un nuevo pedido"
  - "Tengo otra solicitud"

- ✅ Contexto diferente:
  - Menciona productos/categorías diferentes
  - Tiene urgencia diferente
  - Es para un proyecto diferente

---

## 📊 Algoritmo Propuesto

### Paso 1: Analizar Contenido con IA

```typescript
async function analyzeMessageIntent(
  newMessage: string,
  existingRequest: Request,
  conversationHistory: Message[]
): Promise<'continuation' | 'new_request' | 'unclear'> {
  
  // Analizar el contenido del mensaje
  const analysis = await AIService.analyzeIntent({
    message: newMessage,
    context: {
      previousRequest: existingRequest,
      lastMessages: conversationHistory.slice(-5), // Últimos 5 mensajes
      timeSinceLastMessage: timeDifference,
    }
  })
  
  return analysis.intent // 'continuation' | 'new_request'
}
```

### Paso 2: Combinar Señales

```typescript
async function shouldContinueExistingRequest(
  newMessage: string,
  activeRequest: Request,
  timeDifference: number
): Promise<boolean> {
  
  // 1. Análisis de IA (peso: 70%)
  const aiAnalysis = await analyzeMessageIntent(newMessage, activeRequest)
  
  // 2. Análisis de tiempo (peso: 20%)
  const timeScore = timeDifference < 1 ? 1.0 : timeDifference < 7 ? 0.8 : 0.3
  
  // 3. Análisis de contexto (peso: 10%)
  const contextScore = analyzeContext(newMessage, activeRequest)
  
  // Combinar scores
  const finalScore = 
    (aiAnalysis.confidence * 0.7) +
    (timeScore * 0.2) +
    (contextScore * 0.1)
  
  return finalScore > 0.6 // Threshold ajustable
}
```

### Paso 3: Decisión Final

```typescript
// Buscar requests activos
const activeRequests = await findActiveRequests(phoneNumber)

if (activeRequests.length > 0) {
  // Para cada request activo, analizar si el mensaje es continuación
  for (const request of activeRequests) {
    const shouldContinue = await shouldContinueExistingRequest(
      newMessage,
      request,
      timeDifference
    )
    
    if (shouldContinue) {
      // ✅ Es continuación → Agregar a request existente
      return addToExistingRequest(request.id, newMessage)
    }
  }
  
  // Si ningún request parece ser continuación, crear nuevo
  return createNewRequest(newMessage)
} else {
  // No hay requests activos → Crear nuevo
  return createNewRequest(newMessage)
}
```

---

## 🤖 Integración con IA

### Opción 1: OpenAI GPT

```typescript
async function analyzeWithGPT(message: string, context: RequestContext) {
  const prompt = `
Analiza si el siguiente mensaje es una CONTINUACIÓN de una conversación existente 
o una NUEVA solicitud.

Mensaje nuevo: "${message}"

Contexto de conversación anterior:
- Tema: ${context.category}
- Último mensaje de Naova: "${context.lastNaovaMessage}"
- Último mensaje del cliente: "${context.lastClientMessage}"
- Tiempo desde último mensaje: ${context.timeSinceLastMessage} días

Responde SOLO con una de estas opciones:
- "CONTINUATION" si es una respuesta o continuación
- "NEW_REQUEST" si es una nueva solicitud
- "UNCLEAR" si no está claro

Tu respuesta:
  `
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3, // Bajo para más consistencia
  })
  
  return response.choices[0].message.content
}
```

### Opción 2: Análisis con Keywords + Embeddings

```typescript
async function analyzeWithEmbeddings(message: string, context: RequestContext) {
  // 1. Obtener embedding del mensaje nuevo
  const newMessageEmbedding = await getEmbedding(message)
  
  // 2. Obtener embedding del contexto anterior
  const contextText = `${context.category} ${context.lastNaovaMessage} ${context.lastClientMessage}`
  const contextEmbedding = await getEmbedding(contextText)
  
  // 3. Calcular similitud (cosine similarity)
  const similarity = cosineSimilarity(newMessageEmbedding, contextEmbedding)
  
  // 4. Si similitud alta (>0.7) → Es continuación
  if (similarity > 0.7) {
    return 'continuation'
  }
  
  // 5. Análisis adicional con keywords
  const keywords = extractKeywords(message)
  const isResponse = checkIfResponse(keywords) // "sí", "no", "para el viernes", etc.
  
  return isResponse ? 'continuation' : 'new_request'
}
```

---

## 📋 Casos de Uso Mejorados

### Caso 1: Nuevo Request en Menos de 7 Días ✅

```
Lunes 10:00 AM
Cliente: "Necesito tornillos"
→ Request #123 creado

Martes 2:00 PM (1 día después)
Cliente: "Ahora también necesito tuercas para otro proyecto"

Análisis IA:
- Palabras clave: "ahora también", "otro proyecto"
- Intent: NEW_REQUEST
- Tiempo: 1 día (no importa mucho)

Resultado: ✅ Crea Request #124 (correcto)
```

### Caso 2: Respuesta Tardía ✅

```
Lunes 10:00 AM
Cliente: "Necesito tornillos"
Naova: "¿Qué tipo?"
→ Cliente no responde...

Lunes siguiente (8 días después)
Cliente: "De acero inoxidable"

Análisis IA:
- Palabras clave: "De acero inoxidable" (respuesta directa)
- Contexto: Último mensaje de Naova fue una pregunta
- Intent: CONTINUATION
- Tiempo: 8 días (más de 7, pero el análisis prevalece)

Resultado: ✅ Agrega a Request #123 (correcto)
```

### Caso 3: Continuación Normal ✅

```
Lunes 10:00 AM
Cliente: "Necesito tornillos"
Naova: "¿Cuántos?"
Martes 2:00 PM (1 día después)
Cliente: "100 unidades"

Análisis IA:
- Respuesta directa: "100 unidades"
- Contexto: Naova preguntó cantidad
- Intent: CONTINUATION

Resultado: ✅ Agrega a Request #123 (correcto)
```

---

## 🎯 Implementación por Fases

### Fase 1: Mejoras Básicas (Sin IA)

1. **Análisis de keywords simples**
   - Detectar palabras de respuesta ("sí", "no", "para el...", etc.)
   - Detectar palabras de nuevo request ("ahora", "también", "otro", etc.)

2. **Contexto del último mensaje**
   - Si Naova hizo una pregunta → Es probable continuación
   - Si fue la última interacción del cliente → Puede ser nuevo

3. **Ajuste de tiempo según contexto**
   - Si hay pregunta pendiente → Extender ventana a 14 días
   - Si request está completo → Reducir ventana a 3 días

### Fase 2: IA Ligera (Embeddings)

1. **Análisis de similitud semántica**
   - Comparar embedding del mensaje con contexto anterior
   - Si similitud alta → Continuación

2. **Análisis de intención básico**
   - Clasificar: respuesta, nueva solicitud, aclaración

### Fase 3: IA Completa (GPT)

1. **Análisis contextual completo**
   - Considerar toda la conversación
   - Entender referencias implícitas
   - Detectar cambios de tema

2. **Aprendizaje continuo**
   - Ajustar threshold según resultados
   - Mejorar prompts con ejemplos

---

## 💡 Sugerencias de Implementación Inmediata

### Mejora Rápida 1: Análisis de Keywords

```typescript
function isLikelyContinuation(message: string, lastNaovaMessage: string): boolean {
  const responseKeywords = [
    'sí', 'no', 'correcto', 'exacto', 'para el', 'el día', 
    'esos', 'esas', 'ese', 'esa', 'de', 'con'
  ]
  
  const newRequestKeywords = [
    'ahora', 'también', 'otro', 'otra', 'nuevo', 'nueva',
    'aparte', 'además', 'quiero hacer', 'necesito hacer'
  ]
  
  const lowerMessage = message.toLowerCase()
  
  // Si contiene palabras de respuesta y Naova hizo pregunta
  if (lastNaovaMessage.includes('?')) {
    if (responseKeywords.some(kw => lowerMessage.includes(kw))) {
      return true // Probable continuación
    }
  }
  
  // Si contiene palabras de nuevo request
  if (newRequestKeywords.some(kw => lowerMessage.includes(kw))) {
    return false // Probable nuevo request
  }
  
  return null // No está claro
}
```

### Mejora Rápida 2: Ventana de Tiempo Inteligente

```typescript
function getTimeWindow(request: Request): number {
  // Si hay pregunta pendiente de Naova → 14 días
  const lastMessage = request.messages[request.messages.length - 1]
  if (lastMessage.direction === 'outbound' && lastMessage.content.includes('?')) {
    return 14 // Extender ventana
  }
  
  // Si request está completo → 3 días
  if (request.pipelineStage === 'delivered' || request.pipelineStage === 'closed') {
    return 3 // Reducir ventana
  }
  
  // Por defecto: 7 días
  return 7
}
```

---

## 📊 Métricas para Evaluar

Una vez implementado, medir:

1. **Precisión**: % de decisiones correctas
2. **Falsos positivos**: Mensajes nuevos agregados a requests viejos
3. **Falsos negativos**: Continuaciones creadas como nuevos requests
4. **Tiempo de respuesta**: Latencia del análisis

---

## 🎯 Conclusión

La lógica actual (solo tiempo) es un buen **primer paso**, pero tiene limitaciones claras. 

**Mejora recomendada:**
1. **Corto plazo**: Análisis de keywords + ventana de tiempo inteligente
2. **Mediano plazo**: IA con embeddings para similitud semántica
3. **Largo plazo**: GPT para análisis contextual completo

La combinación de múltiples señales (contenido + tiempo + contexto) será mucho más robusta y precisa.

