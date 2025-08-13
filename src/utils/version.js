import pkg from '@pkg';

export const version = pkg.version;

export function showVersion() {
  console.log(`Inicializando la libreria vg-lib de J38 con la versión: ${version}`);
}
