export function clearLocalStorage() {
  localStorage.clear();
  console.log("🧹 localStorage borrado completamente");
}

export function clearSessionStorage() {
  sessionStorage.clear();
  console.log("🧹 sessionStorage borrado completamente");
}

export function listLocalStorage() {
  if (localStorage.length === 0) {
    console.log("⚠️ localStorage vacío");
    return;
  }
  console.group("📦 Contenido de localStorage");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`${key}: ${localStorage.getItem(key)}`);
  }
  console.groupEnd();
}

export function listSessionStorage() {
  if (sessionStorage.length === 0) {
    console.log("⚠️ sessionStorage vacío");
    return;
  }
  console.group("📦 Contenido de sessionStorage");
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    console.log(`${key}: ${sessionStorage.getItem(key)}`);
  }
  console.groupEnd();
}

export function clearLocalStorageKey(key) {
  localStorage.removeItem(key);
  console.log(`🧹 Clave "${key}" borrada de localStorage`);
}
