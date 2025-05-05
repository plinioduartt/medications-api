import { Config } from '@jest/types'

const config: Config.InitialOptions = {
    roots: ['<rootDir>/src'],
    bail: 0,
    preset: 'ts-jest',
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
    ],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [],
    verbose: true,
    modulePaths: ['<rootDir>'],
    moduleDirectories: ['node_modules'],
    transform: {
        '.*\\.ts$': 'ts-jest'
    },
    testMatch: ['**/?(*.)+(spec|test).[t]s?(x)'],
    modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/node_modules'],
    globalSetup: '<rootDir>/src/tests/setup.ts',
    globalTeardown: '<rootDir>/src/tests/teardown.ts',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupFilesAfterEnv.ts'],
    testEnvironment: 'node'
}

export default config
