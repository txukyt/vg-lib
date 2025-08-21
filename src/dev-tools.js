import * as Cookies from '@/devs/cookies.js';
import * as Storage from '@/devs/storage.js';
import * as Browser from '@/devs/browser.js';

if (__DEV__) {
  window.VgDev = {
    ...Cookies,
    ...Storage,
    ...Browser
  };
}
