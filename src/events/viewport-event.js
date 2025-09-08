export function onViewportChange(callback) {
  let timeout;
  window.addEventListener('resize', () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, 150);
  });
}