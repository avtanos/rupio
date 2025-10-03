module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-duplicate-case': 'warn'
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  }
};
