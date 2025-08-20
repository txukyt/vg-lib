import { t } from "@/i18n";
import { registerBreadcrumbI18n, NS } from "@/components/breadcrumb/i18n";

function breadcrumbFactory(navNode) {
    navNode.setAttribute("role", "navigation");
    navNode.setAttribute("aria-label", t("breadcrumb.arialabel", { ns: NS }));
}

export async function init() {
    await registerBreadcrumbI18n();

    const breadcrumbs = document.querySelectorAll(".breadcrumb");

    breadcrumbs.forEach((breadcrumb) => {
        if (breadcrumb.tagName === "NAV") {
            breadcrumbFactory(breadcrumb);
        } else {
            console.warn(t("breadcrumb.deprecated", { ns: NS }));
        }
    });
}
