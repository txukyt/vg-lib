import { t, getI18nInstance, init as initI18n } from '@/i18n/index.js';
import { lang } from '@/utils/lang'

function accionAbrirCerrarMenuContextual(menu) {
  return (evt) => {
    menu.classList.toggle('extra-content--opened');
    document.documentElement.classList.toggle('scroll-disabled');
    evt.stopPropagation();
  };
}

function generarBotonShowHide(menu) {
  const idioma = lang();
  const element = document.createElement('button');
  const resultElement = document.querySelector('.result');
  const key = resultElement ? 'resultados' : 'menu';
  const texto = t(`extra.${idioma}.${key}`);
  element.classList.add('extra-content__toogle-btn');
  element.dataset.text = texto;
  element.innerHTML = texto;
  if (!resultElement) element.classList.add('menu');
  element.addEventListener('click', accionAbrirCerrarMenuContextual(menu));
  return element;
}

function generarCapaOscurecer(menu) {
  const element = document.createElement('div');
  element.classList.add('extra-content-close');
  element.addEventListener('click', accionAbrirCerrarMenuContextual(menu));
  return element;
}

function generarEventoSwiped(boton, menu) {
  document.addEventListener('swiped-down', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('extra-content--opened')) boton.click();
  });
  menu.addEventListener('swiped-up', (e) => {
    e.stopPropagation();
    if (!menu.classList.contains('extra-content--opened')) boton.click();
  });
}

function wrapContenidoDelMenuParaHacerScroll(menu) {
  menu.innerHTML = `<div class="extra-content__content">${menu.innerHTML}</div>`;
}

function unirMenusConsecutivos(menu) {
  if (!menu) return;
  menu.id = 'a11y-aside';
  const menus = Array.from(menu.parentNode.children);
  for (const m of menus) {
    if (m.tagName?.toLowerCase() === 'aside' && m.isEqualNode && !m.isEqualNode(menu)) {
      menu.innerHTML += m.innerHTML;
      m.remove();
    }
  }
}

function limpiarHtmlBasuraAntiguo() {
  const viejo = document.querySelector('.aside-tabletMobile');
  if (viejo) {
    const parent = viejo.parentNode;
    parent.removeChild(viejo.previousElementSibling);
    parent.removeChild(viejo);
  }
}

function comparar2Arrays(a, b) {
  if (a.length !== b.length) return false;
  const uniqueValues = new Set([...a, ...b]);
  return [...uniqueValues].every(v => {
    const aCount = a.filter(e => e === v).length;
    const bCount = b.filter(e => e === v).length;
    return aCount === bCount;
  });
}

function initMenuContextual(menu) {
  if (!menu?.firstChild) return;
  const url = window.location.href;
  const enlace = menu.firstChild.href;
  const urlId = url.split('?')[0];
  const enlaceId = enlace?.split('?')[0];
  const urlParams = url.includes('?') ? url.split('?')[1].split('&') : null;
  const enlaceParams = enlace?.includes('?') ? enlace.split('?')[1].split('&') : null;
  if (!urlId || !enlaceId || !urlParams || !enlaceParams) return;
  if (urlId !== enlaceId || !comparar2Arrays(urlParams, enlaceParams)) return;
  menu.innerHTML = `<span class="nombre_tema">${menu.firstChild.textContent}</span>`;
}

async function init(menu) {
  if (!menu) return;
  if(!getI18nInstance()) await initI18n();
  wrapContenidoDelMenuParaHacerScroll(menu);
  const boton = generarBotonShowHide(menu);
  menu.insertBefore(boton, menu.firstChild);
  generarEventoSwiped(boton, menu);
  menu.parentNode.insertBefore(generarCapaOscurecer(menu), menu.nextSibling);
}

function enableOnMobile() {
  limpiarHtmlBasuraAntiguo();
  unirMenusConsecutivos(document.querySelector('.extra-content'));
  init(document.querySelector('.extra-content'));
  initMenuContextual(document.querySelector('.texto.primero'));
}

// Export ES Module
export const aside = {
  enableOnMobile,
};
