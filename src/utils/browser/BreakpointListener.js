export default class BreakpointListener {
  #mediaQuery;
  #callback;
  #boundHandler; // Para poder eliminar el listener después

  /**
   * @param {string|number} query - Ej: 992 o '(min-width: 992px)'
   * @param {Function} callback - Función que recibe (isMatch, event)
   */
  constructor(query, callback) {
    if (__DEV__) {
      this._debug = true; 
    }

    // Si pasas un número, asumimos min-width en px
    const queryString = typeof query === 'number' 
      ? `(min-width: ${query}px)` 
      : query;

    this.#mediaQuery = window.matchMedia(queryString);
    this.#callback = callback;

    // Guardamos la referencia ligada para poder hacer removeEventListener
    this.#boundHandler = (e) => this.#handleChange(e);

    this.init();
  }

  init() {
    // 1. Escuchar cambios
    this.#mediaQuery.addEventListener('change', this.#boundHandler);
    
    // 2. Ejecutar inmediatamente el estado inicial
    // Simulamos un evento para que el callback reciba siempre lo mismo
    this.#handleChange(this.#mediaQuery);
  }

  #handleChange(e) {
    if (e.matches) {
      if(__DEV__ && this._debug) console.log('⚡ Cambio a modo: ESCRITORIO');
    } else {
      if(__DEV__ && this._debug) console.log('⚡ Cambio a modo: MÓVIL');
    }
    // Ejecutamos tu función pasando:
    // 1. isMatch (true/false) -> Lo más útil
    // 2. El evento completo -> Por si necesitas más datos
    this.#callback(e.matches, e);
  }

  /**
   * Devuelve true si la media query se cumple actualmente.
   * Uso: this.listener.matches
   */
  get matches() {
    return this.#mediaQuery.matches;
  }

  /**
   * Limpieza de memoria
   */
  destroy() {
    this.#mediaQuery.removeEventListener('change', this.#boundHandler);
  }
}