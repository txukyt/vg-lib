import i18next from 'i18next';
import { getLang } from '@/utils/lang/lang';

import es from './locales/es.json';
import eu from './locales/eu.json';
import en from './locales/en.json';
import fr from './locales/fr.json';


let isInitialized = false;

const resources = {
  es: { global: es },
  eu: { global: eu },
  en: { global: en },
  fr: { global: fr },
};

export async function init() {

  if (isInitialized) return;

  if(__DEV__) console.log('⚙️ Inicializando diccionario i18n...');

  await i18next.init({
    lng: getLang(),
    fallbackLng: 'es',
    defaultNS: "global",
    debug: false,
    resources,
  });

  isInitialized = true;
}

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

export function t(key, options = {}) {
  if (typeof options !== 'object') {
    throw new Error('Second argument must be an object if provided');
  }

  return i18next.t(key, options);
}

/*(async () => {
  await init();
})();*/