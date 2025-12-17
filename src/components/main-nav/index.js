// /src/js/components/main-nav/index.js

import MainNav from "@/components/main-nav/MainNav.js";
import Dialog from '@/components/dialog/Dialog.js';

export const initMainNav = () => {
    if (__DEV__) console.log('🏗️ Inicializando <nav class="main-nav"> ...');
  new MainNav().mount();
  document.body.classList.contains('entorno-www') && initSearchDialog();
};

const initSearchDialog = () => {
  if (__DEV__) console.log('🏗️ Inicializando <dialog id="search-dialog"> ...');

  const SELECTORS = {
    DIALOG: '#search-dialog',
    CONTENT_WRAPPER: '.main-nav__search-form', 
    TOGGLE_BTN: '#search-dialog-button'
  };

   new Dialog({
        dialogSelector: SELECTORS.DIALOG,
        openBtnSelector: SELECTORS.TOGGLE_BTN,
        contentSelector: SELECTORS.CONTENT_WRAPPER,
    }).mount();
}