/* eslint-disable */
export default {
  displayName: 'web-category-extension-content',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json'}],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/apps/web-category-extension-content',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
