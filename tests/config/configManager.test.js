/* eslint-env jest */
const {
  loadConfig,
  validateConfig,
  getDefaultConfig,
  createExampleConfig,
} = require("../../src/config/configManager");
const fs = require("fs");

describe("configManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock process.exit to prevent tests from actually exiting
    jest.spyOn(process, "exit").mockImplementation(() => {});
    // Mock console methods
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getDefaultConfig", () => {
    test("should return a valid default configuration", () => {
      const config = getDefaultConfig();

      expect(config).toHaveProperty("credentials");
      expect(config).toHaveProperty("urls");
      expect(config).toHaveProperty("downloadDir");
      expect(config).toHaveProperty("browserOptions");

      expect(config.credentials).toHaveProperty("username");
      expect(config.credentials).toHaveProperty("password");
      expect(config.urls).toHaveProperty("loginUrl");
      expect(config.urls).toHaveProperty("coursesUrl");
    });
  });

  describe("validateConfig", () => {
    const validConfig = {
      credentials: {
        username: "test@example.com",
        password: "password123",
      },
      urls: {
        loginUrl: "https://example.com/login",
        coursesUrl: "https://example.com/courses",
      },
      downloadDir: "downloads",
    };

    test("should validate a correct configuration", () => {
      expect(() => validateConfig(validConfig)).not.toThrow();
    });

    test("should throw error for missing credentials.username", () => {
      const invalidConfig = { ...validConfig };
      delete invalidConfig.credentials.username;

      expect(() => validateConfig(invalidConfig)).toThrow(
        "Missing or empty required field: credentials.username"
      );
    });

    test("should throw error for empty credentials.password", () => {
      const invalidConfig = {
        ...validConfig,
        credentials: {
          ...validConfig.credentials,
          password: "",
        },
      };

      expect(() => validateConfig(invalidConfig)).toThrow(
        "Password cannot be empty"
      );
    });

    test("should throw error for invalid loginUrl", () => {
      const invalidConfig = {
        ...validConfig,
        urls: {
          ...validConfig.urls,
          loginUrl: "not-a-valid-url",
        },
      };

      expect(() => validateConfig(invalidConfig)).toThrow(
        "Invalid login URL format"
      );
    });

    test("should throw error for invalid coursesUrl", () => {
      const invalidConfig = {
        ...validConfig,
        urls: {
          ...validConfig.urls,
          coursesUrl: "invalid-url",
        },
      };

      expect(() => validateConfig(invalidConfig)).toThrow(
        "Invalid courses URL format"
      );
    });

    test("should throw error for empty downloadDir", () => {
      const invalidConfig = { ...validConfig };
      invalidConfig.downloadDir = "";

      expect(() => validateConfig(invalidConfig)).toThrow(
        "Missing or empty required field: downloadDir"
      );
    });
  });

  describe("loadConfig", () => {
    test("should load valid configuration file", () => {
      const mockConfig = {
        credentials: {
          username: "test@example.com",
          password: "password123",
        },
        urls: {
          loginUrl: "https://example.com/login",
          coursesUrl: "https://example.com/courses",
        },
        downloadDir: "downloads",
      };

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      const config = loadConfig();
      expect(config).toEqual(mockConfig);
    });

    test("should exit when config file does not exist", () => {
      fs.existsSync.mockReturnValue(false);

      loadConfig();

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("config.json not found")
      );
    });

    test("should exit when config file has invalid JSON", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("invalid json");

      loadConfig();

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid JSON")
      );
    });
  });

  describe("createExampleConfig", () => {
    test("should create example config file", () => {
      createExampleConfig("test-config.json");

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "test-config.json",
        expect.stringContaining("your_email@example.com")
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("Created example config")
      );
    });

    test("should use default filename when none provided", () => {
      createExampleConfig();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "config.example.json",
        expect.any(String)
      );
    });
  });
});
