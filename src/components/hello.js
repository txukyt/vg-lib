import { t } from '@/i18n/index.js';

/**
 * Saluda a la persona con el nombre proporcionado.
 * @param {string} nombre - El nombre de la persona a saludar.
 */

export function hello(nombre = t('saludo.mundo')) {
  if (typeof window !== 'undefined') {
    alert(t('saludo.mensaje', { nombre }));
  } else {
    console.log(t('saludo.mensaje', { nombre }));
  }
}
