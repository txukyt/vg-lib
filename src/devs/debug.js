
export function throwTestError() {
  console.error("💥 Error simulado para pruebas");
  throw new Error("Error simulado por VgDev");
}

export function listGlobals() {
  console.group("🌍 Variables globales");
  for (let key in window) {
    if (window.hasOwnProperty(key)) {
      console.log(key);
    }
  }
  console.groupEnd();
}
