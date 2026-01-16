import { extendI18next } from "@/i18n";

import es from './locales/es.json';
import eu from './locales/eu.json';

// Namespace global del componente
const NS = 'header';

const resources = {
  es: es,
  eu: eu,
};

export async function registerHeaderI18n() {
  return extendI18next(NS, resources);
}