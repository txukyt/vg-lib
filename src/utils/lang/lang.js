export function getLang() {
  let idioma = document.documentElement.lang || 'es';
  if (idioma.length > 2) {
    idioma = idioma.substring(0, 2);
  }
  return idioma;
}

export function changeLang(lang) {
  const url = new URL(window.location.href);

  url.searchParams.set('lang', lang);
  url.searchParams.set('locale', lang);
  url.searchParams.set('idioma', lang);

  window.location.href = url.toString();
}
