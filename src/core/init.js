// src/core/init.js

import { showVersion } from '@/utils/browser/version';
import { init as initDictionary } from '@/i18n';
import { init as initMainNav } from '@/components/main-nav';
import { init as initAside } from '@/components/aside';
import { init as initBreadcrumb } from '@/components/breadcrumb';
import { init as initNetworks } from '@/components/networks';

const inits = [
  initMainNav,
  initAside,
  initBreadcrumb,
  initNetworks,
];

export const initialize = async () => {
  showVersion();
  await initDictionary();

  const promises = inits
    .filter(fn => typeof fn === 'function')
    .map(fn => fn());

  await Promise.all(promises);
};