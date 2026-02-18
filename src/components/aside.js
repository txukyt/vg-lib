// src/components/aside.js
import { t } from "@/i18n";

const SELECTORS = {
    CONTAINER: 'aside',
    DIALOG: '#aside-dialog',
    CONTENT_WRAPPER: 'extra-content__content', 
    TOGGLE_BTN_CLASS: 'extra-content__toogle-btn',
    TOOGLE_BTN_KEYNAV: '#a11y-aside-trigger'
};

const ensureContentWrapper = (container) => {
    if (container.querySelector(`.${SELECTORS.CONTENT_WRAPPER}`)) return;

    const wrapper = document.createElement('div');
    wrapper.className = SELECTORS.CONTENT_WRAPPER;
    const children = [...container.childNodes];
    
    children.forEach(child => {
        wrapper.appendChild(child);
    });
    container.appendChild(wrapper);
};

/**
 * Crea el botón al principio del contenedor (fuera del wrapper de contenido)
 * @param {HTMLElement} container 
 */
const ensureToggleButton = (container) => {
    if (container.querySelector(`.${SELECTORS.TOGGLE_BTN_CLASS}`)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = SELECTORS.TOGGLE_BTN_CLASS;
    btn.innerHTML = `
    <span>${t("extra.menu")}</span>`;

    container.prepend(btn);
};

export const init = async () => {
    const desktopContainer = document.querySelector(SELECTORS.CONTAINER);

    if (!desktopContainer) return;

    ensureContentWrapper(desktopContainer);
    ensureToggleButton(desktopContainer);

    const { default: Dialog } = await import('@/components/dialog/Dialog');

    const asideDialog = new Dialog({
        dialogSelector: SELECTORS.DIALOG,
        openBtnSelector: `.${SELECTORS.TOGGLE_BTN_CLASS}`,
        contentSelector: `.${SELECTORS.CONTENT_WRAPPER}`,
        options: { 
            animationClass: 'drawer-top', 
            breakpoint: 992, 
            ariaLabel: t('dialog.modules.aside'),
            title: t('extra.menu')
         }
    });

    const a11yLink = document.querySelector(SELECTORS.TOOGLE_BTN_KEYNAV);

    if (a11yLink) {
        a11yLink.addEventListener('click', (e) => {
            const isMobile = window.matchMedia('(max-width: 991px)').matches;

            if (isMobile) {
                e.preventDefault();
                asideDialog.open();
            }
        });
    }

    if (__DEV__) {
        console.log('⚙️ Menú contextual: Wrapper y Botón generados.');
    }
};