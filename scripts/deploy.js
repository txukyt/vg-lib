import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// Emula __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Leer entorno
const env = process.argv[2];
if (!env) {
  console.error('❌ Debes indicar el entorno: dev, pre o pro');
  process.exit(1);
}

// 2. Cargar variables de entorno
const envPath = resolve(__dirname, `../.env.${env}`);
const result = config({ path: envPath });

if (result.error) {
  console.error(`❌ Error cargando el archivo .env.${env}`);
  process.exit(1);
}

const deployPath = process.env.DEPLOY_PATH;
if (!deployPath) {
  console.error('❌ DEPLOY_PATH no definido en el archivo .env');
  process.exit(1);
}

// 3. Ejecutar build
console.log(`📦 Construyendo vg-lib para entorno: ${env}`);
execSync('npm run build', { stdio: 'inherit' });

// 4. Eliminar contenido anterior de deployPath
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
}

// 5. Copiar directorio completo
function copyFolderRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const item of fs.readdirSync(src)) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyFolderRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copiado: ${destPath}`);
    }
  }
}

// 6. Ejecutar limpieza + copia
console.log(`🚚 Desplegando archivos a: ${deployPath}`);
deleteFolderRecursive(deployPath);
copyFolderRecursiveSync(resolve(__dirname, '../dist'), deployPath);
