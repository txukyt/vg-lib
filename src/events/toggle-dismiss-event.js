
export function attachToggleDismiss(toggleInstance) {
  const { node, controls, root } = toggleInstance;

  // Manejador de click fuera
  toggleInstance._clickOutsideHandler = (e) => {
    const path = e.composedPath(); // array con todos los nodos desde el target hasta window
    const realTarget = path[0];    // el nodo real que disparó el evento

    if (controls !== realTarget && !controls.contains(realTarget) && node !== realTarget && !node.contains(realTarget)) {
      toggleInstance.setState(false);
    }
  };

  // Manejador de tecla Escape
  toggleInstance._escHandler = (e) => {
    if (e.key === 'Escape' && toggleInstance.getState()) {
      toggleInstance.setState(false);
      node.focus();
    }
  };

  // Adjunta eventos
  document.addEventListener('click', toggleInstance._clickOutsideHandler);
  root.addEventListener('keydown', toggleInstance._escHandler);
}

export function detachToggleDismiss(toggleInstance) {
 const { root } = toggleInstance;

  if (toggleInstance._clickOutsideHandler) {
    document.removeEventListener('click', toggleInstance._clickOutsideHandler);
    delete toggleInstance._clickOutsideHandler;
  }
  if (toggleInstance._escHandler) {
    root.removeEventListener('keydown', toggleInstance._escHandler);
    delete toggleInstance._escHandler;
  }
}
