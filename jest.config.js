const { jest } = require('@siberiacancode/jest');

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  ...jest,
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.polyfills.js']
};

module.exports = jestConfig;
