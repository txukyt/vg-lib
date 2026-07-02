const SELECTOR = '[data-buscador-odt="true"]';
const HIDDEN_CLASS = 'hidden';
const MIN_QUERY_LENGTH = 2;

/**
 * Inicializa todos los buscadores ODT encontrados en el documento.
 *
 * Este método está pensado para ser llamado desde el initialize general de j38-lib,
 * pero también se exporta para poder inicializar manualmente una zona concreta si
 * en el futuro se cargan contenidos por AJAX.
 *
 * @param {ParentNode} root Nodo raíz desde el que buscar componentes. Por defecto, document.
 */
export function init(root = document) {
  initBuscadoresOdt(root);
}

/**
 * Inicializa todos los buscadores ODT presentes dentro del nodo indicado.
 *
 * @param {ParentNode} root Nodo raíz de búsqueda.
 */
export function initBuscadoresOdt(root = document) {
  const buscadores = root.querySelectorAll(SELECTOR);

  Array.prototype.forEach.call(buscadores, function (container) {
    if (container.dataset.initialized === 'true') {
      return;
    }

    container.dataset.initialized = 'true';
    initBuscador(container);
  });
}

/**
 * Inicializa una instancia concreta del buscador ODT.
 *
 * @param {HTMLElement} container Contenedor principal del buscador.
 */
function initBuscador(container) {
  const form = container.querySelector('.buscador-odt__form');
  const input = container.querySelector('.buscador-odt__input');
  const error = container.querySelector('.buscador-odt__error');
  const status = container.querySelector('.buscador-odt__status');
  const results = container.querySelector('.buscador-odt__results');
  const loadMore = container.querySelector('.buscador-odt__load-more');

  if (!form || !input || !error || !status || !results || !loadMore) {
    return;
  }

  const state = {
    termino: '',
    offset: 0,
    limit: parseInteger(container.dataset.limite, 10),
    total: 0,
    hasMore: false,
    controller: null
  };

  const ui = crearUi(container, input, error, status, results, loadMore);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const termino = trim(input.value);

    if (!validarTermino(container, termino, input, error)) {
      return;
    }

    state.termino = termino;
    state.offset = 0;
    state.total = 0;
    state.hasMore = false;

    buscar(container, state, ui);
  });

  loadMore.addEventListener('click', function () {
    if (!state.hasMore) {
      return;
    }

    buscar(container, state, ui);
  });
}

/**
 * Agrupa las referencias DOM utilizadas por el buscador.
 *
 * @param {HTMLElement} container Contenedor principal.
 * @param {HTMLInputElement} input Campo de búsqueda.
 * @param {HTMLElement} error Contenedor de error.
 * @param {HTMLElement} status Contenedor de estado.
 * @param {HTMLElement} results Contenedor de resultados.
 * @param {HTMLButtonElement} loadMore Botón de cargar más resultados.
 * @returns {Object} Referencias de interfaz.
 */
function crearUi(container, input, error, status, results, loadMore) {
  return {
    container,
    input,
    error,
    status,
    results,
    loadMore
  };
}

/**
 * Ejecuta una búsqueda contra el endpoint configurado en el componente.
 *
 * @param {HTMLElement} container Contenedor principal.
 * @param {Object} state Estado interno de búsqueda.
 * @param {Object} ui Referencias de interfaz.
 */
function buscar(container, state, ui) {
  abortarPeticionAnterior(state);

  state.controller = typeof AbortController !== 'undefined' ? new AbortController() : null;

  setLoading(ui, true);
  limpiarError(ui.error, ui.input);

  const url = construirUrl(container, state);

  fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json'
    },
    signal: state.controller ? state.controller.signal : undefined
  })
    .then(function (response) {
      return leerRespuestaJson(response, ui.container);
    })
    .then(function (data) {
      pintarResultados(data, state, ui);
    })
    .catch(function (error) {
      if (error.name === 'AbortError') {
        return;
      }

      limpiarEstado(ui.status);
      mostrarError(ui.error, ui.input, error.buscadorMessage || getTexto(ui.container, 'errorGenerico'));
      ocultarBotonCargarMas(ui);
    })
    .finally(function () {
      setLoading(ui, false);
    });
}

/**
 * Limpia el mensaje de estado y oculta su contenedor.
 *
 * @param {HTMLElement} status Contenedor de estado.
 */
function limpiarEstado(status) {
  if (!status) {
    return;
  }

  status.innerHTML = '';
  ocultarElemento(status);
}

/**
 * Construye la URL de búsqueda con los parámetros necesarios para el servlet.
 *
 * @param {HTMLElement} container Contenedor principal.
 * @param {Object} state Estado interno de búsqueda.
 * @returns {string} URL de consulta.
 */
