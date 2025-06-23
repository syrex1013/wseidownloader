/* eslint-env jest */
const { validateCredentials } = require("../../src/services/authService");

// Mock puppeteer
jest.mock("puppeteer-extra", () => ({
  use: jest.fn(),
  launch: jest.fn(),
}));

describe("authService", () => {
  describe("validateCredentials", () => {
    test("should return true for valid credentials object", () => {
      const validCredentials = {
        username: "test@example.com",
        password: "password123",
      };

      expect(validateCredentials(validCredentials)).toBe(true);
    });

    test("should return false for missing username", () => {
      const invalidCredentials = {
        password: "password123",
      };

      expect(validateCredentials(invalidCredentials)).toBe(false);
    });

    test("should return false for missing password", () => {
      const invalidCredentials = {
        username: "test@example.com",
      };

      expect(validateCredentials(invalidCredentials)).toBe(false);
    });

    test("should return false for empty username", () => {
      const invalidCredentials = {
        username: "",
        password: "password123",
      };

      expect(validateCredentials(invalidCredentials)).toBe(false);
    });

    test("should return false for empty password", () => {
      const invalidCredentials = {
        username: "test@example.com",
        password: "",
      };

      expect(validateCredentials(invalidCredentials)).toBe(false);
    });

    test("should return false for null credentials", () => {
      expect(validateCredentials(null)).toBe(false);
    });

    test("should return false for undefined credentials", () => {
      expect(validateCredentials(undefined)).toBe(false);
    });

    test("should return false for non-object credentials", () => {
      expect(validateCredentials("not an object")).toBe(false);
      expect(validateCredentials(123)).toBe(false);
      expect(validateCredentials([])).toBe(false);
    });
  });
});
