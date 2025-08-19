/**
 * A fast string hashing function for Node.js
 * https://github.com/darkskyapp/string-hash
 * @param  {String} str
 * @return {Number}
 */
export function hash(str) {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  return hash >>> 0; // fuerza resultado positivo
}
