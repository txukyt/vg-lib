import i18next from 'i18next';
import { lang } from '@/utils/lang/lang.js';

import es from './locales/es.json';
import eu from './locales/eu.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

const resources = {
  es: { global: es },
  eu: { global: eu },
  en: { global: en },
  fr: { global: fr },
};

export async function init() {
  await i18next.init({
    lng: lang(),
    fallbackLng: 'es',
    defaultNS: "global",
    debug: false,
    resources,
  });
}

/**
 * Extiende i18next con un nuevo namespace (p.ej. traducciones por componente)
 * @param {string} namespace - Nombre del namespace (ej: 'Button')
 * @param {object} translationsByLang - Objeto con traducciones por idioma, p.ej. { es: {...}, en: {...} }
 */
export function extendI18next(namespace, translationsByLang) {
  Object.entries(translationsByLang).forEach(([lng, translations]) => {
    const hasNamespace = i18next.hasResourceBundle(lng, namespace);
    if (!hasNamespace) {
      i18next.addResourceBundle(lng, namespace, translations);
    } else {
      // Para evitar sobrescribir, se puede hacer merge si quieres
      const existing = i18next.getResourceBundle(lng, namespace);
      i18next.addResourceBundle(lng, namespace, { ...existing, ...translations }, true, true);
    }
  });
}

/**
 * Traducción con soporte para clave sola, parámetros y defaultValue.
 *
 * @param {string} key - Clave de traducción.
 * @param {object} [options] - Parámetros de interpolación y opciones.
 * @returns {string}
 */
export function t(key, options = {}) {
  if (typeof options !== 'object') {
    throw new Error('Second argument must be an object if provided');
  }

  return i18next.t(key, options);
}

export function getI18nInstance() {
  return i18next;
}
