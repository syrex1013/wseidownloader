#!/usr/bin/env node

/**
 * Standalone Chrome installer for WSEI Course Downloader
 * This script downloads and installs Chrome browser using Puppeteer
 */

const puppeteer = require("puppeteer-extra");
const chalk = require("chalk");

async function installChrome() {
  console.log(chalk.cyan("🌐 WSEI Course Downloader - Chrome Installer"));
  console.log(chalk.yellow("📥 Downloading Chrome browser..."));
  console.log();

  try {
    // Create browser fetcher
    const browserFetcher = puppeteer.createBrowserFetcher();

    // Check if Chrome is already installed
    const revisions = await browserFetcher.localRevisions();

    if (revisions.length > 0) {
      console.log(chalk.green("✅ Chrome browser is already installed!"));
      console.log(
        chalk.blue(
          `📁 Location: ${
            browserFetcher.revisionInfo(revisions[0]).executablePath
          }`
        )
      );
      return;
    }

    // Download Chrome
    console.log(chalk.yellow("⏳ This may take a few minutes..."));

    const revisionInfo = await browserFetcher.download(
      puppeteer.PUPPETEER_REVISIONS.chromium,
      (downloadedBytes, totalBytes) => {
        const percent = Math.round((downloadedBytes / totalBytes) * 100);
        process.stdout.write(
          `\r${chalk.yellow(`📥 Downloading... ${percent}%`)}`
        );
      }
    );

    console.log();
    console.log(chalk.green("✅ Chrome browser installed successfully!"));
    console.log(chalk.blue(`📁 Location: ${revisionInfo.executablePath}`));
    console.log();
    console.log(chalk.cyan("🚀 You can now run the WSEI Course Downloader!"));
  } catch (error) {
    console.error(chalk.red("❌ Failed to install Chrome:"), error.message);
    console.log();
    console.log(chalk.yellow("💡 Alternative installation methods:"));
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

// Run if executed directly
if (require.main === module) {
  installChrome();
}

module.exports = { installChrome };
