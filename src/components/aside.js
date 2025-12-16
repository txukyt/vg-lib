// src/components/aside.js
import Dialog from '@/components/dialog/Dialog';
import { t } from "@/i18n";

// --- CONSTANTES ---
const SELECTORS = {
    CONTAINER: 'aside',
    DIALOG: '#aside-dialog',
    // Esta clase la usaremos tanto para buscarlo como para crearlo
    CONTENT_WRAPPER: 'extra-content__content', 
    TOGGLE_BTN_CLASS: 'extra-content__toogle-btn'
};

const TOGGLE_BTN_ICON = `
    <span>${t("extra.menu")}</span>
`;

// --- FUNCIONES DOM ---

/**
 * Envuelve todo el contenido actual del contenedor en un nuevo div
 * @param {HTMLElement} container 
 */
const ensureContentWrapper = (container) => {
    // 1. Si ya existe el wrapper, no hacemos nada (idempotencia)
    if (container.querySelector(`.${SELECTORS.CONTENT_WRAPPER}`)) return;

    // 2. Crear el div wrapper
    const wrapper = document.createElement('div');
    wrapper.className = SELECTORS.CONTENT_WRAPPER;

    // 3. Mover todos los hijos actuales del container dentro del wrapper
    // Usamos spread [...] para crear un array estático, ya que childNodes es "vivo" 
    // y puede dar problemas al iterar mientras se mueve.
    const children = [...container.childNodes];
    
    children.forEach(child => {
        wrapper.appendChild(child);
    });

    // 4. Insertar el wrapper (que ahora contiene todo) de nuevo en el container
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
    btn.innerHTML = TOGGLE_BTN_ICON;

    // Lo ponemos al principio (quedará encima/antes del wrapper)
    container.prepend(btn);
};

// --- INICIALIZACIÓN ---

export const initContextualMenu = () => {
    const desktopContainer = document.querySelector(SELECTORS.CONTAINER);

    if (!desktopContainer) return;

    // PASO 1: Envolver el contenido existente (texto, links, etc.)
    ensureContentWrapper(desktopContainer);

    // PASO 2: Crear el botón (quedará fuera del wrapper, ideal para que no se oculte con él)
    ensureToggleButton(desktopContainer);

    // PASO 3: Iniciar Dialog
    new Dialog({
        dialogSelector: SELECTORS.DIALOG,
        openBtnSelector: `.${SELECTORS.TOGGLE_BTN_CLASS}`,
        contentSelector: `.${SELECTORS.CONTENT_WRAPPER}`, // Pasamos la clase del nuevo wrapper
        options: { animationClass: 'drawer-bottom', breakpoint: 991, ariaLabel: t('dialog.label.menuContextual') }
    }).mount();

    if (__DEV__) {
        console.log('✅ Menú contextual: Wrapper y Botón generados.');
    }
};