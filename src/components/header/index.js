import { Header, ELEMENT_NAME } from "@/components/header/Header";

import { defineCustomElement } from "@/utils/dom/customElements";

export function defineHeader() {    
    defineCustomElement(ELEMENT_NAME, Header);
}

