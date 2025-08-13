import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";
import terser from "@rollup/plugin-terser";

import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // 1) Bundle ESM con preserveModules: emite cada módulo por separado
  {
    input: "src/index.js",
    plugins: [
      alias({ entries: [
        { find: '@pkg', replacement: path.resolve(__dirname, 'package.json') },
        { find: '@',    replacement: path.resolve(__dirname, 'src') }
      ]}),
      resolve(),
      json(),
      babel({ babelHelpers: "bundled", exclude: "node_modules/**" })
    ],
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      entryFileNames: '[name].js',
      preserveModules: false,
      preserveModulesRoot: 'src'
    }
  },
  // 2) Bundle IIFE único para navegador
  {
    input: "src/index.js",
    plugins: [
      alias({ entries: [
        { find: '@pkg', replacement: path.resolve(__dirname, 'package.json') },
        { find: '@',    replacement: path.resolve(__dirname, 'src') }
      ]}),
      resolve(),
      json(),
      babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
      terser()
    ],
    output: {
      file: "dist/vg-lib.iife.js",
      format: "iife",
      name: "VGLib",
      sourcemap: true
    }
  }
];
