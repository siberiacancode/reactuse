const { eslint } = require('@siberiacancode/eslint');

module.exports = {
  ...eslint.react,
  overrides: [
    ...eslint.react.overrides,
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        tsconfigRootDir: __dirname
      },
      rules: {
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/await-thenable': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'no-nested-ternary': 'off',
        'promise/always-return': 'off',
        'promise/catch-or-return': 'off',
        'no-restricted-syntax': 'off'
      }
    }
  ]
};
