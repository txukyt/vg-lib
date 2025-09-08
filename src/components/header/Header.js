import template from "@/components/header/template";
import { lang, changeLang } from "@/utils/lang/lang";
import { init } from "@/components/buttons";
import { registerHeaderI18n } from "@/components/header/i18n";
import { t } from "@/i18n";
import { alert } from '@/components/alerts';

export const ELEMENT_NAME = "vg-header-intranet";

/**
 * Clase que representa el encabezado de la aplicación de intranet.
 * @class Header
 */
export class Header extends HTMLElement {
  #locale = lang();

  static get ELEMENT_NAME() {
    return ELEMENT_NAME;
  }

  constructor() {
    super();

    const templateContent = template.content;

    const idiomaInput = templateContent.querySelector(
      'input[name="idioma"][type="hidden"]'
    );
    if (idiomaInput) idiomaInput.value = this.#locale;

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(templateContent.cloneNode(true));
    
  }

  async connectedCallback() {

    try{

      await registerHeaderI18n();

    
      const idiomaButton = this.shadowRoot.querySelector(
        ".nav-link__lang > .nav-link__text"
      );
      if (idiomaButton) idiomaButton.textContent = t(`header:idiomas.${this.#locale}`);


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

      if (!this.#hasLanguageSelector()) {

        if(!this.#hasLanguageSelector(document)) {
          this.#appendLanguageSelector(this.#create());
        } else {

          const menuLang = document.querySelector('ul[id="dropdownLang"]');

          this.#appendLanguageSelector(menuLang);
        }
      }
      init(this.shadowRoot, '.nav-link-toggle');
      this.classList.add('is-rendered');
      console.log(`<${ELEMENT_NAME}> register from page.`);

    } catch(err) {
      console.log(`<${ELEMENT_NAME}> error:`, err);
      alert.error(`Error en ${ELEMENT_NAME}: ${err.message}`);
    }
    
  }

  disconnectedCallback() {
    console.log(`<${ELEMENT_NAME}> removed from page.`);
  }

  #hasLanguageSelector(root = this.shadowRoot) {
    return Boolean(root.querySelector('ul[id="dropdownLang"]'));
  }

  #create(languages = ['es', 'eu']) {
    const ul = document.createElement('ul');
    ul.id = 'dropdownLang';
    ul.className = 'dropdown-lang';
    ul.setAttribute('aria-labelledby', 'dropdownLangButton');

    languages.forEach(lang => {
      const li = document.createElement('li');
      if(lang == this.#locale) li.classList.add('active');

      const button = document.createElement('button');
      button.textContent = t(`header:idiomas.${lang}`);

      button.addEventListener("click", (e) => {
          e.preventDefault();
          changeLang(lang);
        });

      li.appendChild(button);
      ul.appendChild(li);
    });

    return ul;
  }

  #appendLanguageSelector(langMenuHTML) {
    const button = this.shadowRoot.querySelector('button#dropdownLangButton');
    if (button) {
      button.insertAdjacentElement('afterend', langMenuHTML);
    }
  }  

}
