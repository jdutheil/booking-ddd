import type { Config } from 'jest';

const config: Config = {
  displayName: 'Unit Tests',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../src',
  globalSetup: '<rootDir>/../dotenv-setup.ts',
  testRegex: '.*\\.spec\\.ts$',
  testPathIgnorePatterns: ['.*/integration/', '.*/e2e/'],
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
};

export default config;
