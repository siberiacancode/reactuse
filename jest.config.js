const { jest } = require('@siberiacancode/jest');

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  ...jest,
  clearMocks: true,
  testEnvironment: 'jsdom'
};

module.exports = jestConfig;
