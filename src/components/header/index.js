import { defineCustomElement } from "@/utils/dom/customElements";

export async function defineHeader() {    
    const { Header, ELEMENT_NAME } = await import('@/components/header/Header');
    defineCustomElement(ELEMENT_NAME, Header);
}

