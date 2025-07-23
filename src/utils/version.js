import pkg from '@pkg';

export const version = pkg.version;

export function showVersion() {
  console.log(`vg-lib v${version}`);
}
