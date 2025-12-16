const CSS_CLASS = 'scroll-disabled';

/**
 * Bloquea el scroll añadiendo una clase CSS al elemento objetivo o al body por defecto.
 * @param {string} [selector] - (Opcional) Selector del elemento (ej: '.mi-menu'). Si se omite, usa 'body'.
 */
export const disableScroll = (selector) => {
  const element = selector ? document.querySelector(selector) : document.documentElement;
  
  if (element) {
    element.classList.add(CSS_CLASS);
  } else {
    console.warn(`No se encontró el elemento con el selector: "${selector}"`);
  }
};

/**
 * Habilita el scroll eliminando la clase CSS del elemento objetivo o del body por defecto.
 * @param {string} [selector] - (Opcional) Selector del elemento (ej: '.mi-menu'). Si se omite, usa 'body'.
 */
export const enableScroll = (selector) => {
  const element = selector ? document.querySelector(selector) : document.documentElement;
  
  if (element) {
    element.classList.remove(CSS_CLASS);
  } else {
    console.warn(`No se encontró el elemento con el selector: "${selector}"`);
  }
};

/**
 * Resetea el scroll vertical y horizontal de un elemento a 0.
 * @param {HTMLElement|string} target - El elemento DOM o un selector CSS válido.
 */
export const resetElementScroll = (target) => {
    // Si es un string, buscamos el elemento. Si es un objeto, lo usamos directamente.
    const element = typeof target === 'string' ? document.querySelector(target) : target;

    // Validación defensiva: Si no existe, no hacemos nada (evita crashes).
    if (!element) return;

    // Reseteamos ejes Y y X
    element.scrollTop = 0;
    element.scrollLeft = 0;
};