function construirUrl(container, state) {
  const params = new URLSearchParams();

  params.set('termino', state.termino);
  params.set('offset', String(state.offset));
  params.set('limit', String(state.limit));
  params.set('idioma', container.dataset.idioma || 'es');
  params.set('claveArea', container.dataset.claveArea || '');
  params.set('visibilidad', container.dataset.visibilidad || '');
  params.set('categorias', container.dataset.categorias || '');

  return `${container.dataset.endpoint || ''}?${params.toString()}`;
}

/**
 * Lee la respuesta JSON del servidor y normaliza los errores.
 *
 * El servidor puede devolver:
 * - message: texto directo.
 * - messageKey + messageArgs: clave de texto que se resuelve en cliente.
 *
 * @param {Response} response Respuesta fetch.
 * @param {HTMLElement} container Contenedor principal.
 * @returns {Promise<Object>} JSON parseado.
 */
function leerRespuestaJson(response, container) {
  return response.text().then(function (text) {
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      const errorJson = new Error('Invalid JSON response');
      errorJson.buscadorMessage = getTexto(container, 'errorRespuestaNoValida');
      throw errorJson;
    }

    if (!response.ok || !data || data.ok !== true) {
      const error = new Error('Search error');
      error.buscadorMessage = data && data.messageKey ? getTexto(container, data.messageKey, data.messageArgs) : data && data.message ? data.message : getTexto(container, 'errorGenerico');
      throw error;
    }

    return data;
  });
}

/**
 * Pinta los resultados devueltos por el servidor.
 *
 * Si state.offset es 0, se trata de una búsqueda nueva y se limpian los resultados
 * previos. En caso contrario, se añaden a los ya existentes.
 *
 * @param {Object} data Respuesta JSON.
 * @param {Object} state Estado interno de búsqueda.
 * @param {Object} ui Referencias de interfaz.
 */
function pintarResultados(data, state, ui) {
  if (!ui.results) {
    return;
  }

  if (state.offset === 0) {
    ui.results.innerHTML = '';
  }

  const items = Array.isArray(data.items) ? data.items : [];

  items.forEach(function (item) {
    ui.results.appendChild(crearItemResultado(ui.container, item));
  });

  state.offset += items.length;
  state.total = parseInteger(data.total, state.offset);
  state.hasMore = data.hasMore === true && state.offset < state.total;

  alternarElemento(ui.results, state.offset > 0);

  if (ui.loadMore) {
    alternarElemento(ui.loadMore, state.hasMore);
    ui.loadMore.disabled = false;
  }

  actualizarEstadoResultados(ui, state);
}

/**
 * Crea el nodo HTML de un resultado.
 *
 * @param {HTMLElement} container Contenedor principal.
 * @param {Object} item Resultado devuelto por el servidor.
 * @returns {HTMLElement} Article del resultado.
 */
function crearItemResultado(container, item) {
  const article = document.createElement('article');
  const titleWrapper = document.createElement('h2');
  const title = document.createElement('a');

  title.href = item.url || '#';
  title.textContent = item.titulo || getTexto(container, 'resultadoSinTitulo');

  titleWrapper.appendChild(title);
  article.appendChild(titleWrapper);

  if (item.descripcion) {
    const description = document.createElement('p');
    description.className = 'description';
    description.innerHTML = limpiarHtmlDescripcion(item.descripcion);
    article.appendChild(description);
  }

  if (item.url) {
    article.appendChild(document.createComment(item.url));
  }

  const categoria = crearParrafoCategoria(container, item);

  if (categoria) {
    article.appendChild(categoria);
  }

  return article;
}

/**
 * Limpia HTML recibido para la descripción del resultado.
 *
 * La descripción puede incluir marcas HTML generadas en servidor. Se eliminan
 * etiquetas y atributos peligrosos antes de insertarla con innerHTML.
 *
 * @param {string} html HTML de descripción.
 * @returns {string} HTML saneado.
 */
function limpiarHtmlDescripcion(html) {
  const template = document.createElement('template');
  template.innerHTML = html;

  const elementosPeligrosos = template.content.querySelectorAll('script, iframe, object, embed, form, input, button, textarea, select, link, style');

  Array.prototype.forEach.call(elementosPeligrosos, function (elemento) {
    elemento.parentNode.removeChild(elemento);
  });

  const todos = template.content.querySelectorAll('*');

  Array.prototype.forEach.call(todos, function (elemento) {
    limpiarAtributosPeligrosos(elemento);
  });

  return template.innerHTML;
}

/**
 * Elimina atributos peligrosos de un elemento HTML.
 *
 * @param {HTMLElement} elemento Elemento a limpiar.
 */
