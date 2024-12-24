/* eslint-disable */
export default {
  displayName: 'gmail-extension-background',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json'}],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/apps/gmail-extension-background',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
