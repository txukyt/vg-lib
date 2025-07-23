export function saludar(nombre = 'mundo') {
  if (typeof window !== 'undefined') {
    alert(`Hola, ${nombre}`);
  } else {
    console.log(`Hola, ${nombre}`);
  }
}
