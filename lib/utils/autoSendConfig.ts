/**
 * Utilidad para verificar si el envío automático global está habilitado
 * Usa un cache compartido en memoria para evitar dependencias circulares
 */

// Cache compartido en memoria (se resetea al reiniciar el servidor)
// En producción, esto debería guardarse en BD o Redis
let globalAutoSendCache: boolean | null = null

/**
 * Establece el estado del envío automático global
 * @param enabled true para habilitar envío automático, false para deshabilitarlo
 */
export function setGlobalAutoSendCache(enabled: boolean): void {
  globalAutoSendCache = enabled
}

/**
 * Verifica si el envío automático global está habilitado
 * @returns true si los mensajes deben enviarse automáticamente, false si deben quedar como borradores
 */
export function isGlobalAutoSendEnabled(): boolean {
  // Si hay cache, usarlo
  if (globalAutoSendCache !== null) {
    return globalAutoSendCache
  }
  
  // Fallback a variable de entorno
  const envValue = process.env.GLOBAL_AUTO_SEND_ENABLED
  return envValue === 'true'
}

