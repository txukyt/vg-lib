/**
 * Este módulo provee una función para manejar el evento 'resize' del navegador,
 * permitiendo elegir entre las técnicas de 'throttle' (limitación de frecuencia)
 * y 'debounce' (antirrebote) para optimizar el rendimiento.
 */

// -----------------------------------------------------------------------------
// 1. Función de utilidad para limitar la frecuencia de ejecución (Throttle)
// -----------------------------------------------------------------------------

/**
 * Crea una versión limitada de la función (throttle) que solo se puede ejecutar
 * una vez dentro de un período de tiempo definido, MIENTRAS el evento se dispara.
 * Ideal para actualizaciones continuas (ej. redibujar un Canvas)
 *
 * @param {function} func - La función a limitar.
 * @param {number} limit - El límite de tiempo en milisegundos.
 * @returns {function} La función limitada.
 */
const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;

    return function() {
        const context = this;
        const args = arguments;

        // Si es la primera vez, ejecutar inmediatamente
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            // Limpiar cualquier ejecución pendiente para asegurar que la última
            // ejecución respete el límite.
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

// -----------------------------------------------------------------------------
// 2. Función de utilidad para Antirrebote (Debounce)
// -----------------------------------------------------------------------------

/**
 * Crea una versión antirrebote (debounce) de la función que solo se ejecuta
 * UNA VEZ después de que los eventos han dejado de dispararse por 'delay' ms.
 * Ideal para tareas pesadas que solo deben ejecutarse al finalizar el resize.
 *
 * @param {function} func - La función a limitar.
 * @param {number} delay - El tiempo de espera en milisegundos.
 * @returns {function} La función antirrebote.
 */
const debounce = (func, delay) => {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        // Reinicia el temporizador en cada disparo del evento
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
};

// -----------------------------------------------------------------------------
// 3. Función Principal Exportada
// -----------------------------------------------------------------------------

/**
 * Configura un listener de eventos 'resize' al objeto global window,
 * aplicando el modo de control de rendimiento seleccionado.
 *
 * @param {function(Event): void} callback - La función a ejecutar.
 * @param {number} [delay=200] - El retardo en milisegundos para throttle/debounce.
 * @param {'throttle' | 'debounce'} [mode='throttle'] - El modo de control de frecuencia:
 * - 'throttle': Se ejecuta a intervalos regulares mientras se redimensiona.
 * - 'debounce': Se ejecuta una vez, DESPUÉS de que el redimensionamiento se detiene.
 * @returns {function(): void} Una función de limpieza para remover el listener ('unsubscribe').
 */
export const setupResizeHandler = (callback, delay = 200, mode = 'throttle') => {
    let controlledCallback;

    if (mode === 'debounce') {
        controlledCallback = debounce(callback, delay);
        console.log(`[Resize Handler] Listener configurado con MODO DEBOUNCE (${delay}ms de espera).`);
    } else {
        controlledCallback = throttle(callback, delay);
        console.log(`[Resize Handler] Listener configurado con MODO THROTTLE (${delay}ms de límite).`);
    }

    // Adjuntar el listener al objeto global window
    window.addEventListener('resize', controlledCallback);

    // Devolver una función de limpieza
    return () => {
        window.removeEventListener('resize', controlledCallback);
        console.log('[Resize Handler] Listener de resize eliminado.');
    };
};