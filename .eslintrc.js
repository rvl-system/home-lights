module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/react',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import'],
  root: true,
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc'
        },
        groups: ['builtin', 'external', ['sibling', 'parent'], 'index']
      }
    ],
    quotes: ['error', 'single'],
    'react/display-name': 'off',
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: '17.0' // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  }
};
