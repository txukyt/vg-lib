import { t, getI18nInstance, init as initI18n, extendI18next } from "@/i18n";

import es from './locales/es.json';

// Namespace global del componente
const NS = 'Breadcrumb';

const resources = {
  es: { translation: es },
};

function breadcrumbFactory(navNode) {
    navNode.setAttribute("role", "navigation");
    navNode.setAttribute("aria-label", t("breadcrumb.arialabel", { ns: NS }));
}

export async function init() {
    const i18n = getI18nInstance();
    if (i18n) await initI18n();

    extendI18next(NS, resources);

    const breadcrumbs = document.querySelectorAll(".breadcrumb");

    breadcrumbs.forEach((breadcrumb) => {
        if (breadcrumb.tagName === "NAV") {
            breadcrumbFactory(breadcrumb);
        } else {
            console.warn(t("breadcrumb.deprecated", { ns: NS }));
        }
    });
}
