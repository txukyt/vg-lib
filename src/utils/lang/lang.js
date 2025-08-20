export function lang() {
  let idioma = document.documentElement.lang || 'es';
  if (idioma.length > 2) {
    idioma = idioma.substring(0, 2);
  }
  return idioma;
}
