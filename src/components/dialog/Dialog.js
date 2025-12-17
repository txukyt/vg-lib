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

    constructor({ dialogSelector, closeBtnSelector = "#dialog-close", openBtnSelector, contentSelector, options = {} }) {
        if (__DEV__) {
            this._debug = true;
        }
        const defaults = {
            className: 'mobile-drawer',
            animationClass: 'drawer-top',
            breakpoint: BREAKPOINT_DESKTOP,
            ariaLabel: t("dialog.label.default"),
        }

        this.#settings = { ...defaults, ...options };

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
        if (!this.#dialog.getAttribute('aria-label')) {
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

    #setupTitle() {
        const dialogHeader = this.#dialog.querySelector('.dialog-header');

        const titleSpan = document.createElement('span');
        titleSpan.classList.add('header-title');


        if(this.#settings.title) {
            titleSpan.textContent = this.#settings.title;
        } else {
            titleSpan.innerHTML = `<svg width="80px" height="23.2px" viewBox="0 0 80 23.2"><path fill="#fff" d="M40.7 21h-2.1l2.1-6.5v-2.1h-4.9v2.1h1.9l-2.1 7.1v1.6h5.2V21zm-5.6-8.6h-2.8v10.8h2.8zM31.7 21h-2v-2.4h1.8v-2h-1.8v-2h1.9v-2.1h-4.7v10.8h4.8zm-5.2-8.6h-6.1v2.1H22v8.6h2.8v-8.6h1.6v-2.1zm-6.6 6c-.2-.6-.8-1.1-1.6-1.6-.7-.5-1.2-.8-1.3-1s-.2-.5-.2-.9c0-.6.2-.8.5-.8.2 0 .3.1.4.4v1H20v-.1c0-.6 0-1-.1-1.3-.1-.4-.2-.7-.5-1-.2-.2-.5-.4-.9-.5-.3-.1-.8-.1-1.4-.1s-1.1.1-1.5.2-.7.4-.9.7c-.1.3-.2.5-.3.8s-.1.6-.1 1c0 1.1.3 2 .9 2.5.4.3 1 .9 2 1.6.2.2.3.4.4.6 0 .2.1.5.1.8 0 .6-.2.9-.5.9-.2 0-.3-.1-.4-.2 0-.1-.1-.4-.1-.8v-1h-2.3v.4c0 .7 0 1.3.1 1.6s.3.6.5.9c.2.2.5.4.9.5s.8.2 1.4.2c.5 0 1 0 1.3-.1s.7-.3.9-.5.4-.5.4-.7c.1-.3.1-.7.1-1.3.2-1.1.1-1.8-.1-2.2m-9.7.9c.1-.6.1-1.3.2-2 .1-1.2.2-2 .3-2.5 0 .3 0 .9.1 1.9s.2 1.9.3 2.6zm2.5-6.9h-4L7.2 23.1h2.9l.2-1.9h1l.1 1.9h2.9zm-5.8 4.9H3.6V19h.7v1.3c0 .4-.1.7-.2.9s-.3.3-.5.3c-.3 0-.5-.3-.5-.8v-5.5c0-.4 0-.8.1-.9 0-.2.2-.3.4-.3s.4.1.5.3.1.6.1 1.1v1h2.6v-1.1c0-.9-.3-1.7-.9-2.1-.6-.5-1.4-.7-2.5-.7-.8 0-1.5.2-2 .5s-.9.8-1 1.4c-.1.2-.1.5-.1.9v4.8c0 .5 0 .8.1 1.2q0 .45.3.9c.2.4.6.7 1 .9.5.2 1 .3 1.7.3 1.4 0 2.3-.3 2.8-.8q.6-.6.6-2.1v-3.2zM37 6.9c.1-.6.1-1.3.2-2 .1-1.2.2-2 .3-2.5 0 .3 0 .9.1 1.9s.2 1.9.3 2.6zM39.5 0h-4L34 10.8h2.9l.1-1.9h1l.1 1.9H41zm-5.8 0h-2.8v10.8h2.8zm-6.3 4.1c-.1.1-.3.2-.7.2V1.9h.1c.3 0 .5.1.6.2s.1.3.1.6v.6c.1.4 0 .7-.1.8m2.8 3.5c0-.8-.1-1.3-.2-1.6-.2-.4-.6-.6-1.3-.8.7-.1 1.1-.3 1.3-.6s.2-.8.2-1.6c0-1.4-.4-2.2-1.1-2.6-.5-.2-1.5-.4-3.2-.4h-2v10.8h2.8V6c.4 0 .6.1.7.2s.2.4.2.8v3.9h2.6zM19.8 9.2c-.2 0-.3-.1-.3-.2-.1-.2-.1-.4-.1-.7V2.8c0-.5 0-.8.1-.9.1-.2.2-.2.4-.2s.3.1.4.2c0 .1.1.4.1.7v5.5c-.2.8-.3 1.1-.6 1.1M23 4.5c0-.9 0-1.5-.1-2 0-.5-.1-.8-.2-1.1-.2-.5-.6-.9-1.1-1.1S20.5 0 19.7 0s-1.4.1-1.9.3-.8.6-1.1 1c-.1.3-.2.6-.2 1v3.9c0 .9 0 1.6.1 2 0 .5.1.8.2 1.1.2.5.6.9 1.1 1.1s1.1.3 1.9.3 1.4-.1 1.9-.3.9-.6 1.1-1.1c.1-.3.2-.6.2-1zM16.2 0h-6.1v2.1h1.7v8.6h2.8V2.2h1.6zM9.7 0H6.9v10.8h2.8zM3.9 0c-.1 1.1-.3 2.3-.4 3.5s-.2 2.6-.2 4.1c0-1.5-.1-3-.2-4.3S2.8.9 2.7 0H0l1.5 10.8h3.8L6.6 0z"/><path fill="#3dae2b" d="M48.6 18.5h-5.4v4.6h5.4zM42.8.1l.9 17.3h4.4L49 .1zm31.7 2.2c0-.6 0-1-.1-1.3 0-.3-.2-.5-.3-.7-.1-.1-.3-.2-.4-.2-.2 0-.3-.1-.5-.1-.6 0-1 .2-1.3.7L72 0h-2v7.3h2V1.6c0-.1.1-.3.3-.3.1 0 .2 0 .2.1v6.1h2zm-7.5.4v-.9c0-.2 0-.3.1-.4 0-.1.1-.1.3-.1.1 0 .2 0 .2.1s.1.3.1.5v.7H67zm2.5 1.9h-1.8v.9c0 .2 0 .4-.1.6-.1.1-.2.2-.3.2-.2 0-.3-.1-.3-.2V3.9h2.5V3c0-.4 0-.8-.1-1.2l-.3-.9c-.2-.3-.4-.5-.7-.6s-.7-.2-1.1-.2c-.5 0-.9.1-1.3.3-.3.2-.6.5-.7.8-.1.2-.1.4-.1.6v3.5c0 .3 0 .5.1.7.1.4.4.8.8 1s.9.3 1.4.3c.4 0 .8-.1 1.1-.2s.5-.3.7-.6.3-.5.3-.7.1-.5.1-.8v-.4zm-7.3-1.9v-.9c0-.2 0-.3.1-.4 0-.1.1-.1.3-.1.1 0 .2 0 .2.1s.1.3.1.5v.7h-.7zm2.4 1.9h-1.8v.9c0 .2 0 .4-.1.6-.1.1-.2.2-.3.2-.2 0-.3-.1-.3-.2V3.9h2.5V3c0-.4 0-.8-.1-1.2l-.3-.9c-.2-.3-.4-.5-.7-.6s-.7-.2-1.1-.2c-.5 0-.9.1-1.3.3-.3.2-.6.5-.7.8-.1.2-.1.4-.1.6v3.5c0 .3 0 .5.1.7.1.4.4.8.8 1s.9.3 1.4.3c.4 0 .8-.1 1.1-.2.1.1.3-.1.5-.4s.3-.5.3-.7.1-.5.1-.8zM59.9 0c-.3 0-.6.1-.8.3s-.3.4-.5.8l.1-1h-2v7.3h2V4.6c0-.8 0-1.3.1-1.5.1-.3.4-.5.9-.5h.1V0zm-6.1 5.3c-.1 0-.2-.1-.2-.2v-3c0-.2 0-.4.1-.6 0-.1.1-.2.2-.2s.2 0 .2.1.1.2.1.5v2.5c-.1.6-.2.9-.4.9M56.2.1h-1.9l-.1.6c-.2-.2-.3-.4-.5-.4-.2-.1-.4-.1-.7-.1-.5 0-.9.1-1.1.4s-.4.7-.4 1.4v3.5c0 .2.1.4.2.6s.3.3.5.4.5.1.7.1c.3 0 .5 0 .6-.1.2-.1.3-.2.5-.4v.6c0 .2 0 .4-.1.6 0 .1-.1.2-.3.2s-.4-.2-.4-.5h-1.9c0 .6.2 1 .5 1.3s.9.4 1.6.4c1.2 0 2-.4 2.3-1.2.1-.1.1-.3.1-.4v-7zM80 8.4h-2.1v9H80zm-4.9 7.8c-.2 0-.3-.1-.4-.4v-.5c0-.4 0-.7.1-.9.1-.1.2-.3.5-.5v1.9c.1.3 0 .4-.2.4m2.3-2.5c0-.9 0-1.6-.1-2s-.1-.8-.3-1-.4-.4-.7-.5-.7-.1-1.2-.1c-.4 0-.8 0-1 .1-.2 0-.5.2-.7.3-.3.2-.4.5-.5.8s-.1.7-.1 1.1v.2h1.9v-.9c0-.2 0-.4.1-.5s.1-.1.2-.1q.3 0 .3.9c0 .3 0 .5-.1.6l-.3.3-1 .5q-.75.3-.9.6c-.1.2-.2.6-.2 1.1v.6c0 .2 0 .5.1.7 0 .2.1.4.2.5.1.2.2.3.4.3.2.1.4.1.7.1s.6 0 .7-.1c.2-.1.3-.3.5-.5v.7h2zm-5 2.5c-.3 0-.5 0-.6-.1 0-.1-.1-.3-.1-.8v-4h.5v-1.2h-.5V9h-2v1.2h-.4v1.2h.4v4.9c0 .3.1.5.1.6.2.3.4.5.7.6.2 0 .5.1 1 .1h.8v-1.4zM68.8 10h-2.2v7.4h2.2zm0-1.6h-2.2v1.2h2.2zm-4.7 7.7c0 .1-.1.1-.2.1q-.3 0-.3-.6v-3.8q0-.6.3-.6c.1 0 .2 0 .2.1zm2.1-4.1v-1c0-.2-.1-.4-.2-.6s-.3-.3-.4-.4h-.7c-.3 0-.5.1-.7.2s-.4.3-.6.5l.1-.7h-2.1v8.5h2v-1.7c.2.3.4.4.6.5s.4.2.7.2c.6 0 1-.2 1.2-.7.1-.3.2-.8.2-1.6V12zm-7.6 4.2c-.2 0-.3-.1-.4-.4v-.5c0-.4 0-.7.1-.9.1-.1.2-.3.5-.5v1.9c.2.3.1.4-.2.4m2.4-2.5c0-.9 0-1.6-.1-2 0-.4-.1-.8-.3-1s-.4-.4-.7-.5-.7-.1-1.2-.1c-.4 0-.8 0-1 .1-.2 0-.5.2-.7.3-.3.2-.4.5-.5.8s-.1.7-.1 1.1v.2h1.9v-.9c0-.2 0-.4.1-.5s.1-.1.2-.1q.3 0 .3.9c0 .3 0 .5-.1.6l-.3.3-1 .5q-.75.3-.9.6c-.1.2-.2.6-.2 1.1v.6c0 .2 0 .5.1.7 0 .2.1.4.2.5.1.2.2.3.4.3.2.1.4.1.7.1s.6 0 .7-.1c.2-.1.3-.3.5-.5v.7h2zm-6.7.7v.9c0 .3 0 .6-.1.7 0 .2-.1.2-.3.2-.1 0-.2-.1-.3-.2s-.1-.3-.1-.6v-3.5c0-.3 0-.5.1-.6 0-.1.1-.2.2-.2.2 0 .3.2.3.5v1.1H56c0-.5 0-.9-.1-1.2l-.3-.9c-.3-.5-.9-.7-1.8-.7-.5 0-.9.1-1.3.3s-.6.4-.8.8c-.1.2-.1.4-.2.6v3c0 .4 0 .7.1 1 0 .3.1.6.2.7.2.4.4.7.8.8.3.2.8.2 1.3.2.4 0 .7 0 .9-.1l.6-.3c.2-.2.4-.5.5-.8.1-.1.1-.6.1-1.3v-.5h-1.7z"/></svg>`;
        }

        dialogHeader.prepend(titleSpan);
    }

    mount() {
        this.#setupA11y();
        this.#setupTitle();

        this.#breakpointObserver = new BreakpointListener(this.#settings.breakpoint, (isDesktop) => {
            this.#handleResponsiveLayout(isDesktop);
        });
    }

    open() {
        if (!this.#dialog || this.#dialog.open) return;

        this.#dialog.showModal();
        
        const body = this.#dialog.querySelector('.dialog-body');
        if (body) resetElementScroll(body);
        
        disableScroll();
    }

    close() {
        if (!this.#dialog || !this.#dialog.open) return;
        
        this.#dialog.close();
    }

    get element() {
        return this.#dialog;
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

        this.#openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.open();
        }, { signal });

        this.#closeBtn.addEventListener('click', () => {
            this.close();
        }, { signal });

        this.#dialog.addEventListener('click', (e) => {
            if (e.target === this.#dialog) {
                this.close();
            }
        }, { signal });

        this.#dialog.addEventListener('close', () => {
            enableScroll();
        }, { signal });
    }

    #setupDesktop() {
    }

    destroy() {
        this.#breakpointObserver.destroy();
    }

    onLayoutChange() {
    }
}