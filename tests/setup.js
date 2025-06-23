/* eslint-env jest */
// Test setup file for Jest
// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  // Uncomment the line below to suppress console.log during tests
  // log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fs for file system operations in tests
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  statSync: jest.fn(),
}));

// Set test timeout
jest.setTimeout(30000);
