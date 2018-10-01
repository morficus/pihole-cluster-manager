// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  parserOptions: { ecmaVersion: 8 },
  extends: [
    'eslint:recommended',
    // turn off stylistic rules since Prettier will automatically apply them
    // https://prettier.io/docs/en/eslint.html#turn-off-eslint-s-formatting-rules
    'prettier'
  ],
  //plugins: ['prettier'],
  rules: {
    // run Prettier stylistic rules with ESLint
    'prettier/prettier': 'error',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'object-property-newline': 'error'
  }
}
