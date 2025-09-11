/**
 * @namespace utils.browser
 * @description Un conjunto de funciones de utilidad relacionadas con navegador.
 * @memberof utils
 */

/**
 * @function
 * @description Comprueba si la ventana actual tiene un tamaño de escritorio o superior.
 * @param {number} [minWidth=1200] El ancho mínimo en píxeles para ser considerado un viewport de escritorio.
 * @memberof utils.browser
 * @returns {boolean} Devuelve `true` si el ancho del viewport es mayor o igual a `minWidth`, de lo contrario devuelve `false`.
 */
export function isDesktopViewport(minWidth = 1200) {
  return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
}

/**
 * @function
 * @description Comprueba si el dispositivo actual es un dispositivo iOS (iPhone, iPad o iPod).
 * @memberof utils.browser
 * @returns {boolean} Devuelve `true` si la cadena del agente de usuario indica un dispositivo iOS y no es Microsoft Stream, de lo contrario devuelve `false`.
 */
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * @function
 * @description Comprueba si la aplicación se está ejecutando en modo "standalone" (instalada como una PWA en la pantalla de inicio).
 *
 * En iOS, utiliza la propiedad `window.navigator.standalone`.
 * En otros navegadores, utiliza la media query `(display-mode: standalone)`.
 *
 * @memberof utils.browser
 * @returns {boolean} Devuelve `true` si la aplicación está en modo "standalone", de lo contrario devuelve `false`.
 */
export function isInStandalone() {
  if (isIOS()) {
    return window.navigator.standalone === true;
  } else {
    return window.matchMedia('(display-mode: standalone)').matches;
  }
}

/**
 * @function
 * @description Comprueba si el dispositivo es un dispositivo móvil (es decir, usa un tipo de puntero "grueso" como un dedo).
 * @memberof utils.browser
 * @returns {boolean} Devuelve `true` si el dispositivo tiene un puntero grueso (táctil), de lo contrario devuelve `false`.
 */
export function isMobileDevice () {
  return window.matchMedia("(pointer: coarse)").matches;
}