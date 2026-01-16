import { extendI18next } from "@/i18n";

import es from './locales/es.json';
import eu from './locales/eu.json';

// Namespace global del componente
const NS = 'Cookies';

const resources = {
  es: { translation: es },
  eu: { translation: eu },
};

export async function registerCookiesI18n() {
  return extendI18next(NS, resources);
}
