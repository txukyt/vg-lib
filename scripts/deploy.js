import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import { execSync } from 'child_process';
import shelljs from 'shelljs';
import copyPaste from 'copy-paste';

// Emula __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1️⃣ Leer entorno
const env = process.argv[2];
if (!env) {
  console.error('❌ Debes indicar el entorno: dev, pre o prod');
  process.exit(1);
}

// 2️⃣ Cargar variables de entorno
const envPath = resolve(__dirname, `../.env.${env}`);
const result = config({ path: envPath });
if (result.error) {
  console.error(`❌ Error cargando el archivo .env.${env}`);
  process.exit(1);
}

// 3️⃣ Ejecutar build
console.log(`📦 Construyendo j38-lib para entorno: ${env}`);
execSync('npm run build', { stdio: 'inherit' });

// 4️⃣ Funciones auxiliares
async function deleteFolderRecursive(folderPath) {
  if (fsSync.existsSync(folderPath)) {
    await fs.rm(folderPath, { recursive: true, force: true });
  }
}

async function copyFolderRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });

  for (const item of await fs.readdir(src)) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);
    const stat = await fs.stat(srcPath);

    if (stat.isDirectory()) {
      await copyFolderRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
      console.log(`✅ Copiado: ${destPath}`);
    }
  }
}

// 5️⃣ Función para crear directorio en buzón
function padStart(num, targetLength, padString = '0') {
  return String(num).padStart(targetLength, padString);
}

async function crearDirectorioParaParteEnBuzon(tomorrow = false) {
  const plusDays = tomorrow ? 1 : 0;
  const now = new Date();
  const day = padStart(now.getDate() + plusDays, 2);
  const month = padStart(now.getMonth() + 1, 2);
  const year = now.getFullYear();
  const basepath = `L:/Buzon/${year}-${month}-${day}`;

  if (!fsSync.existsSync(basepath)) {
    await fs.mkdir(basepath, { recursive: true });
  }

  let i = 1;
  let path = join(basepath, 'Decoracion');
  while (fsSync.existsSync(path)) {
    i++;
    path = join(basepath, `Decoracion(${i})`);
  }

  await fs.mkdir(path, { recursive: true });
  return path;
}

// 6️⃣ deployConParte usando copyFolderRecursive
async function deployConParte(directorioParaParte) {
  const msgInicio = `Despliegue a ${env.toUpperCase()}: `;
  const dest = join(directorioParaParte, 'Http_Comunes', 'comun', 'libs', 'vg', 'j38-lib', 'last');

  console.log(`${msgInicio}Copiando los archivos del parte a: ${dest}`);
  await copyFolderRecursive(resolve(__dirname, '../dist'), dest);
  console.log(`${msgInicio}Archivos copiados`);

  copyPaste.copy(directorioParaParte);
  console.log(`${msgInicio}Path para el parte copiado al portapapeles`);

  console.log(`${msgInicio}Abriendo PlantillaParte.exe`);
  shelljs.exec('L:\\Partes_trabajos\\PlantillaParte\\ca6\\PlantillaParte.exe', { async: true });
}

// 7️⃣ Despliegue según entorno
(async () => {
  if (env === 'pre' || env === 'prod') {
    const buzonPath = await crearDirectorioParaParteEnBuzon();
    await deployConParte(buzonPath);
  } else {
    const deployPath = process.env.DEPLOY_PATH;
    if (!deployPath) {
      console.error('❌ DEPLOY_PATH no definido en el .env para dev');
      process.exit(1);
    }
    console.log(`🚚 Desplegando archivos a: ${deployPath}`);
    await deleteFolderRecursive(deployPath);
    await copyFolderRecursive(resolve(__dirname, '../dist'), deployPath);
  }
})();
