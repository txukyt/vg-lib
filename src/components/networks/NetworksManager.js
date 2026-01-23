import BreakpointListener from '@/utils/browser/BreakpointListener.js';
import { BREAKPOINT_DESKTOP } from '@/utils/env/breakpoints.js';
import { teleport } from '@/utils/dom/teleporter.js';

export default class NetworksManager {
    #listaRedes;
    #containerRedes;
    #breakpointObserver;
    #placeholder;

    constructor() {
        this.#initialize();
    }

    #initialize() {
        this.#listaRedes = document.querySelector('.networks');
        this.#containerRedes = document.querySelector('.networks-container');

        if (this.#listaRedes) {
            this.mount();
        }
    }

    mount() {
        this.#breakpointObserver = new BreakpointListener(BREAKPOINT_DESKTOP, (isDesktop) => {
            if (isDesktop) {
                this.#setupDesktop();
            } else {
                this.#setupMobile();
            }
        });
    }

    #setupDesktop() {
        if (this.#listaRedes && this.#containerRedes) {
            this.#placeholder = document.createComment('networks-placeholder');
            this.#listaRedes.parentNode.insertBefore(this.#placeholder, this.#listaRedes);
            teleport(this.#listaRedes, this.#containerRedes);
        }
    }

    #setupMobile() {
        if (this.#placeholder && this.#placeholder.parentNode) {
            this.#placeholder.parentNode.insertBefore(this.#listaRedes, this.#placeholder);
            this.#placeholder.remove();
            this.#placeholder = null;
        }
    }

    destroy() {
        if (this.#breakpointObserver) {
            this.#breakpointObserver.destroy();
        }
    }
}
