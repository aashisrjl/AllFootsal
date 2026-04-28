// Jest setup file
require('dotenv').config();

// Suppress console logs during tests (optional)
// global.console.log = jest.fn();
// global.console.error = jest.fn();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET_USER = 'test-secret-user';
process.env.JWT_SECRET_FUTSAL = 'test-secret-futsal';
process.env.TOKEN_EXPIRATION_USER = '30d';
process.env.TOKEN_EXPIRATION_FUTSAL = '30d';
process.env.USER_PASSWORD_SALT_ROUNDS = '10';
process.env.FUTSAL_PASSWORD_SALT_ROUNDS = '10';

// Add global test utilities
global.testConfig = {
  apiUrl: 'http://localhost:3000/api/v1',
  timeout: 10000
};
