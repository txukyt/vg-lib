import { Cookies } from "@/components/cookies/Cookies";

import { defineCustomElement } from "@/utils/customElements";

export function defineCookies() {
    defineCustomElement("vg-cookies", Cookies);
}

