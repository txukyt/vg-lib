//import { registerCookiesI18n } from "@/components/header/i18n";
import template from "@/components/header/template";
import { lang, changeLang } from "@/utils/lang/lang";
import { init } from "@/components/buttons";
import { registerHeaderI18n } from "@/components/header/i18n";
import { t } from "@/i18n";

export const ELEMENT_NAME = "vg-header-intranet";

export class Header extends HTMLElement {
  static get ELEMENT_NAME() {
    return ELEMENT_NAME;
  }

  constructor() {
    super();

    const templateContent = template.content;

    const idiomaInput = templateContent.querySelector(
      'input[name="idioma"][type="hidden"]'
    );
    if (idiomaInput) idiomaInput.value = lang();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(templateContent.cloneNode(true));

      const slot = shadow.querySelector('slot[name="languages"]');
      slot.addEventListener('slotchange', () => {
        console.log('El slot "languages" ha cambiado');
      });
    
  }

  async connectedCallback() {
    await registerHeaderI18n();

    const locale = lang();

    const idiomaButton = this.shadowRoot.querySelector(
      ".nav-link__lang > .nav-link__text"
    );
    if (idiomaButton) idiomaButton.textContent = t(`header:idiomas.${locale}`);

    const link = this.shadowRoot.querySelector(`.header-utils__lang-menu__changelang[data-lang="${locale}"]`);
    link.parentElement.classList.add('active');

    this.shadowRoot.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = t(key);
      if (!text) return;

      if (el.tagName === "INPUT") {
        if (el.type === "text" || el.type === "search") el.placeholder = text;
        else if (el.type === "submit" || el.type === "button") el.value = text;
      } else if (el.tagName === "TEXTAREA") el.placeholder = text;
      else el.textContent = text;
    });

    init(this.shadowRoot, '.nav-link-toggle');

    const langLinks = this.shadowRoot.querySelectorAll(".header-utils__lang-menu__changelang");
    langLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        changeLang(link.dataset.lang);
      });
    });

      


    console.log("<vg-header-intranet> register from page.");
  }

  disconnectedCallback() {
    console.log("<vg-header-intranet> removed from page.");
  }
}
