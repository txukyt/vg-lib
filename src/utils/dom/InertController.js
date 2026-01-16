import { enableScroll, disableScroll } from "@/utils/dom/scroll.js";

export default class InertController {
  #targets = new Set();
  #lockScroll;
  #scrollContainer; // 1. Nuevo campo privado para guardar quién se bloquea

  /**
   * @param {string|HTMLElement|NodeList|Array} targets - Elementos a volver inertes
   * @param {Object} options - Configuración
   * @param {boolean} [options.lockScroll=true] - Si debe bloquear el scroll
   * @param {string|HTMLElement} [options.scrollContainer=document.body] - El elemento al que quitar el scroll
   */
  constructor(targets = null, options = {}) {
    // 2. Desestructuramos las opciones con valores por defecto
    const { 
        lockScroll = true, 
        scrollContainer = document.body // Por defecto el body
    } = options;

    this.#lockScroll = lockScroll;
    this.#scrollContainer = scrollContainer;
    
    if (targets) {
      this.add(targets);
    }
  }

  add(input) {
    const elements = this.#resolveElements(input);
    elements.forEach(el => this.#targets.add(el));
  }

  #resolveElements(input) {
    if (!input) return [];
    if (typeof input === 'string') {
      return Array.from(document.querySelectorAll(input));
    }
    if (input.nodeType === 1) {
      return [input];
    }
    if (input.length !== undefined && typeof input !== 'function') {
      return Array.from(input).flatMap(item => this.#resolveElements(item));
    }

    return [];
  }

  addParentExcept(parent, keepActive) {
    const parentEl = this.#resolveElements(parent)[0];
    const activeEl = this.#resolveElements(keepActive)[0];

    if (!parentEl || !activeEl) return;

    this.#blockSiblingsPath(parentEl, activeEl);

    let current = activeEl.parentElement;
    while (current && current !== document.body) {
      if (this.#targets.has(current)) {
        this.#targets.delete(current);
      }
      if (current === parentEl) break;
      current = current.parentElement;
    }
  }

  #blockSiblingsPath(container, target) {
    Array.from(container.children).forEach(child => {
      if (child === target) return;
      if (child.contains(target)) {
        this.#blockSiblingsPath(child, target);
      } else {
        this.#targets.add(child);
      }
    });
  }

  lock() {
    // 4. Pasamos el contenedor a la función de utilidad
    if (this.#lockScroll && this.#scrollContainer) {
      disableScroll(this.#scrollContainer);
    }
    
    this.#targets.forEach(el => {
      //if (el.contains(document.activeElement)) return;
      if (el) {
        el.setAttribute('inert', '');
        //el.setAttribute('aria-hidden', 'true');
      }
    });
  }

  unlock() {
    // 5. Pasamos el contenedor para desbloquear
    if (this.#lockScroll && this.#scrollContainer) {
      enableScroll(this.#scrollContainer);
    }
    
    this.#targets.forEach(el => {
      if (el) {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    });
  }
  
  clear() {
      this.unlock();
      this.#targets.clear();
  }
}