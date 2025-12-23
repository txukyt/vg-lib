// src/core/init.js

import { showVersion } from '@/utils/browser/version';
import { init as initDictionary } from '@/i18n';
import { init as initMainNav } from '@/components/main-nav';
import { init as initAside } from '@/components/aside';
import { init as initBreadcrumb } from '@/components/breadcrumb';

const inits = [
  initMainNav,
  initAside,
  initBreadcrumb,
];

export const initialize = async () => {
  showVersion();
  await initDictionary();

  const promises = inits
    .filter(fn => typeof fn === 'function')
    .map(fn => fn());

  await Promise.all(promises);
};