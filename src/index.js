// Exportaciones individuales (ESM)
export { saludar } from '@/components/saludo.js';
export { showVersion } from '@/utils/version.js';
export { menuContextual } from '@/components/aside.js';

// Reunir todo lo que se debe exponer como IIFE en `window.vgLib`
import { saludar } from '@/components/saludo.js';
import { showVersion } from '@/utils/version.js';
import { menuContextual } from '@/components/aside.js';

const VGLib = {
  saludar,
  showVersion,
  menuContextual,
};

// Auto-inicialización (solo navegador)
if (typeof window !== 'undefined') {
  window.vgLib = window.vgLib || {};
  Object.assign(window.vgLib, VGLib);

  const inits = [
    menuContextual?.habilitarMenuContextualEnMovil,
    // futuras funciones init aquí...
  ];

  const runAll = () => inits.forEach((fn) => typeof fn === 'function' && fn());

  if (document.readyState !== 'loading') {
    runAll();
  } else {
    document.addEventListener('DOMContentLoaded', runAll);
  }
}
