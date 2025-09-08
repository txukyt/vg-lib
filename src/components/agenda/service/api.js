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

export function fetchBuscar(urlBase, params) {
  return doPost(urlBase, params);
}

export function fetchMasDatos(urlBase, params) {
  return doPost(urlBase, params);
}