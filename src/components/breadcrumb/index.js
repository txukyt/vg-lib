import { t } from "@/i18n";
import { registerBreadcrumbI18n, NS } from "@/components/breadcrumb/i18n";

function breadcrumbFactory(navNode) {
    navNode.setAttribute("aria-label", t("breadcrumb.arialabel", { ns: NS }));
}

export async function init() {
    const breadcrumb = document.querySelector(".breadcrumb");

    if(!breadcrumb) return;

    if(__DEV__) console.log('⚙️ Inicializando <nav class="breadcrumb">...');
    
    await registerBreadcrumbI18n();

    if (breadcrumb.tagName === "NAV") {
        breadcrumbFactory(breadcrumb);
    } else {
        console.warn(t("breadcrumb.deprecated", { ns: NS }));
    }
}
