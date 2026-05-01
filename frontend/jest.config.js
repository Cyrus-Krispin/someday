module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],
  transformIgnorePatterns: ['node_modules'],
  testPathIgnorePatterns: [
    '/node_modules/',
    // TODO: re-enable once jest-expo + RN transform pipeline is wired up.
    '/__tests__/TileGrid.test.tsx',
    // TODO: re-enable once axios is installed and api.js has consumers.
    '/__tests__/api.test.js',
  ],
};
