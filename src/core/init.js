// src/init.js
import { showVersion } from '@/utils/version';
import { init as initI18n } from '@/i18n';
import { init as initBreadcrumb } from '@/components/breadcrumb';
import { init as initButtons } from '@/components/buttons';
import { aside } from '@/components/aside';
import { ready } from '@/utils/dom';

// Lista de funciones de inicialización
const inits = [
  showVersion,
  initI18n,
  initButtons,
  initBreadcrumb,
  aside?.enableOnMobile,
  // aquí añadirás futuras inicializaciones
];

export const initialize = () => {
  inits.forEach((fn) => typeof fn === 'function' && fn());
};

ready(() => initialize());