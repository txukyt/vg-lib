export default class FocusTrap {
  #element;
  
  // Añadido 'details > summary' para que detecte bien los botones de los acordeones
  #focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details:not(:open) > summary',
  ].join(',');

  #triggerElement; 

  constructor(element) {
    if (__DEV__) {
      this._debug = true; 
    }

    this.#element = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;
  }

  /**
   * Método PRIVADO auxiliar:
   * Calcula en tiempo real qué elementos son realmente accesibles.
   * Filtra ocultos, inertes y los que están dentro de details cerrados.
   */
  #getVisibleFocusables() {
    if (!this.#element) return [];

    const candidates = this.#element.querySelectorAll(this.#focusableSelectors);

    return Array.from(candidates).filter(el => {
      // 1. Chequeo nativo moderno (Cubre display:none, visibility:hidden, etc.)
      // Soporte: Chrome 105+, Firefox 106+, Safari 17.4+
      if (el.checkVisibility && !el.checkVisibility()) {
        return false;
      }

      // 2. Chequeo de INERT (Vital para tu menú por niveles)
      // Si el elemento (o sus padres) tiene inert, no es focuseable.
      if (el.closest('[inert]')) {
        return false;
      }

      // 3. Fallback para <details> (Por si checkVisibility falla o es antiguo)
      // Si estoy dentro de un details cerrado...
      const parentDetails = el.closest('details');
      if (parentDetails && !parentDetails.open) {
        // ...y NO soy el summary (el botón), entonces estoy oculto.
        if (el.tagName !== 'SUMMARY') {
          return false;
        }
      }

      // Si pasa todo, es válido
      return true;
    });
  }

  activate() {
    if (!this.#element) return;

    this.#triggerElement = document.activeElement;

    // Calculamos lista inicial para poner el primer foco
    const visibleElements = this.#getVisibleFocusables();

    if (visibleElements.length > 0) {
      // Movemos el foco al primero (normalmente btn cerrar o primer enlace)
      visibleElements[0].focus();
    }

    this.#element.addEventListener('keydown', this.#handleKeyDown);
  }

  deactivate() {
    if (!this.#element) return;

    this.#element.removeEventListener('keydown', this.#handleKeyDown);

    if (this.#triggerElement && this.#triggerElement.focus) {
      this.#triggerElement.focus();
    }
  }

  #handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    // 1. RECALCULAMOS SIEMPRE.
    // Esto es lo que te faltaba. En cada tabulación miramos cómo está el DOM ahora.
    const visibleElements = this.#getVisibleFocusables();
    
    if (visibleElements.length === 0) {
      e.preventDefault();
      return;
    }

    const firstFocusable = visibleElements[0];
    const lastFocusable = visibleElements[visibleElements.length - 1];
    const currentActive = document.activeElement;

    if (e.shiftKey) { 
      // SHIFT + TAB (Hacia atrás)
      
      // Si estoy en el primero, o si el foco se perdió (no está en la lista)
      if (currentActive === firstFocusable || !this.#element.contains(currentActive)) {
        if(__DEV__&& this._debug) console.log('↩️ Loop al final');
        e.preventDefault();
        lastFocusable.focus();
      }
      
    } else {
      // TAB (Hacia adelante)
      
      // Si estoy en el último
      if (currentActive === lastFocusable) {
        if(__DEV__&& this._debug) console.log('↪️ Loop al principio');
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }
}