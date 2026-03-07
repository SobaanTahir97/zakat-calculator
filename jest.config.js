module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/lib/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: { strict: false } }],
  },
};
