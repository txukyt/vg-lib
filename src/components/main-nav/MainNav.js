import Dialog from '@/components/dialog/Dialog.js';
import SearchDialog from '@/components/dialog/SearchDialog.js';
import { t } from '@/i18n';
import InertController from '@/utils/dom/InertController';

const SELECTORS = {
    DIALOG: '#menu-dialog',
    CONTENT_WRAPPER: '.nav-area', 
    TOGGLE_BTN: '#menu-button',
    BACK_BTN: '.js-back-accordion'
};

export default class MainNav extends Dialog {
    #details;
    #inertController;
    
    #layoutController;
    #openMenuController;
    #accordionController;
    #autoResetController;
    #searchDialog;

    constructor() {
        super({
            dialogSelector: SELECTORS.DIALOG,
            openBtnSelector: SELECTORS.TOGGLE_BTN,
            contentSelector: SELECTORS.CONTENT_WRAPPER,
            options: {
                ariaLabel: t("dialog.modules.menu"),
                animationClass: 'drawer-left',
                handleEscape: false, // Desactivamos el manejo de Escape del Dialog base porque MainNav tiene su propia lógica
            }
        });
        
        if (__DEV__) {
            this._debug = false;
        }
        const wrapper = document.querySelector(SELECTORS.CONTENT_WRAPPER);
        this.#details = wrapper ? wrapper.querySelectorAll('details') : [];

        this.#initSearchDialog();

        if (__DEV__ && this._debug) {
            import('@/devs/dom.js').then(({ initializeFocusListener }) => initializeFocusListener());
        }
    }

    mount() {
        super.mount();
        this.#setupAutoReset();
        this.#setupAccordionBehavior();

        this.contentElement.classList.remove('nav-area-loading');
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
            '.js-close-dialog',
            'details:not(:open)',
            'details:open summary',
            '.nav-list--utils'
        ].join(',');    

        this.#details.forEach(detail => {
            detail.addEventListener('toggle', () => {        
                if(detail.open) {
                    
                    this.#cleanupOpenMenu();

                    this.#openMenuController = new AbortController();
                    const openSignal = this.#openMenuController.signal;

                    const elementos = dialog.querySelectorAll(focusableSelectors);
                    this.#inertController = new InertController(elementos, { scrollContainer: `${SELECTORS.DIALOG} .dialog__content` });
                    this.#inertController.lock();

                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            this.#closeMenu(detail);
                        }
                    }, { signal: openSignal });


                } else {
                    this.#cleanupOpenMenu();
                }
            }, { signal });
        });

    }

    #setupDesktop(signal) {     
        const searchDetail = document.querySelector('.search-area > .nav-list__accordion');
        const detailsDesktop = searchDetail 
            ? [...this.#details, searchDetail] 
            : [...this.#details];

        document.addEventListener('click', (e) => {            
            detailsDesktop.forEach(detail => {
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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                detailsDesktop.forEach(detail => {
                    if (detail.open) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.#closeMenu(detail);
                    }
                });
            }
        }, { signal });
    }

    #setupAccordionBehavior() {
        this.#accordionController = new AbortController();
        const { signal } = this.#accordionController;

        this.#details.forEach(target => {
            target.addEventListener('toggle', () => {
                if (target.open) {
                    this.#details.forEach(d => {
                        if (d !== target && d.open) {
                            d.removeAttribute('open');
                        }
                    });
                }
            }, { signal });
        });
    }

    #setupAutoReset() {
        this.#autoResetController = new AbortController();
        const { signal } = this.#autoResetController;

        const dialogElement = document.querySelector(SELECTORS.DIALOG);
        if (dialogElement) {
            dialogElement.addEventListener('close', () => {
                this.#closeAllDetails();
            }, { signal });
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
    
        this.#searchDialog = new SearchDialog({
            dialogSelector: SELECTORS.DIALOG,
            openBtnSelector: SELECTORS.TOGGLE_BTN,
            contentSelector: SELECTORS.CONTENT_WRAPPER,
            options: {
                ariaLabel: t("dialog.modules.search"),
            }
        }).mount();
    }

    destroy() {
        // Limpieza de recursos específicos de MainNav
        this.#cleanup();

        // Limpiar event listeners de accordion y auto-reset
        if (this.#accordionController) {
            this.#accordionController.abort();
            this.#accordionController = null;
        }

        if (this.#autoResetController) {
            this.#autoResetController.abort();
            this.#autoResetController = null;
        }

        // Destruir el SearchDialog si existe
        if (this.#searchDialog) {
            this.#searchDialog.destroy();
            this.#searchDialog = null;
        }

        // Llamar al destroy del padre
        super.destroy();

        if (__DEV__ && this._debug) {
            console.log('[MainNav] Instancia destruida y recursos liberados.');
        }
    }
}