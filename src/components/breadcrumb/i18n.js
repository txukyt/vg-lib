import { extendI18next } from "@/i18n";

import es from './locales/es.json';

// Namespace global del componente
export const NS = 'breadcrumb';

const resources = {
  es: es,
};

export async function registerBreadcrumbI18n() {
  extendI18next(NS, resources);
}
