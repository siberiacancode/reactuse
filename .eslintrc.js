const { eslint } = require('@siberiacancode/eslint');

module.exports = {
  ...eslint.react,
  parserOptions: {
    ...eslint.react.parserOptions,
    tsconfigRootDir: __dirname
  }
};
