/**
 * @namespace utils.env
 * @description Un conjunto de funciones de utilidad relacionadas con el entorno de ejecución.
 * @memberof utils
 */

import pkg from '@pkg';

/**
 * @function
 * @description Muestra la versión actual de la librería por consola.
 * @author David Mora <david.mora.pedregosa@seidor.com>
 * @memberof utils.env
 * @returns {void}
*/
export function showVersion() {
  console.log(`📦 j38-lib, versión: ${version}`);
}

/**
 * @type {string}
 * @description La versión actual de la librería, importada del archivo package.json.
 * @memberof utils.env
 */
export const version = pkg.version;