#!/usr/bin/env node

/**
 * Chrome Installation Script for WSEI Course Downloader
 *
 * This script installs the required Chrome browser for the standalone executable.
 * Run this once after downloading the executable.
 */

const { execSync } = require("child_process");

console.log("🎓 WSEI Course Downloader - Chrome Installation");
console.log("=".repeat(50));

try {
  console.log("📦 Installing Chrome browser for Puppeteer...");

  // Install Chrome using puppeteer
  execSync("npx puppeteer browsers install chrome", {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  console.log("");
  console.log("✅ Chrome installation completed successfully!");
  console.log("");
  console.log("🚀 You can now run the WSEI Course Downloader:");
  console.log("   ./wsei-course-downloader-macos-arm64  (Apple Silicon)");
  console.log("   ./wsei-course-downloader-macos-x64    (Intel Mac)");
  console.log("   ./wsei-course-downloader-linux-x64    (Linux)");
  console.log("   ./wsei-course-downloader-win-x64.exe  (Windows)");
  console.log("");
} catch (error) {
  console.error("❌ Failed to install Chrome:", error.message);
  console.log("");
  console.log("💡 Manual installation steps:");
  console.log("1. Make sure you have Node.js installed");
  console.log("2. Run: npx puppeteer browsers install chrome");
  console.log("3. Try running the downloader again");
  process.exit(1);
}
