/**
 * Indica si la resolución actual corresponde a escritorio (>= 1200px).
 * @returns {boolean}
 */
export function isDesktopViewport() {
  return window.matchMedia('(min-width: 1200px)').matches;
}