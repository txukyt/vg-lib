// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        __DEV__: 'readonly',
        __URL_MAIN__: 'readonly',
        __URL_INTRA__: 'readonly',
        __URL_WEB__: 'readonly',
        __URL_EXTRANET__: 'readonly',
        __URL_VPN__: 'readonly',
      },
      
    },
    rules: {
      // Tus reglas personalizadas aquí
    },
  },
];