/* eslint-env jest */
const {
  formatBytes,
  normalizeFolderName,
  fileExistsAndValid,
  ensureDirectoryExists,
  getFileExtension,
  sanitizeFilename,
} = require("../../src/utils/fileUtils");

const fs = require("fs");

describe("fileUtils", () => {
  describe("formatBytes", () => {
    test("should format bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(512)).toBe("512 B");
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1536)).toBe("1.5 KB");
      expect(formatBytes(1048576)).toBe("1 MB");
      expect(formatBytes(1073741824)).toBe("1 GB");
    });
  });

  describe("normalizeFolderName", () => {
    test("should remove invalid characters", () => {
      expect(normalizeFolderName('test<>:"/\\|?*folder')).toBe("testfolder");
    });

    test("should replace multiple spaces with single space", () => {
      expect(normalizeFolderName("test   folder   name")).toBe(
        "test folder name"
      );
    });

    test("should trim whitespace", () => {
      expect(normalizeFolderName("  test folder  ")).toBe("test folder");
    });

    test("should limit length to 255 characters", () => {
      const longName = "a".repeat(300);
      expect(normalizeFolderName(longName)).toHaveLength(255);
    });
  });

  describe("sanitizeFilename", () => {
    test("should replace invalid characters with underscores", () => {
      expect(sanitizeFilename('test<>:"/\\|?*file.txt')).toBe(
        "test_________file.txt"
      );
    });

    test("should preserve valid characters", () => {
      expect(sanitizeFilename("valid-filename_123.txt")).toBe(
        "valid-filename_123.txt"
      );
    });
  });

  describe("getFileExtension", () => {
    test("should detect PDF extension", () => {
      expect(getFileExtension("http://example.com/file.pdf")).toBe(".pdf");
      expect(getFileExtension("any-url", "pdf")).toBe(".pdf");
    });

    test("should detect document extensions", () => {
      expect(getFileExtension("http://example.com/file.doc")).toBe(".doc");
      expect(getFileExtension("http://example.com/file.docx")).toBe(".docx");
      expect(getFileExtension("http://example.com/file.ppt")).toBe(".ppt");
      expect(getFileExtension("http://example.com/file.pptx")).toBe(".pptx");
    });

    test("should default to .html for unknown types", () => {
      expect(getFileExtension("http://example.com/unknown")).toBe(".html");
    });

    test("should use resource type when URL has no extension", () => {
      expect(getFileExtension("http://example.com/download", "zip")).toBe(
        ".zip"
      );
    });
  });

  describe("fileExistsAndValid", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should return false if file does not exist", () => {
      fs.existsSync.mockReturnValue(false);
      expect(fileExistsAndValid("/path/to/nonexistent/file")).toBe(false);
    });

    test("should return false if file is too small", () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockReturnValue({
        size: 50,
        isFile: () => true,
      });
      expect(fileExistsAndValid("/path/to/small/file")).toBe(false);
    });

    test("should return false if path is a directory", () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockReturnValue({
        size: 1000,
        isFile: () => false,
      });
      expect(fileExistsAndValid("/path/to/directory")).toBe(false);
    });

    test("should return true for valid file", () => {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockReturnValue({
        size: 1000,
        isFile: () => true,
      });
      expect(fileExistsAndValid("/path/to/valid/file")).toBe(true);
    });

    test("should handle errors gracefully", () => {
      fs.existsSync.mockImplementation(() => {
        throw new Error("Permission denied");
      });
      expect(fileExistsAndValid("/path/to/file")).toBe(false);
    });
  });

  describe("ensureDirectoryExists", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should create directory if it does not exist", () => {
      fs.existsSync.mockReturnValue(false);
      ensureDirectoryExists("/path/to/new/directory");
      expect(fs.mkdirSync).toHaveBeenCalledWith("/path/to/new/directory", {
        recursive: true,
      });
    });

    test("should not create directory if it already exists", () => {
      fs.existsSync.mockReturnValue(true);
      ensureDirectoryExists("/path/to/existing/directory");
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });
});
