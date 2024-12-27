import baseConfig from '../../../jest.config';

export default {
  ...baseConfig,
  rootDir: __dirname,
  testMatch: ['<rootDir>/**/*.test.{ts,tsx}'],
};
