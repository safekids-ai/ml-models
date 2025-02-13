import { join } from "path";

/* eslint-disable */
export default {
  displayName: 'ai-webcategory',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    "^onnxruntime-node$": join(__dirname, "../../node_modules/onnxruntime-node"),
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/ai-webcategory',
};
