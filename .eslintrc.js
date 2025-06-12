// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', 'jest.setup.js'],
      env: {
        jest: true,
      },
    },
  ],
};
