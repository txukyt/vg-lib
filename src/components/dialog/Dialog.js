import BreakpointListener from '@/utils/browser/BreakpointListener.js';
import { BREAKPOINT_DESKTOP } from '@/utils/env/breakpoints.js';
import { disableScroll, enableScroll, resetElementScroll } from '@/utils/dom/scroll.js';
import { teleport } from '@/utils/dom/teleporter.js';
import { setAriaHasPopup, setAriaControls, setAriaAttributes } from '@/utils/a11y/aria.js';
import { t } from "@/i18n";

const DIALOG_TEMPLATE = `
    <div class="dialog-body">
        <div class="dialog-header">
            <button id="dialog-close" class="btn btn-cta btn-cta__ghost" data-icon="close"></button>
        </div>
        <div class="dialog-content"></div>
    </div>`;

export default class Dialog {
    #dialog;
    #openBtn;
    #closeBtn;
    #content;
    #placeholder;
    #settings;

    #breakpointObserver;
    #currentController;

    constructor({dialogSelector, closeBtnSelector = "#dialog-close", openBtnSelector, contentSelector, options = {}}) {
        if (__DEV__) {
            this._debug = true; 
        }

        this.#settings = {
            className: options.className || 'mobile-drawer',
            animationClass: options.animationClass || 'drawer-top',
            breakpoint: options.breakpoint || BREAKPOINT_DESKTOP,
            ariaLabel: options.ariaLabel || t("dialog.label.default")
        }

        this.#openBtn = document.querySelector(openBtnSelector);
        if (!this.#openBtn) {
            throw new Error(`[Dialog] Error: No se encontró el botón con selector: "${openBtnSelector}"`);
        }

        this.#dialog = this.#ensureDialogElement(dialogSelector);

        this.#closeBtn = this.#dialog.querySelector(closeBtnSelector);
        this.#content = document.querySelector(contentSelector);
    }

    #ensureDialogElement(selector) {
        let element = document.querySelector(selector);
        if (element) return element;

        if (selector.startsWith('#') && selector.length > 1) {
            const id = selector.substring(1); // Quitar el '#'
            
            element = document.createElement('dialog');
            element.id = id;
            element.innerHTML = DIALOG_TEMPLATE;

            const classes = [this.#settings.className, this.#settings.animationClass].filter(Boolean);
            element.className = classes.join(' ');
            
            document.body.appendChild(element);
            
            return element;
        }

        // 3. Si no existe y el selector no es un ID (ej: es una clase), fallamos.
        throw new Error(`[Dialog] No se encontró el dialog "${selector}" y no se puede crear automáticamente porque no es un selector de ID.`);
    }

    #restoreContent() {
        // Verificamos si hay algo que restaurar y si tenemos la referencia del sitio (placeholder)
        if (this.#content && this.#placeholder && this.#placeholder.parentNode) {
            
            // 1. Mover contenido antes del marcador
            this.#placeholder.parentNode.insertBefore(this.#content, this.#placeholder);
            
            // 2. Eliminar el marcador
            this.#placeholder.remove();
            this.#placeholder = null;

            if (__DEV__ && this._debug) {
                console.log('[Dialog] DOM restaurado: contenido devuelto a su origen.');
            }
        }
    }

    #setupA11y() {
        if(!this.#dialog.getAttribute('aria-label')) {
            setAriaAttributes(this.#dialog, {
                label: this.#settings.ariaLabel
            });
        }
        if (!this.#openBtn.getAttribute('aria-controls')) {
            setAriaControls(this.#openBtn, this.#dialog.id);
            setAriaHasPopup(this.#openBtn); 
        }
        if (!this.#closeBtn.getAttribute('aria-label')) {
            setAriaAttributes(this.#closeBtn, {
                label: t("dialog.cerrar")
            });
        }
    }

    mount() {
        this.#setupA11y();

        this.#breakpointObserver = new BreakpointListener(this.#settings.breakpoint, (isDesktop) => {
            this.#handleResponsiveLayout(isDesktop);
        });
    }

    #handleResponsiveLayout(isDesktop) {
        this.#cleanup();     
        isDesktop ? this.#setupDesktop() : this.#setupMobile();

        this.onLayoutChange(isDesktop);
    }
    
    #cleanup() {
        if (this.#currentController) this.#currentController.abort();
        if (this.#dialog.open) this.#dialog.close();
        this.#restoreContent();
        enableScroll();
    }

    #setupMobile() {

        if (this.#content) {
            const targetContainer = this.#dialog.querySelector('.dialog-content');
            const destination = targetContainer || this.#dialog;

            if (__DEV__ && this._debug && !targetContainer) {
                console.warn('[Dialog] No se encontró .dialog-content dentro del modal. Se ha movido a la raíz.');
            }

            this.#placeholder = document.createComment('dialog-content-placeholder');
            this.#content.parentNode.insertBefore(this.#placeholder, this.#content);
            teleport(this.#content, destination);
        }

        this.#currentController = new AbortController();
        const { signal } = this.#currentController;

        this.#openBtn.addEventListener('click', () => {
            this.#dialog.showModal(); 
            resetElementScroll(this.#dialog.querySelector('.dialog-body'));
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
    }

    #setupDesktop() {
    }

    #close() {    
        this.#dialog.close();
    }

    destroy() {
        this.#breakpointObserver.destroy();
    }

    onLayoutChange() {
    }
}