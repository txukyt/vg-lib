import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";

import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------
// 🔧 Plugins base
// ----------------------------

const basePlugins = [
   alias({ entries: [
        { find: '@pkg', replacement: path.resolve(__dirname, 'package.json') },
        { find: '@',    replacement: path.resolve(__dirname, 'src') }
      ]}),
  resolve(),
  json(),
  babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
  replace({
    preventAssignment: true,
    __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
     __URL_MAIN__: JSON.stringify(process.env.URL_MAIN),
  })
];

// Plugins de producción (minificación)
const prodPlugins = [
  ...basePlugins, 
  babel({
    babelHelpers: "bundled",
    include: [
    'src/**',           // tu código
    'node_modules/i18next/**' // transpila i18next
    ],
    //exclude: "node_modules/**",
    presets: [
      ["@babel/preset-env", { targets: { ie: "11" }, modules: false }]
    ]
  }),
  terser()];

// ----------------------------
// 📦 Build ESM oficial
// ----------------------------
const buildEsm = {
  input: "src/index.js",
  output: {
    dir: 'dist/esm',
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: [...basePlugins, 
    babel({ babelHelpers: "bundled", exclude: "node_modules/**" })
  ],  
};

// ----------------------------
// 📦 Build IIFE oficial (minificado)
// ----------------------------
const buildIife = {
  input: "src/index.js",
  output: {
    file: "dist/vg-lib.iife.js",
    format: "iife",
    name: "VGLib",
    sourcemap: true
  },
  plugins: prodPlugins,
};

// ----------------------------
// 🔧 Build DEV (solo equipo)
// ----------------------------
const buildDev = {
  input: "src/dev-tools.js",
  output: {
    file: "dist/dev/dev.js",
    format: "iife",
    name: "VgDev",
    sourcemap: true,
  },
  plugins: basePlugins,
};

export default [buildEsm, buildIife, buildDev];
