export function uid(len = 7) {
  const array = new Uint8Array(len);

  crypto.getRandomValues(array);

  return Array.from(array, n => n.toString(36)).join('').slice(0, len);
}
