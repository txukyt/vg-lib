// scripts/deploy.js
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// Emula __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Leer el entorno (dev, pre, pro) desde el argumento
const env = process.argv[2];
if (!env) {
  console.error('❌ Debes indicar el entorno: dev, pre o pro');
  process.exit(1);
}

// 2. Cargar .env.[entorno]
const envPath = resolve(__dirname, `../.env.${env}`);
const result = config({ path: envPath });

if (result.error) {
  console.error(`❌ Error cargando el archivo: .env.${env}`);
  process.exit(1);
}

const deployPath = process.env.DEPLOY_PATH;

if (!deployPath) {
  console.error('❌ DEPLOY_PATH no definido en el archivo .env');
  process.exit(1);
}

console.log(`📦 Construyendo vg-lib para entorno: ${env}`);
execSync('npm run build', { stdio: 'inherit' });

console.log(`🚚 Copiando archivos a: ${deployPath}`);
fs.mkdirSync(deployPath, { recursive: true });

const filesToCopy = [
  'vg-lib.iife.js',
  'vg-lib.iife.js.map',
  'vg-lib.esm.js',
  'vg-lib.esm.js.map'
];

filesToCopy.forEach(file => {
  const src = resolve(__dirname, '../dist', file);
  const dest = join(deployPath, file);
  fs.copyFileSync(src, dest);
  console.log(`✅ Copiado: ${file}`);
});
