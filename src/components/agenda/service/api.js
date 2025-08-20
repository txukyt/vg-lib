async function doPost(url, params = "") {
  try {
    const response = await fetch(url + params, {
      method: "POST",
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en doPost:", error);
    throw error;
  }
}

/**
 * Buscar eventos (primera búsqueda)
 */
export function fetchBuscar(urlBase, params) {
  return doPost(urlBase, params);
}

/**
 * Cargar más eventos (scroll o botón "ver más")
 */
export function fetchMasDatos(urlBase, params) {
  return doPost(urlBase, params);
}