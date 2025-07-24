/**
 * Obtiene el idioma del documento HTML.
 * Retorna el código ISO 639-1 (dos letras) basado en <html lang="...">
 * Por defecto retorna 'es'.
 * @returns {string} Idioma de la página (ej. 'es', 'eu', 'en')
 */
export function lang() {
  let idioma = document.documentElement.lang || 'es';
  if (idioma.length > 2) {
    idioma = idioma.substring(0, 2);
  }
  return idioma;
}
