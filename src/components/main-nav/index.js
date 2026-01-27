// /src/js/components/main-nav/index.js

const SELECTORS = {
  HEADER : 'header.header > .header-main'
};

export const init = async () => { 
  const headerWeb = document.querySelector(SELECTORS.HEADER);

  if (!headerWeb || document.body.classList.contains('entorno-blogs')) return;

  const { default: MainNav } = await import('@/components/main-nav/MainNav.js');

  if (__DEV__) console.log('⚙️ Inicializando <nav class="main-nav"> ...');
  
  new MainNav().mount();
};

