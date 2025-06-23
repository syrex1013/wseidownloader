#!/usr/bin/env node

/**
 * Standalone Chrome installer for WSEI Course Downloader
 * This script downloads and installs Chrome browser using Puppeteer
 */

const puppeteer = require("puppeteer-extra");
const chalk = require("chalk");

async function installChrome() {
  console.log(chalk.cyan("🌐 WSEI Course Downloader - Chrome Installer"));
  console.log(chalk.yellow("🔍 Checking Chrome installation..."));
  console.log();

  try {
    // First check if Chrome is already working
    try {
      const testBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        timeout: 5000,
      });
      await testBrowser.close();
      console.log(
        chalk.green("✅ Chrome browser is already installed and working!")
      );
      return;
    } catch (launchError) {
      console.log(chalk.yellow("Chrome not found, will download..."));
    }

    // Create browser fetcher
    const browserFetcher = puppeteer.createBrowserFetcher();

    // Download Chrome
    console.log(chalk.yellow("⏳ This may take a few minutes..."));

    // Get recommended revision
    const puppeteerPackage = require("puppeteer/package.json");
    let revision = "1108766"; // Default stable revision

    if (
      puppeteerPackage.puppeteer &&
      puppeteerPackage.puppeteer.chromium_revision
    ) {
      revision = puppeteerPackage.puppeteer.chromium_revision;
    }

    const revisionInfo = await browserFetcher.download(
      revision,
      (downloadedBytes, totalBytes) => {
        if (totalBytes) {
          const percent = Math.round((downloadedBytes / totalBytes) * 100);
          process.stdout.write(
            `\r${chalk.yellow(`📥 Downloading... ${percent}%`)}`
          );
        }
      }
    );

    console.log();
    console.log(chalk.green("✅ Chrome browser installed successfully!"));
    console.log(chalk.blue(`📁 Location: ${revisionInfo.executablePath}`));

    // Set executable permissions on Unix
    if (process.platform !== "win32") {
      const fs = require("fs");
      try {
        fs.chmodSync(revisionInfo.executablePath, 0o755);
      } catch (chmodError) {
        console.warn(
          chalk.yellow(
            "Could not set executable permissions:",
            chmodError.message
          )
        );
      }
    }

    // Verify installation
    const verifyBrowser = await puppeteer.launch({
      executablePath: revisionInfo.executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    await verifyBrowser.close();

    console.log();
    console.log(chalk.cyan("🚀 You can now run the WSEI Course Downloader!"));
  } catch (error) {
    console.error(chalk.red("❌ Failed to install Chrome:"), error.message);

    // Try system Chrome as fallback
    console.log(chalk.yellow("\nTrying system Chrome installation..."));
    try {
      const systemBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        channel: "chrome",
      });
      await systemBrowser.close();
      console.log(chalk.green("✅ System Chrome detected and working!"));
      return;
    } catch (systemError) {
      console.log();
      console.log(chalk.yellow("💡 Please install Chrome manually:"));
      console.log(
        chalk.white("   • Download from: https://www.google.com/chrome/")
      );
      console.log(chalk.white("   • Windows: winget install Google.Chrome"));
      console.log(chalk.white("   • macOS: brew install --cask google-chrome"));
      console.log(
        chalk.white("   • Linux: sudo apt install google-chrome-stable")
      );
      process.exit(1);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  installChrome();
}

module.exports = { installChrome };
