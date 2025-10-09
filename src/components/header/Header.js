import template from "@/components/header/template";
import { getLang, changeLang } from "@/utils/lang/lang";
import { init } from "@/components/buttons";
import { registerHeaderI18n } from "@/components/header/i18n";
import { t } from "@/i18n";
import { getConfig } from '@/core/config';

export const ELEMENT_NAME = "vg-header-intranet";

/**
 * @class Header
 * @extends {HTMLElement}
 * @description Clase que representa el encabezado de la aplicación de intranet.
 * Este componente se encarga de:
 * - Renderizar el template del encabezado.
 * - Gestionar la internacionalización (i18n) del texto.
 * - Configurar las URLs dinámicamente a partir de la configuración global.
 * - Crear y gestionar el selector de idioma.
 * - Inicializar los botones interactivos dentro del encabezado.
 * @example 
 * <vg-header-intranet></vg-header-intranet>
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components}
 * @author David Mora <david.mora.pedregosa@seidor.com>
 */

export class Header extends HTMLElement {
  #locale;
  #config;
  
  static get ELEMENT_NAME() {
    return ELEMENT_NAME;
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#locale = getLang();
    this.#config = getConfig();
  }

  async connectedCallback() {
    try {
      const clonedTemplate = template.content.cloneNode(true);
      this.#updateTemplateLinks(clonedTemplate);
      
      await registerHeaderI18n();

      this.#updateI18nText(clonedTemplate);

      this.#appendLanguageSelector(clonedTemplate);

      this.shadowRoot.appendChild(clonedTemplate);

      init(this.shadowRoot, '.nav-link-toggle');
      this.classList.add('is-rendered');
      console.log(`<${ELEMENT_NAME}> registrado y renderizado.`);
    } catch(err) {
      console.error(`<${ELEMENT_NAME}> error:`, err);
    }
  }

  disconnectedCallback() {
    console.log(`<${ELEMENT_NAME}> eliminado de la página.`);
  }

  #updateTemplateLinks(templateNode) {
    const { urlMain, urlIntra, urlWeb } = this.#config;

    if(!urlMain || !urlIntra || !urlWeb) {
      throw new Error(`[${ELEMENT_NAME}] URLs de configuración faltantes. urlMain: ${urlMain}, urlIntra: ${urlIntra}, urlWeb: ${urlWeb}`);
    }

    // Busca los spans con el atributo data-i18n y luego encuentra su <a> más cercano.
    templateNode.querySelector('span[data-i18n="header:titulo"]').closest('a').href = urlMain;
    templateNode.querySelector('span[data-i18n="header:herramientas"]').closest('a').href = `${urlIntra}/j28-02i/gw/estructuraArbolAction.do?idioma=${this.#locale}&lang=${this.#locale}&locale=${this.#locale}`;
    templateNode.querySelector('span[data-i18n="header:web"]').closest('a').href = `${urlWeb}/wb021/was/we001Action.do?accionWe001=ficha&accion=home&idioma=${this.#locale}&lang=${this.#locale}&locale=${this.#locale}`;

    // Este selector estaba correcto, ya que el id está en el <form>.
    templateNode.querySelector('form#frmBusqueda').action = `${urlIntra}/ib025/was/buscadorGoogleAction.do`;

    // Asigna el idioma al input del formulario.
    const idiomaInput = templateNode.querySelector('input[name="idioma"][type="hidden"]');
    if (idiomaInput) idiomaInput.value = this.#locale;
}

  #updateI18nText(templateNode) {
    templateNode.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = t(key);
      if (!text) return;

      const tagName = el.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA") {
        const type = el.getAttribute('type');
        if (type === "text" || type === "search" || tagName === "TEXTAREA") {
          el.placeholder = text;
        } else if (type === "submit" || type === "button") {
          el.value = text;
        }
      } else {
        el.textContent = text;
      }
    });
    
    // Actualiza el texto del botón del idioma.
    const idiomaButton = templateNode.querySelector('.nav-link__lang > .nav-link__text');
    if (idiomaButton) idiomaButton.textContent = t(`header:idiomas.${this.#locale}`);
  }

  #appendLanguageSelector(templateNode) {
    const langMenuInTemplate = templateNode.querySelector('ul[id="dropdownLang"]');

    if (langMenuInTemplate) {
      return;
    }

    const langMenuInDocument = document.querySelector('ul[id="dropdownLang"]');
    const langButton = templateNode.querySelector('button#dropdownLangButton');
    
    if (!langButton) {
      console.error('No se encontró el botón de idioma para adjuntar el selector.');
      return;
    }
    
    let langMenuToAppend;

    if (langMenuInDocument) {
      langMenuToAppend = langMenuInDocument;
    } else {
      langMenuToAppend = this.#createLanguageMenu(['es', 'eu']);
    }
    langButton.insertAdjacentElement('afterend', langMenuToAppend);
  }

  #createLanguageMenu(languages) {
    const ul = document.createElement('ul');
    ul.id = 'dropdownLang';
    ul.className = 'dropdown-lang';
    ul.setAttribute('aria-labelledby', 'dropdownLangButton');

    languages.forEach(lang => {
      const li = document.createElement('li');
      if(lang === this.#locale) li.classList.add('active');

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
}