import { t } from '@/i18n/index.js';

/**
 * Saluda a la persona con el nombre proporcionado.
 * @global
 * @author David Mora <david.mora.pedregosa@seidor.com>
 * @param {string} nombre - El nombre de la persona a saludar.
 * @returns {void}
 */

export function hello(nombre = t('saludo.mundo')) {
  if (typeof window !== 'undefined') {
    alert(t('saludo.mensaje', { nombre }));
  } else {
    console.log(t('saludo.mensaje', { nombre }));
  }
}
