export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'], // Treat .ts files as ESM
    transform: {
      '^.+\\.ts?$': ['ts-jest', { useESM: true }],
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
  };
  