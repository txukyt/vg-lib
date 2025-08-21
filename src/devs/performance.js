
export function pageLoadTime() {
  const timing = performance.timing;
  const loadTime = timing.loadEventEnd - timing.navigationStart;
  console.log(`⏱️ Tiempo de carga: ${loadTime} ms`);
}

export function memoryUsage() {
  if (performance.memory) {
    console.table(performance.memory);
  } else {
    console.log("⚠️ API de memoria no disponible");
  }
}
