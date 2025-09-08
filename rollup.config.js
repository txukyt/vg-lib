import { config } from 'dotenv';
import eslint from '@rollup/plugin-eslint';
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

const isProduction = process.env.NODE_ENV === "production";

config();

// ----------------------------
// 🔧 Plugins base
// ----------------------------
const basePlugins = [
  eslint(),
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
     __URL_INTRA__: JSON.stringify(process.env.URL_INTRA),
     __URL_WEB__: JSON.stringify(process.env.URL_WEB),
  })
];

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
    isProduction && terser()
  ].filter(Boolean)
};

// ----------------------------
// 📦 Build IIFE oficial (minificado)
// ----------------------------
const buildIife = {
  input: "src/index.js",
  output: {
    file: "dist/j38-lib.iife.js",
    format: "iife",
    name: "VGLib",
    sourcemap: true
  },
  plugins: [...basePlugins,
    isProduction && terser()
  ].filter(Boolean)
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
    sourcemap: false,
  },
  plugins: basePlugins,
};

export default [buildEsm, buildIife, buildDev];
