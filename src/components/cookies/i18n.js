import { getI18nInstance, init as initI18n, extendI18next } from "@/i18n";

import es from './locales/es.json';
import eu from './locales/eu.json';

// Namespace global del componente
const NS = 'Cookies';

const resources = {
  es: { translation: es },
  eu: { translation: eu },
};

export async function registerCookiesI18n() {
  const i18n = getI18nInstance();
  if (i18n) await initI18n();

  extendI18next(NS, resources);
}
