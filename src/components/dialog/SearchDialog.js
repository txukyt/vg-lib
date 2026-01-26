import Dialog from './Dialog.js';

export default class SearchDialog extends Dialog {
    #searchInput;

    constructor(options) {
        super({
            ...options,
        });
    }

    // Método para animar el input de búsqueda
    #animateSearchInput() {   
        this.#searchInput = this.contentElement.querySelector('input[type="search"]');
        if (this.#searchInput) {
            this.#searchInput.focus();
            this.#searchInput.value = ''; // Limpiar input al abrir
        }
    }

    // Método personalizado para manejar el evento de click de apertura
    onOpenClick() {
        this.open();
        requestAnimationFrame(() => {
            this.#animateSearchInput();
        });
    }

    setupDesktop(signal) {
        const searchDetail = document.querySelector('.search-area > .nav-list__accordion');
        
        if (searchDetail) {
            searchDetail.addEventListener('toggle', (e) => {
                if (e.target.open) {
                    requestAnimationFrame(() => {
                        this.#animateSearchInput();
                    });
                }
            }, { signal });
        }
    }

    mount() {
        super.mount();
        window.vg.autocomplete.init();
    }
}