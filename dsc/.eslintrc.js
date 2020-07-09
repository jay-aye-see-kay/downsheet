module.exports = {
  'env': {
    'node': true,
    'es6': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2020,
    'project': './tsconfig.json',
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {},
}