function limpiarAtributosPeligrosos(elemento) {
  const atributos = Array.prototype.slice.call(elemento.attributes);

  atributos.forEach(function (atributo) {
    const nombre = atributo.name.toLowerCase();
    const valor = atributo.value || '';

    if (nombre.indexOf('on') === 0) {
      elemento.removeAttribute(atributo.name);
      return;
    }

    if ((nombre === 'href' || nombre === 'src') && /^\s*javascript:/i.test(valor)) {
      elemento.removeAttribute(atributo.name);
    }
  });
}

/**
 * Crea el párrafo de categoría y área temática de un resultado.
 *
 * @param {HTMLElement} container Contenedor principal.
 * @param {Object} item Resultado devuelto por servidor.
 * @returns {HTMLElement|null} Párrafo de metadatos o null.
 */
function crearParrafoCategoria(container, item) {
  const partes = [];

  if (item.categoriaTexto || item.categoria) {
    partes.push(`[${getTexto(container, 'categoria')}: ${item.categoriaTexto || item.categoria}]`);
  }

  if (item.areaTematicaTexto || item.areaTematica) {
    partes.push(`[${getTexto(container, 'areaTematica')}: ${item.areaTematicaTexto || item.areaTematica}]`);
  }

  if (partes.length === 0) {
    return null;
  }

  const parrafo = document.createElement('p');
  parrafo.className = 'categoria';
  parrafo.textContent = partes.join(' ');

  return parrafo;
}

/**
 * Valida el término antes de llamar al servidor.
 *
 * @param {HTMLElement} container Contenedor principal.
 * @param {string} termino Término normalizado.
 * @param {HTMLInputElement} input Campo de búsqueda.
 * @param {HTMLElement} error Contenedor de error.
 * @returns {boolean} true si es válido.
 */
function validarTermino(container, termino, input, error) {
  if (termino.length < MIN_QUERY_LENGTH) {
    mostrarError(error, input, getTexto(container, 'errorTextoMinimo', { arg0: MIN_QUERY_LENGTH }));
    return false;
  }

  input.value = termino;
  limpiarError(error, input);
  return true;
}

/**
 * Muestra un error accesible asociado al campo de búsqueda.
 *
 * @param {HTMLElement} error Contenedor de error.
 * @param {HTMLInputElement} input Campo asociado.
 * @param {string} mensaje Mensaje a mostrar.
 */
function mostrarError(error, input, mensaje) {
  if (error) {
    mostrarElemento(error);
    error.textContent = mensaje;
  }

  if (input) {
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }
}

/**
 * Limpia el estado de error del campo.
 *
 * @param {HTMLElement} error Contenedor de error.
 * @param {HTMLInputElement} input Campo asociado.
 */
function limpiarError(error, input) {
  if (error) {
    ocultarElemento(error);
    error.textContent = '';
  }

  if (input) {
    input.removeAttribute('aria-invalid');
  }
}

/**
 * Activa o desactiva el estado de carga.
 *
 * @param {Object} ui Referencias de interfaz.
 * @param {boolean} loading true si está cargando.
 */
function setLoading(ui, loading) {
  const submit = ui.input && ui.input.form ? ui.input.form.querySelector('.buscador-odt__submit') : null;

  if (submit) {
    submit.disabled = loading;
  }

  if (ui.loadMore) {
    ui.loadMore.disabled = loading;

    if (loading) {
      ocultarElemento(ui.loadMore);
    }
  }

  if (ui.status && loading) {
    mostrarElemento(ui.status);
    ui.status.innerHTML = '';
    ui.status.textContent = getTexto(ui.container, 'estadoBuscando');
  }
}

/**
 * Actualiza el texto de estado de resultados.
 *
 * @param {Object} ui Referencias de interfaz.
 * @param {Object} state Estado interno de búsqueda.
 */
function actualizarEstadoResultados(ui, state) {
  if (!ui.status) {
    return;
  }

  ui.status.innerHTML = '';

  if (state.offset === 0) {
    mostrarElemento(ui.status);
    ui.status.textContent = getTexto(ui.container, 'estadoSinResultados');
    return;
  }

  mostrarElemento(ui.status);

  pintarTextoEstadoConSpans(ui.status, getTexto(ui.container, state.termino ? 'estadoResultadosRangoTermino' : 'estadoResultadosRango'), {
    desde: formatearNumero(1),
    hasta: formatearNumero(state.offset),
    total: formatearNumero(state.total),
    termino: state.termino || ''
  });
}

/**
 * Pinta una plantilla de texto sustituyendo los placeholders por spans.
 *
 * Ejemplo:
 * "Del {desde} al {hasta} de {total}".
 *
 * @param {HTMLElement} elemento Elemento destino.
 * @param {string} plantilla Texto con placeholders.
 * @param {Object} valores Valores a sustituir.
 */
