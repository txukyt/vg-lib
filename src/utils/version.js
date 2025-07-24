import pkg from '@pkg';

export const version = pkg.version;

/**
 * Muestra la versión de la biblioteca vg-lib en la consola.
 */
export function showVersion() {
  console.log(`vg-lib v${version}`);
}
