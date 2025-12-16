import Dialog from '@/components/dialog/Dialog.js';

const SELECTORS = {
    DIALOG: '#menu-dialog',
    CONTENT_WRAPPER: '.menu-lista', 
    TOGGLE_BTN: '#menu-button',
    BACK_BTN: '.btn-atras'
};

export default class MainNav extends Dialog {
    #details;
    #currentController;

    constructor() {
        super({
            dialogSelector: SELECTORS.DIALOG,
            openBtnSelector: SELECTORS.TOGGLE_BTN,
            contentSelector: SELECTORS.CONTENT_WRAPPER,
        });

        const wrapper = document.querySelector(SELECTORS.CONTENT_WRAPPER);
        this.#details = wrapper ? wrapper.querySelectorAll('details') : [];
    }

    mount() {
        super.mount();
        this.#setupAccordionBehavior();
        this.#setupAutoReset();
    }

    onLayoutChange(isDesktop) {
        this.#cleanup(); 

        this.#currentController = new AbortController();
        const { signal } = this.#currentController;

        this.#closeAllDetails();

        if (isDesktop) {
            this.#setupDesktop(signal);
        } else {
            this.#setupMobile(signal);
        }
    }

    #cleanup() {
        if (this.#currentController) {
            this.#currentController.abort();
            this.#currentController = null;
        }
    }


    #setupMobile(signal) {
        this.#details.forEach(detail => {
            const backBtn = detail.querySelector(SELECTORS.BACK_BTN);
            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    detail.removeAttribute('open');
                }, { signal }); 
            }
        });
    }

    #setupDesktop(signal) {        
        this.#details.forEach(detail => {
            detail.addEventListener('focusout', (e) => {
                const newFocus = e.relatedTarget;
                if (!newFocus || detail.contains(newFocus)) return;

                detail.removeAttribute('open');
            }, { signal });
        });
    }

    #setupAccordionBehavior() {
        this.#details.forEach(target => {
            target.addEventListener('toggle', () => {
                if (target.open) {
                    this.#details.forEach(d => {
                        if (d !== target && d.open) {
                            d.removeAttribute('open');
                        }
                    });
                }
            });
        });
    }

    #setupAutoReset() {
        const dialogElement = document.querySelector(SELECTORS.DIALOG);
        if (dialogElement) {
            dialogElement.addEventListener('close', () => {
                this.#closeAllDetails();
            });
        }
    }

    #closeAllDetails() {
        this.#details.forEach(d => d.removeAttribute('open'));
    }
}