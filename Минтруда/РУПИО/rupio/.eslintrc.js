module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-duplicate-case': 'off',
    'react-hooks/exhaustive-deps': 'off'
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  ignorePatterns: ['build/', 'dist/', 'node_modules/']
};
