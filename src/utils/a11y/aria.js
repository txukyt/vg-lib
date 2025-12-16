// src/utils/a11y/aria.js

/**
 * Establece varios atributos aria a la vez
 */
export const setAriaAttributes = (element, attributes) => {
    Object.keys(attributes).forEach(key => {
        element.setAttribute(`aria-${key}`, attributes[key]);
    });
};

/**
 * Alterna el estado de aria-expanded
 */
export const toggleAriaExpanded = (triggerElement) => {
    const isExpanded = triggerElement.getAttribute('aria-expanded') === 'true';
    triggerElement.setAttribute('aria-expanded', !isExpanded);
};

/**
 * Helper para ocultar visualmente pero no para screen readers
 * (Aunque esto suele ser CSS, a veces se gestiona via JS attributes como hidden)
 */
export const setAriaHidden = (element, isHidden) => {
    if (isHidden) {
        element.setAttribute('aria-hidden', 'true');
    } else {
        element.removeAttribute('aria-hidden');
    }
};

/**
 * Establece el atributo aria-haspopup.
 * Indica que el elemento activa un elemento interactivo emergente (menú, diálogo, etc.).
 * * Valores válidos según W3C: 'false', 'true', 'menu', 'listbox', 'tree', 'grid', 'dialog'.
 * * @param {HTMLElement} element - El botón o disparador.
 * @param {string} [type='dialog'] - El tipo de popup. Por defecto es 'dialog'.
 */
export const setAriaHasPopup = (element, type = 'dialog') => {
    // Validación básica opcional (para avisarte en desarrollo si pones algo raro)
    if (__DEV__) {
        const validValues = ['false', 'true', 'menu', 'listbox', 'tree', 'grid', 'dialog'];
        if (!validValues.includes(type)) {
            console.warn(`[A11y] Valor no válido para aria-haspopup: "${type}". Valores permitidos: ${validValues.join(', ')}`);
        }
    }

    element.setAttribute('aria-haspopup', type);
};

/**
 * Vincula un botón con el elemento que controla (aria-controls).
 * @param {HTMLElement} triggerElement 
 * @param {string} targetId 
 */
export const setAriaControls = (triggerElement, targetId) => {
    triggerElement.setAttribute('aria-controls', targetId);
};