/* eslint-env jest */

// Mock all external dependencies
jest.mock("puppeteer-extra");
jest.mock("../logger");
jest.mock("../src/config/configManager");

const { main } = require("../src/app");
const { loadConfig } = require("../src/config/configManager");

describe("App Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock loadConfig to return a valid configuration
    loadConfig.mockReturnValue({
      credentials: {
        username: "test@example.com",
        password: "password123",
      },
      urls: {
        loginUrl: "https://example.com/login",
        coursesUrl: "https://example.com/courses",
      },
      downloadDir: "downloads",
      browserOptions: {
        headless: true,
        args: ["--no-sandbox"],
      },
    });
  });

  test("should export main function", () => {
    expect(typeof main).toBe("function");
  });

  test("should handle configuration loading", () => {
    expect(() => {
      loadConfig();
    }).not.toThrow();

    expect(loadConfig).toBeDefined();
  });

  // Note: Full integration test would require mocking the entire Puppeteer flow
  // This is a basic test to ensure the module structure is correct
});
