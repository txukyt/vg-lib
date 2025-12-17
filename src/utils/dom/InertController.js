import { enableScroll, disableScroll } from "@/utils/dom/scroll.js";

export default class InertController {
  #targets = new Set();
  #lockScroll;

  /**
   * @param {string|HTMLElement|NodeList|Array} targets - Lo que quieres bloquear
   * @param {boolean} lockScroll - Si debe bloquear el scroll del body
   */
  constructor(targets = null, lockScroll = true) {
    this.#lockScroll = lockScroll;
    
    if (targets) {
      this.add(targets);
    }
  }

  /**
   * Método Universal para añadir objetivos.
   * Acepta: strings, elementos, NodeLists o Arrays mixtos.
   */
  add(input) {
    const elements = this.#resolveElements(input);
    elements.forEach(el => this.#targets.add(el));
  }

  /**
   * Método Mágico (Privado): Convierte cualquier entrada en un array de Elementos
   */
  #resolveElements(input) {
    // 1. Si es nulo o undefined
    if (!input) return [];

    // 2. Si es un String (Selector CSS)
    if (typeof input === 'string') {
      return Array.from(document.querySelectorAll(input));
    }

    // 3. Si es un Elemento DOM único
    if (input instanceof Element) {
      return [input];
    }

    // 4. Si es una colección (NodeList, HTMLCollection o Array)
    if (input instanceof NodeList || input instanceof HTMLCollection || Array.isArray(input)) {
      // Recursividad: Por si pasas un array mixto ['.clase', divElement]
      return Array.from(input).flatMap(item => this.#resolveElements(item));
    }

    return [];
  }

  /**
   * Bloquea hijos excepto la rama activa (Recursivo)
   */
  addParentExcept(parent, keepActive) {
    // Usamos el resolver para obtener el primer elemento válido
    const parentEl = this.#resolveElements(parent)[0];
    const activeEl = this.#resolveElements(keepActive)[0];

    if (!parentEl || !activeEl) return;

    // 1. Bloqueo recursivo hacia abajo
    this.#blockSiblingsPath(parentEl, activeEl);

    // 2. Limpieza de seguridad hacia arriba (Ancestros)
    // Aseguramos que ningún padre del elemento activo haya caído en la lista negra por error
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
    if (this.#lockScroll) {
      // Usa tu utilidad o clase CSS preferida
      disableScroll();
    }
    
    this.#targets.forEach(el => {
      // Seguridad: Nunca bloquear el elemento que tiene el foco
      if (el.contains(document.activeElement)) return;

      if (el) {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      }
    });
  }

  unlock() {
    if (this.#lockScroll) {
      enableScroll();
    }
    
    this.#targets.forEach(el => {
      if (el) {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    });
    // Opcional: Limpiar el Set al desbloquear para empezar de cero la próxima vez
    // this.#targets.clear(); 
  }
  
  // Método extra para limpiar manualmente
  clear() {
      this.unlock();
      this.#targets.clear();
  }
}