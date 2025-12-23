import { t } from "@/i18n";
import { registerBreadcrumbI18n, NS } from "@/components/breadcrumb/i18n";

function breadcrumbFactory(navNode) {
    navNode.setAttribute("aria-label", t("breadcrumb.arialabel", { ns: NS }));
}

export async function init() {
    const breadcrumbs = document.querySelectorAll(".breadcrumb");

    if(!breadcrumbs) return;

    if(__DEV__) console.log('⚙️ Inicializando <nav class="breadcrumb">...');
    
    await registerBreadcrumbI18n();

    breadcrumbs.forEach((breadcrumb) => {
        if (breadcrumb.tagName === "NAV") {
            breadcrumbFactory(breadcrumb);
        } else {
            console.warn(t("breadcrumb.deprecated", { ns: NS }));
        }
    });
}
