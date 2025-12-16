/**
 * Mueve un elemento del DOM a un nuevo contenedor.
 * Si el elemento ya está ahí, no hace nada.
 * * @param {HTMLElement} element - El elemento que queremos mover (viajero)
 * @param {HTMLElement} destination - El contenedor destino (anfitrión)
 */
export function teleport(element, destination) {
  // 1. Chequeos de seguridad: ¿Existen ambos?
  if (!element || !destination) {
    console.warn('Teleport: Faltan elementos', { element, destination });
    return;
  }

  // 2. Optimización: Si ya está dentro, no tocamos el DOM
  // (Aunque appendChild lo gestiona, el contains evita repintados innecesarios)
  if (!destination.contains(element)) {
    destination.appendChild(element);
  }
}