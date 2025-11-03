/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(test).js"],
  moduleFileExtensions: ["js", "json"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/jest.setup.js"],
  verbose: false,
  detectOpenHandles: true,
  forceExit: true,
};