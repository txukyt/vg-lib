/**
 * Utility para detectar y ocultar párrafos vacíos o que solo contienen &nbsp;
 * Añade la clase 'empty-paragraph' a los párrafos que cumplan la condición
 */

/**
 * Comprueba si un párrafo está vacío o solo contiene espacios en blanco/&nbsp;
 * @param {HTMLParagraphElement} paragraph - El párrafo a comprobar
 * @returns {boolean} - True si el párrafo está vacío o solo tiene &nbsp;/espacios
 */
function isEmptyParagraph(paragraph) {
    if (!paragraph) return false;

    // Verificar si tiene elementos hijos significativos (enlaces, imágenes, etc.)
    // que no sean solo <br> o elementos vacíos
    const children = paragraph.children;
    let hasSignificantChildren = false;
    
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        // Considerar significativos: a, img, span, strong, em, etc.
        // No considerar significativos: br, wbr
        const tagName = child.tagName.toLowerCase();
        if (tagName !== 'br' && tagName !== 'wbr') {
            hasSignificantChildren = true;
            break;
        }
    }
    
    // Si tiene elementos hijos significativos, no es un párrafo vacío
    if (hasSignificantChildren) {
        return false;
    }

    // Obtener el texto contenido, eliminando espacios
    const textContent = paragraph.textContent || '';
    const trimmedContent = textContent.trim();

    // Comprobar si está vacío o solo contiene &nbsp; (Unicode: \u00A0)
    // o espacios en blanco normales
    if (trimmedContent === '' || trimmedContent === '\u00A0') {
        return true;
    }

    // Comprobar si el innerHTML solo contiene &nbsp; o espacios
    const innerHTML = paragraph.innerHTML || '';
    const cleanedHTML = innerHTML
        .replace(/&nbsp;/gi, '')
        .replace(/\u00A0/g, '')
        .replace(/\s/g, '')
        .trim();

    return cleanedHTML === '';
}

/**
 * Añade la clase 'empty-paragraph' a los párrafos vacíos de la página
 * @param {string} containerSelector - Selector opcional para limitar el ámbito (default: 'body')
 */
export function markEmptyParagraphs(containerSelector = 'body') {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn(`EmptyParagraphChecker: No se encontró el contenedor "${containerSelector}"`);
        return;
    }

    const paragraphs = container.querySelectorAll('p');
    let markedCount = 0;

    paragraphs.forEach(paragraph => {
        if (isEmptyParagraph(paragraph)) {
            paragraph.classList.add('hidden');
            markedCount++;
        }
    });

    if (__DEV__) {
        console.log(`EmptyParagraphChecker: Se marcaron ${markedCount} párrafos vacíos`);
    }
}

/**
 * Inicializa el checker ejecutándolo cuando el DOM esté listo
 * @param {string} containerSelector - Selector opcional para limitar el ámbito
 */
export function initEmptyParagraphChecker(containerSelector = '#wb021contenido') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            markEmptyParagraphs(containerSelector);
        });
    } else {
        // DOM ya está cargado
        markEmptyParagraphs(containerSelector);
    }
}

export default {
    isEmptyParagraph,
    markEmptyParagraphs,
    initEmptyParagraphChecker
};

