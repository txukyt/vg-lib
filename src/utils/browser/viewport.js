/**
 * Indica si la resolución actual corresponde a escritorio (>= 1200px).
 * @param {*} minWidth
 * @returns {boolean}
 */
export function isDesktopViewport(minWidth = 1200) {
  return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
}


/**
 * Indica si el dispositivo es iOS.
 * @returns {boolean}
 */
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Indica si la aplicación se está ejecutando en modo "standalone".
 * @returns {boolean}
 */
export function isInStandalone() {
  if (isIOS()) {
    return window.navigator.standalone === true;
  } else {
    return window.matchMedia('(display-mode: standalone)').matches;
  }
}

/**
 * Indica si el dispositivo es móvil.
 * @returns {boolean}
 */
export function isMobileDevice () {
  return window.matchMedia("(pointer: coarse)").matches;
}