function pintarTextoEstadoConSpans(elemento, plantilla, valores) {
  const regex = /\{([a-zA-Z0-9_]+)\}/g;
  let ultimoIndice = 0;
  let match;

  elemento.innerHTML = '';

  while ((match = regex.exec(plantilla)) !== null) {
    if (match.index > ultimoIndice) {
      elemento.appendChild(document.createTextNode(plantilla.substring(ultimoIndice, match.index)));
    }

    const key = match[1];
    const valor = Object.prototype.hasOwnProperty.call(valores, key) ? valores[key] : match[0];

    const span = document.createElement('span');
    span.textContent = valor;
    elemento.appendChild(span);

    ultimoIndice = regex.lastIndex;
  }

  if (ultimoIndice < plantilla.length) {
    elemento.appendChild(document.createTextNode(plantilla.substring(ultimoIndice)));
  }
}

/**
 * Formatea un número para mostrarlo en el contador de resultados.
 *
 * @param {number|string} numero Número a formatear.
 * @returns {string} Número formateado.
 */
function formatearNumero(numero) {
  const valor = parseInteger(numero, 0);

  try {
    return valor.toLocaleString('es-ES');
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

/**
 * Oculta el botón de cargar más resultados.
 *
 * @param {Object} ui Referencias de interfaz.
 */
function ocultarBotonCargarMas(ui) {
  if (ui.loadMore) {
    ocultarElemento(ui.loadMore);
    ui.loadMore.disabled = false;
  }
}

/**
 * Aborta una petición anterior si sigue activa.
 *
 * @param {Object} state Estado interno de búsqueda.
 */
function abortarPeticionAnterior(state) {
  if (state.controller) {
    state.controller.abort();
  }
}

/**
 * Obtiene el mapa de textos configurado en el componente.
 *
 * Los textos se leen desde:
 *
 * <script type="application/json" class="buscador-odt__texts">...</script>
 *
 * @param {HTMLElement} container Contenedor principal.
 * @returns {Object} Mapa de textos.
 */
function getTextos(container) {
  if (container._buscadorOdtTextos) {
    return container._buscadorOdtTextos;
  }

  const script = container.querySelector('.buscador-odt__texts');
  let textos = {};

  if (script && script.textContent) {
    try {
      textos = JSON.parse(script.textContent);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      textos = {};
    }
  }

  container._buscadorOdtTextos = textos;
  return textos;
}

/**
 * Obtiene y formatea un texto del buscador.
 *
 * @param {HTMLElement} container Contenedor principal.
 * @param {string} key Clave del texto.
 * @param {Object} [args] Argumentos de sustitución.
 * @param {string} [defaultValue] Valor por defecto.
 * @returns {string} Texto formateado.
 */
function getTexto(container, key, args, defaultValue) {
  const textos = getTextos(container);
  const texto = textos[key] || defaultValue || '';

  return formatearTexto(texto, args);
}

/**
 * Sustituye placeholders de una plantilla de texto.
 *
 * Admite:
 * - {arg0}
 * - {0}
 * - {desde}
 * - {hasta}
 *
 * @param {string} texto Texto base.
 * @param {Object} args Argumentos.
 * @returns {string} Texto formateado.
 */
function formatearTexto(texto, args) {
  if (!texto) {
    return '';
  }

  if (!args) {
    return String(texto);
  }

  return String(texto).replace(/\{([a-zA-Z0-9_]+)\}/g, function (match, key) {
    if (Object.prototype.hasOwnProperty.call(args, key)) {
      return String(args[key]);
    }

    if (/^\d+$/.test(key) && Object.prototype.hasOwnProperty.call(args, `arg${key}`)) {
      return String(args[`arg${key}`]);
    }

    return match;
  });
}

/**
 * Convierte un valor a entero.
 *
 * @param {*} value Valor original.
 * @param {number} defaultValue Valor por defecto.
 * @returns {number} Entero resultante.
 */
function parseInteger(value, defaultValue) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Elimina espacios al inicio y al final.
 *
 * @param {*} value Valor original.
 * @returns {string} Texto normalizado.
 */
function trim(value) {
  return value == null ? '' : String(value).replace(/^\s+|\s+$/g, '');
}

/**
 * Muestra un elemento eliminando la clase de ocultación.
 *
 * @param {HTMLElement} elemento Elemento.
 */
function mostrarElemento(elemento) {
  if (elemento) {
    elemento.classList.remove(HIDDEN_CLASS);
  }
}

/**
 * Oculta un elemento añadiendo la clase de ocultación.
 *
 * @param {HTMLElement} elemento Elemento.
 */
function ocultarElemento(elemento) {
  if (elemento) {
    elemento.classList.add(HIDDEN_CLASS);
  }
}

/**
 * Muestra u oculta un elemento.
 *
 * @param {HTMLElement} elemento Elemento.
 * @param {boolean} visible true si debe mostrarse.
 */
function alternarElemento(elemento, visible) {
  if (elemento) {
    elemento.classList.toggle(HIDDEN_CLASS, !visible);
  }
}