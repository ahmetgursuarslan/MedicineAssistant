import type { Config } from 'jest';

const config: Config = {
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@auth/(.*)$': '<rootDir>/auth/$1',
    '^@users/(.*)$': '<rootDir>/users/$1',
    '^@companies/(.*)$': '<rootDir>/companies/$1',
    '^@diseases/(.*)$': '<rootDir>/diseases/$1',
    '^@allergens/(.*)$': '<rootDir>/allergens/$1',
    '^@medicines/(.*)$': '<rootDir>/medicines/$1',
    '^@timers/(.*)$': '<rootDir>/timers/$1',
    '^@reminders/(.*)$': '<rootDir>/reminders/$1',
    '^@risk/(.*)$': '<rootDir>/risk/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@db/(.*)$': '<rootDir>/db/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
  },
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};

export default config;
