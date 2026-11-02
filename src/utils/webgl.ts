/**
 * Utilitário de detecção segura de suporte a WebGL.
 * Cria um canvas efêmero isolado para verificar compatibilidade
 * sem interferir no canvas real da aplicação ou bloquear o contexto.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    return !!(gl && gl instanceof WebGLRenderingContext || (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext));
  } catch (e) {
    console.warn('[ATELIER WebGL] Falha ao verificar contexto WebGL:', e);
    return false;
  }
}
