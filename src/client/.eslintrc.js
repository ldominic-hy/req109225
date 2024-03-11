const path = require('path');
const { omit, assign } = require('lodash');
const { readFileSync } = require('fs');
const globalEslintConfig = JSON.parse(readFileSync(path.join(__dirname, '.eslintrc'), 'utf-8'));

module.exports = assign(globalEslintConfig, {
  env: {
    node: true,
    browser: true,
    jest: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['jest', 'jsx-a11y', 'import', 'react'],
  globals: {
    __DEV__: true,
  },
  rules: assign(
    omit(globalEslintConfig.rules, [
      'react/no-set-state',
      'react/sort-prop-types',
      'react/require-extension',
      'react/wrap-multilines',
      'mocha/no-skipped-tests',
      'no-only-tests/no-only-tests',
    ]),
    {
      'no-useless-escape': 0,
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'jest/prefer-to-be': 'warn',
      'jest/prefer-to-contain': 'warn',
    }
  ),
});
