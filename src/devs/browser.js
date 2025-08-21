
export function browserInfo() {
  console.group("🌐 Información del navegador");
  console.log("User Agent:", navigator.userAgent);
  console.log("Idioma:", navigator.language);
  console.log("Plataforma:", navigator.platform);
  console.groupEnd();
}
