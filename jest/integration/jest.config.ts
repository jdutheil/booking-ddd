import type { Config } from 'jest';

const config: Config = {
  globalSetup: '<rootDir>/../dotenv-setup.ts',
  displayName: 'Integration Tests',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../src',
  testRegex: '.*\\.spec\\.ts$',
  testPathIgnorePatterns: ['.*/unit/', '.*/e2e/'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@config/(.*)$': '<rootDir>/configs/$1',
    '^@libs/(.*)$': '<rootDir>/libs/$1',
  },
  runner: 'jest-serial-runner',
};

export default config;
