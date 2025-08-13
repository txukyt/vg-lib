/**
 * Ejecuta una función cuando cambia el tamaño de la ventana.
 * Usa debounce para evitar llamadas excesivas.
 * @param {Function} callback
 */
export function onViewportChange(callback) {
  let timeout;
  window.addEventListener('resize', () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, 150);
  });
}