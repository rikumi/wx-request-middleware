const baseRules = {
  'no-restricted-syntax': 'off',
  'no-param-reassign': 'off',
  'arrow-body-style': 'off',
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
  indent: ['error', 2, { ignoredNodes: [], SwitchCase: 1 }],
  eqeqeq: ['warn', 'smart'],
  camelcase: ['warn'],
  'newline-per-chained-call': 'off',
  'import/prefer-default-export': 'off',
  'import/order': 'off',
  'simple-import-sort/imports': ['error', {
    groups: [['^@?\\w', '^@/', '^\\.', '^\\u0000']],
  }],
  'import/newline-after-import': 'error',
};

module.exports = {
  extends: ['eslint-config-tencent'],
  plugins: ['import', 'simple-import-sort'],
  parser: '@babel/eslint-parser',
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
  env: { browser: true, node: true, es6: true, commonjs: true, jest: true },
  globals: {
    wx: true,
  },
  settings: {
    'import/resolver': 'webpack',
  },
  rules: baseRules,
  overrides: [{
    files: ['**/*.ts'],
    extends: ['eslint-config-tencent', 'eslint-config-tencent/ts'],
    plugins: ['@typescript-eslint', 'import'],
    parser: '@typescript-eslint/parser',
    rules: {
      ...baseRules,
      // https://github.com/microsoft/vscode-eslint/issues/1149
      indent: 'off',
      '@typescript-eslint/indent': ['error', 2],
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
    },
  }],
};
