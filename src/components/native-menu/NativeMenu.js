import BreakpointListener from '@/utils/browser/BreakpointListener.js';
import InertController from '@/utils/dom/InertController';
import { disableScroll, enableScroll } from '@/utils/dom/scroll.js';
import { teleport } from '@/utils/dom/teleporter.js';
import { BREAKPOINT_DESKTOP } from '@/utils/env/breakpoints.js';
/* import { t } from "@/i18n"; */

import { initializeFocusListener } from '@/devs/dom.js';
/* import Dialog from '@/components/dialog/Dialog.js'; */

export default class NativeMenu {
  #backBtn;
  #closeBtn;
  #details;
  #dialog;
  #menu;
  #openBtn;



  #breakpointObserver;
  #inertController;
  // Controladores de eventos (para limpiar memoria)
  #currentController; 

  constructor({dialogSelector, openBtnSelector, closeBtnSelector, menuSelector, backBtnSelector}) {
    if (__DEV__) {
      this._debug = true; 
    }
    this.#dialog = document.querySelector(dialogSelector);
    this.#openBtn = document.querySelector(openBtnSelector);
    this.#closeBtn = this.#dialog.querySelector(closeBtnSelector);
    this.#menu = document.querySelector(menuSelector);
    this.#details = this.#menu.querySelectorAll("details");
    this.#backBtn = this.#menu.querySelectorAll(backBtnSelector);

     /* new Dialog({
      dialogSelector: "#search-dialog",
      openBtnSelector: "#search-dialog-button",
      contentSelector: ".main-nav__search-form",
      options: { animationClass: 'drawer-left', ariaLabel: t('dialog.label.menuBusqueda') }
    }); */
   

    if(__DEV__  && this._debug) {
      initializeFocusListener();
    }
    this.#inertController = null;
    this.init();
  }

  init() {
    this.#breakpointObserver = new BreakpointListener(BREAKPOINT_DESKTOP, (isDesktop) => {
      this.#handleResponsiveLayout(isDesktop);
    });

    if (this.#breakpointObserver.matches) {
      this.#setupDesktop();
    } else {
      this.#setupMobile();
    }

    this.#setupSharedLogic();
  }

  #handleResponsiveLayout(isDesktop) {
    this.#cleanup(); 

    if (isDesktop) {
      // MODO ESCRITORIO      
      // Si el menú móvil estaba abierto al ensanchar la pantalla, ciérralo
      if (this.#dialog.open) this.#close();
      teleport(this.#menu, document.querySelector('.nav-container'));
      this.#setupDesktop();
    } else {
      // MODO MÓVIL      
      teleport(this.#menu, document.querySelector('#menu-dialog > .dialog-body'));
      this.#setupMobile();
    }
  }

  #cleanup() {
    if (this.#currentController) {
      this.#currentController.abort();
    }
  }

  #setupMobile() {
    this.#currentController = new AbortController();
    const { signal } = this.#currentController;

    this.#openBtn.addEventListener('click', () => {
      this.#dialog.showModal(); 
      disableScroll();
    }, { signal });

    this.#closeBtn.addEventListener('click', () => {
      this.#close();
    }, { signal });

    this.#dialog.addEventListener('click', (e) => {
      if (e.target === this.#dialog) {
        this.#close();
      }
    }, { signal });
    
    this.#dialog.addEventListener('close', () => {
      enableScroll();
    }, { signal });
    

    const focusableSelectors = [
        'details:not(:open)',
        '.btn-cerrar-menu'
      ].join(',');

    

    this.#details.forEach(detail => {
      detail.addEventListener('toggle', () => {        
        if(detail.open) {

        if (this.#inertController) {
           this.#inertController.unlock();
        }

        const elementos = this.#dialog.querySelectorAll(focusableSelectors);
        this.#inertController = new InertController(elementos);
        this.#inertController.lock();

        } else {
          if (this.#inertController) {
           this.#inertController.unlock();
           this.#inertController = null; // Limpiamos la referencia
        }
          
        }
      });
    });

    this.#backBtn.forEach(btn => {

      btn.addEventListener('click', (e) => {
          const detailsElement = e.target.closest('details');
          if (detailsElement) detailsElement.open = false;
      });

    });
  }

  #setupDesktop() {
    this.#currentController = new AbortController();
    const { signal } = this.#currentController;

    // A. Cerrar al hacer Click fuera
    document.addEventListener('click', (e) => {
      if (!this.#menu.contains(e.target)) {
        this.#closeAllDetails();
      }
    }, { signal });

    // B. Cerrar al perder foco (Tabulador)
    // Usamos 'focusin' en el documento para detectar dónde aterrizamos
    document.addEventListener('focusin', (e) => {
      if(__DEV__&& this.debug) console.log('⚡ Focusin en:', e.target);
      const openDetail = this.#menu.querySelector('details[open]');
      if (openDetail && !openDetail.contains(e.target)) {
        openDetail.removeAttribute('open');
      }
    }, { signal });

    // C. Tecla ESCAPE (Solo cierra el dropdown, no el menú entero)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openDetail = this.#menu.querySelector('details[open]');
        if (openDetail) {
          openDetail.removeAttribute('open');
          openDetail.querySelector('summary').focus(); // Devolver foco
        }
      }
    }, { signal });
  }

  // ---------------------------------------------------------
  // LÓGICA COMPARTIDA (Exclusividad Accordion)
  // ---------------------------------------------------------
  #setupSharedLogic() {
    // Esto aplica tanto a móvil como a escritorio:
    // "Si abres uno, cierra los demás"
    this.#details.forEach(target => {
      target.addEventListener('toggle', () => {
        if (target.open) {
          this.#details.forEach(d => {
            if (d !== target) d.removeAttribute('open');
          });
        }
      });
    });
  }

  #closeAllDetails() {
    this.#details.forEach(d => d.removeAttribute('open'));
  }

  #close() {    
    this.#dialog.close();
  }

  destroy() {
    this.#breakpointObserver.destroy();
  }
}