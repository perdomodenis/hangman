// Ein separates Jest config nur für die integration tests
// Hält die Integrationstests von den Unit-Tests getrennt
module.exports = {
  displayName: 'integration',
  preset: 'react-app',
  testMatch: ['**/__integration-tests__/**/*.integration.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/__integration-tests__/setup.ts'],
  testTimeout: 30000, // Integration tests are slower
};