module.exports = {
  preset: 'ts-jest',

  globalSetup: '<rootDir>/dotenv-setup.ts',

  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@config/(.*)$': '<rootDir>/src/configs/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
  },

  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
