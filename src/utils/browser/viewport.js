
export function isDesktopViewport(minWidth = 1200) {
  return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
}

export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function isInStandalone() {
  if (isIOS()) {
    return window.navigator.standalone === true;
  } else {
    return window.matchMedia('(display-mode: standalone)').matches;
  }
}

export function isMobileDevice () {
  return window.matchMedia("(pointer: coarse)").matches;
}