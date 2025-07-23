import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";
import terser from "@rollup/plugin-terser";

import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/vg-lib.esm.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/vg-lib.iife.js",
      format: "iife",
      name: "VGLib",
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      entries: [
        { find: '@pkg', replacement: path.resolve(__dirname, 'package.json') },
        { find: '@', replacement: path.resolve(__dirname, 'src') },

      ],
    }),
    resolve(),
    json(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    terser(),
  ],
};
