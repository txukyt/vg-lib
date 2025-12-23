import Dialog from '@/components/dialog/Dialog.js';
import { t } from '@/i18n';
import InertController from '@/utils/dom/InertController';

const SELECTORS = {
    DIALOG: '#menu-dialog',
    CONTENT_WRAPPER: '.nav-area', 
    TOGGLE_BTN: '#menu-button',
    BACK_BTN: '.dropdown-menu__back-btn'
};

export default class MainNav extends Dialog {
    #details;
    #inertController;
    
    #layoutController;
    #openMenuController;

    #searchhDialog;

    constructor() {
        super({
            dialogSelector: SELECTORS.DIALOG,
            openBtnSelector: SELECTORS.TOGGLE_BTN,
            contentSelector: SELECTORS.CONTENT_WRAPPER,
            options: {
                ariaLabel: t("dialog.modules.menu")
            }
        });
        
        const wrapper = document.querySelector(SELECTORS.CONTENT_WRAPPER);
        this.#details = wrapper ? wrapper.querySelectorAll('details') : [];

        this.#initSearchDialog();
    }

    mount() {
        super.mount();
        this.#setupAccordionBehavior();
        this.#setupAutoReset();
    }

    onLayoutChange(isDesktop) {
        this.#cleanup(); 

        this.#layoutController = new AbortController();
        const { signal } = this.#layoutController;

        this.#closeAllDetails();

        if (isDesktop) {
            this.#setupDesktop(signal);
        } else {
            this.#setupMobile(signal);
        }
    }

    #cleanup() {
        this.#cleanLayout();
        this.#cleanupOpenMenu();
    }

    #cleanLayout() {
        if (this.#layoutController) {
            this.#layoutController.abort();
            this.#layoutController = null;
        }
    }

    #cleanupOpenMenu() {
        if (this.#inertController) {
            this.#inertController.unlock();
            this.#inertController = null;
        }
        if (this.#openMenuController) {
            this.#openMenuController.abort();
            this.#openMenuController = null;
        }
    }

    #setupMobile(signal) {
        const dialog = this.element;

        this.#details.forEach(detail => {
            const backBtn = detail.querySelector(SELECTORS.BACK_BTN);
            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    this.#closeMenu(detail);
                }, { signal }); 
            }
        });

      const focusableSelectors = [
        'details:not(:open)',
        `details:not(:open) ${SELECTORS.BACK_BTN}`,
        '.main-menu--smartphone-utils'
      ].join(',');    

        this.#details.forEach(detail => {
            detail.addEventListener('toggle', () => {        
                if(detail.open) {
                    
                    this.#cleanupOpenMenu();

                    this.#openMenuController = new AbortController();
                    const openSignal = this.#openMenuController.signal;

                    const elementos = dialog.querySelectorAll(focusableSelectors);
                    this.#inertController = new InertController(elementos);
                    this.#inertController.lock();

                    detail.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            this.#closeMenu(detail);
                        }
                    }, { signal: openSignal });


                } else {
                    this.#cleanupOpenMenu();
                }
            }), { signal };
        });

    }

    #setupDesktop(signal) {        
        document.addEventListener('click', (e) => {            
            this.#details.forEach(detail => {
                if (detail.open) {
                    const isClickInside = detail.contains(e.target);
                    if (!isClickInside) {
                        detail.removeAttribute('open');
                    }
                }
            });            
        }, { signal });

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

    #closeMenu(target) {
        target.removeAttribute('open');                    
        const summary = target.querySelector('summary');
        if(summary) summary.focus();
    }

    #closeAllDetails() {
        this.#details.forEach(d => d.removeAttribute('open'));
    }

    #initSearchDialog() {
      if (__DEV__) console.log('⚙️ Inicializando <dialog id="search-dialog"> ...');
    
      const SELECTORS = {
        DIALOG: '#search-dialog',
        CONTENT_WRAPPER: '.main-nav__search-form', 
        TOGGLE_BTN: '#search-dialog-button'
      };
    
       this.#searchhDialog = new Dialog({
            dialogSelector: SELECTORS.DIALOG,
            openBtnSelector: SELECTORS.TOGGLE_BTN,
            contentSelector: SELECTORS.CONTENT_WRAPPER,
            options: {
                ariaLabel: t("dialog.modules.search"),
            }
        });

        this.#searchhDialog.mount();
    }
}