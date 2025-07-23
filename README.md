# vg-lib

**Librería compartida de utilidades JavaScript para los proyectos web del Ayuntamiento de Vitoria-Gasteiz.**

Diseñada como un conjunto modular reutilizable, con soporte para ES Modules, Rollup, despliegue por entornos y versionado automático desde `package.json`.

---

## 🚀 Instalación

### Desde npm (cuando esté publicada):

```bash
npm install @vitoria-gasteiz/vg-lib
```

### Desde GitHub directamente:

```bash
npm install github:txukyt/vg-lib
```

## 🧩 Uso

### En un entorno JavaScript moderno (ESM):

```js
import { saludar, showVersion, version } from '@vitoria-gasteiz/vg-lib';

saludar('Ane');
showVersion(); // vg-lib v1.0.0
console.log(version); // "1.0.0"
```

### En entorno HTML/WordPress:

```html
<script src="/http/comun/mjs/vg-lib.iife.js"></script>
<script>
  VGLib.saludar('Igor');
  VGLib.showVersion();
</script>
```

---

## 🛠️ Desarrollo

Clona el repositorio:

```bash
git clone https://github.com/txukyt/vg-lib.git
cd vg-lib
npm install
```

### Construir la librería:

```bash
npm run build
```

Genera:

- `dist/vg-lib.iife.js` → para navegadores
- `dist/vg-lib.esm.js`  → para uso con `import`

---

## ⚙️ Despliegue automático por entorno

Usamos archivos `.env` para definir rutas por entorno:

```
# .env.dev
DEPLOY_PATH=D:/DEV-WAS8/website/serverX/http/comun/libs/vg
```

### Ejecutar despliegue:

```bash
npm run deploy:dev
npm run deploy:desa
```

Esto:
- Compila la librería
- Copia los bundles a la ruta indicada en `.env.[entorno]`

---

## 📁 Estructura del proyecto

```
vg-lib/
├── dist/                 # Archivos generados por Rollup
├── src/                  # Código fuente
│   ├── components/
│   └── index.js          # Punto de entrada
├── scripts/
│   └── deploy.js         # Script de despliegue
├── .env.dev              # Rutas por entorno
├── rollup.config.js      # Configuración de build
└── package.json
```

---

## 🔧 Alias configurados

- `@` apunta a `src/`
- `@pkg` apunta a `package.json` (para importar la versión desde el código)

Ejemplo:

```js
import pkg from '@pkg';
console.log(pkg.version);
```

---

## ✅ Requisitos

- Node.js 18 o superior
- npm 8+
- Entornos preparados con rutas específicas de despliegue

---

## 📦 Publicación en npm (pendiente)

Cuando esté listo para publicar:

```bash
npm login
npm publish --access=public
```

---

## 📄 Licencia

MIT — © Ayuntamiento de Vitoria-Gasteiz
