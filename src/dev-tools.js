import * as Cookies from '@/devs/cookies.js';
import * as Storage from '@/devs/storage.js';
import * as Browser from '@/devs/browser.js';
import * as Debug from '@/devs/debug.js';
import * as Dom from '@/devs/dom.js';
import * as Performance from '@/devs/performance.js';

if (__DEV__) {
  window.VGDev = {
    ...Cookies,
    ...Storage,
    ...Browser,
    ...Debug,
    ...Dom,
    ...Performance
  };
}