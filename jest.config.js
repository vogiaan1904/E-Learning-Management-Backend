/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('ts-jest').JestConfigWithTsJest} **/
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.jest.json");
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/integration/**/*.test.ts"],
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  maxWorkers: 1,
  testTimeout: 30000,
};
