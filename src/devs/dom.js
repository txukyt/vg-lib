
export function highlightIds() {
  const elements = document.querySelectorAll('[id]');
  elements.forEach(el => {
    el.style.outline = '2px dashed red';
    console.log(`🔍 Elemento con id="${el.id}"`);
  });
}

export function countElements() {
  const tags = {};
  document.querySelectorAll('*').forEach(el => {
    const tag = el.tagName.toLowerCase();
    tags[tag] = (tags[tag] || 0) + 1;
  });
  console.table(tags);
}

export function initializeFocusListener() {
  document.addEventListener('focusin', (event) => {
    console.log('⚡ Foco cambiado a:', event.target); 
    console.log('⚡ Etiqueta:', event.target.tagName);
  });
}