import { getI18nInstance, init as initI18n, extendI18next } from "@/i18n";

import es from './locales/es.json';

// Namespace global del componente
export const NS = 'breadcrumb';

const resources = {
  es: { translation: es },
};

export async function registerBreadcrumbI18n() {
  const i18n = getI18nInstance();
  if (i18n) await initI18n();

  extendI18next(NS, resources);
}
