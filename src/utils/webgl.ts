/**
 * Utilitário de detecção segura e isolada de suporte a WebGL / WebGL2.
 * - Realiza teste em canvas efêmero isolado.
 * - Desaloca o contexto de teste imediatamente através da extensão WEBGL_lose_context.
 * - Armazena o resultado em cache para evitar vazamento de contextos em chamadas subsequentes.
 */

let cachedSupport: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  if (cachedSupport !== null) return cachedSupport;

  try {
    // 1. Tenta WebGL2 em canvas isolado
    const canvas2 = document.createElement('canvas');
    const gl2 = canvas2.getContext('webgl2');
    if (gl2 && typeof WebGL2RenderingContext !== 'undefined' && gl2 instanceof WebGL2RenderingContext) {
      const loseExt = gl2.getExtension('WEBGL_lose_context');
      loseExt?.loseContext();
      cachedSupport = true;
      return true;
    }

    // 2. Se falhar, tenta WebGL1 em um segundo canvas isolado
    const canvas1 = document.createElement('canvas');
    const gl1 =
      canvas1.getContext('webgl') ||
      canvas1.getContext('experimental-webgl');

    if (gl1 && gl1 instanceof WebGLRenderingContext) {
      const loseExt = gl1.getExtension('WEBGL_lose_context');
      loseExt?.loseContext();
      cachedSupport = true;
      return true;
    }

    cachedSupport = false;
    return false;
  } catch (e) {
    console.warn('[ATELIER WebGL] Falha ao verificar suporte a WebGL:', e);
    cachedSupport = false;
    return false;
  }
}

/** Permite resetar o cache em cenários de teste unitário */
export function _resetWebGLCache(): void {
  cachedSupport = null;
}
