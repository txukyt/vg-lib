/**
 * Registra eventos globales para cerrar la capa asociada
 * al toggle cuando se hace click fuera o se presiona Escape.
 * @param {Object} toggleInstance - Instancia con métodos getState y setState, y propiedades node y controls.
 */
export function attachToggleDismiss(toggleInstance) {
  const { node, controls } = toggleInstance;

  // Manejador de click fuera
  toggleInstance._clickOutsideHandler = (e) => {
    if (!node.contains(e.target) && !controls.contains(e.target)) {
      toggleInstance.setState(false);
    }
  };

  // Manejador de tecla Escape
  toggleInstance._escHandler = (e) => {
    if (e.key === 'Escape' && getState()) {
      toggleInstance.setState(false);
      node.focus();
    }
  };

  // Adjunta eventos
  document.addEventListener('click', toggleInstance._clickOutsideHandler);
  document.addEventListener('keydown', toggleInstance._escHandler);
}

/**
 * Elimina los eventos de auto-cierre previamente registrados.
 * @param {Object} toggleInstance
 */
export function detachToggleDismiss(toggleInstance) {
  if (toggleInstance._clickOutsideHandler) {
    document.removeEventListener('click', toggleInstance._clickOutsideHandler);
    delete toggleInstance._clickOutsideHandler;
  }
  if (toggleInstance._escHandler) {
    document.removeEventListener('keydown', toggleInstance._escHandler);
    delete toggleInstance._escHandler;
  }
}
