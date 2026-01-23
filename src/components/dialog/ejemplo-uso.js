import SearchDialog from './SearchDialog.js';

// Ejemplo de cómo se ejecutaría el open() del hijo
const searchDialog = new SearchDialog({
    dialogSelector: '#search-dialog',
    openBtnSelector: '#open-search-btn',
    contentSelector: '#search-content',
    title: 'Buscar',
    ariaLabel: 'Diálogo de búsqueda'
});

// Cuando se llame a este método, se ejecutará el open() de SearchDialog
searchDialog.open();