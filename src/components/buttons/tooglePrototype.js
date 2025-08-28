// components/toggle/toggle-button.js
import { attachToggleDismiss, detachToggleDismiss } from '@/events/toggle-dismiss-event.js';
import { isDesktopViewport } from '@/utils/browser/viewport.js';
import { onViewportChange } from '@/events/viewport-event.js';

export const toggleButtonProto = {
  root: null,
  node: null,
  controls: null,
  _clickHandler: null,
  _initialized: false,

  /**
   * Inicializa el toggle en un botón y su capa asociada.
   * @param {HTMLElement} buttonNode - Elemento botón con atributo aria-controls.
   */
  init(buttonNode) {
    this.node = buttonNode;
    this.root = buttonNode.getRootNode();

    const controlledId = this.node.getAttribute('aria-controls');
    this.controls = controlledId ? this.root.getElementById(controlledId) : null;

    if (!this.controls) {
      console.warn('toggleButtonProto: no se encontró la capa asociada');
      return;
    }

    // Revisamos si se desactiva en escritorio
    const disabledOnDesktop = this.node.hasAttribute('data-disable-toggle-desktop');

    const handleResize = () => {
      const isDesktop = isDesktopViewport();
      const shouldDisableToggle = isDesktop && disabledOnDesktop;

      // Si está deshabilitado en escritorio
      if (shouldDisableToggle) {
        if (this._initialized) {
          this.destroy();
          this._initialized = false;
        }

        // Forzar visibilidad y accesibilidad activada
        this.node.setAttribute('aria-expanded', 'true');
        this.controls.hidden = false;
        this.controls.setAttribute('aria-hidden', 'false');
      } else {
        if (!this._initialized) {
          this._initializeToggle();
          this._initialized = true;
        }

        // En móvil, ocultar por defecto
        if (!isDesktop && disabledOnDesktop) {
          this.setState(false);
        }
      }
    };

    // Ejecutar ahora y en cambios de tamaño
    handleResize();
    onViewportChange(handleResize);
  },

  _initializeToggle() {
    this.controls.style.display = '';
    const initial = this.getState();
    this.setState(initial);

    this._clickHandler = (e) => {
      e.preventDefault();
      this.toggleState();
    };
    this.node.addEventListener('click', this._clickHandler);
  },

  /**
   * Devuelve el estado actual (expandido o no).
   * @returns {boolean}
   */
  getState() {
    return this.node.getAttribute('aria-expanded') === 'true';
  },

  /**
   * Muestra u oculta la capa según el estado.
   * Además añade o quita listeners de auto-cierre.
   * @param {boolean} state
   */
  setState(state) {
    this.node.setAttribute('aria-expanded', state);
    this.controls.hidden = !state;
    this.controls.setAttribute('aria-hidden', !state);

    if (state) {
      attachToggleDismiss(this);
    } else {
      detachToggleDismiss(this);
    }
  },

  /**
   * Invierte el estado actual.
   */
  toggleState() {
    this.setState(!this.getState());
  },

  /**
   * Limpia totalmente el prototipo y eventos.
   */
  destroy() {
    if (this._clickHandler) {
      this.node.removeEventListener('click', this._clickHandler);
      this._clickHandler = null;
    }
    detachToggleDismiss(this);
  }
};
