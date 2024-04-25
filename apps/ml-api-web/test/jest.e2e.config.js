module.exports = {
    verbose: true,
    // rootDir: '.',
    preset: 'jest-puppeteer',
    testTimeout: 100000,
    maxConcurrency: 1,
    maxWorkers: 1,
    testMatch: ['**/test/e2e/**/*.spec.[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/', 'dist'], //
    setupFilesAfterEnv: ['./jest.e2e.setup.ts'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    globalSetup: './jest.e2e.global_setup.ts', // will be called once before all tests are executed
    globalTeardown: './jest.e2e.global_teardown.ts', // will be called once after all tests are executed
    testEnvironment: './puppeteer_environment.js',
};
