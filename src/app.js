const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const chalk = require('chalk');
const path = require('path');

// Import services and utilities
const { loadConfig } = require('./config/configManager');
const { login, validateCredentials } = require('./services/authService');
const { fetchCourses, validateCourse } = require('./services/courseService');
const { downloadCourseMaterials } = require('./services/downloadService');
const {
  selectCourses,
  validateCourseSelection,
  displayCourseSelectionSummary,
} = require('./services/courseSelectionService');
const { displayHeader, displayFinalSummary } = require('./utils/uiUtils');
const { formatBytes } = require('./utils/fileUtils');
const logger = require('../logger');

// Add stealth plugin to puppeteer
puppeteer.use(StealthPlugin());

/**
 * Global statistics object to track download progress
 */
const stats = {
  totalFiles: 0,
  downloadedFiles: 0,
  skippedFiles: 0,
  failedFiles: 0,
  totalSize: 0,
  currentFile: '',
  currentCourse: '',
  processedFiles: 0,
};

/**
 * Main application function that orchestrates the entire download process
 * @returns {Promise<void>}
 */
async function main() {
  let browser = null;

  try {
    // Load and validate configuration
    const config = loadConfig();
    logger.info(
      `Download directory set to: ${path.resolve(config.downloadDir)}`,
    );
    logger.info('Configuration loaded successfully');

    // Validate credentials
    if (!validateCredentials(config.credentials)) {
      throw new Error('Invalid credentials format');
    }

    // Display application header
    displayHeader();

    // Launch browser with enhanced error handling
    logger.info('🌐 Launching browser...');

    const launchBrowser = async () => {
      return await puppeteer.launch(
        config.browserOptions || {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-features=TranslateUI',
            '--disable-extensions',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=site-per-process',
          ],
          ignoreDefaultArgs: ['--enable-automation'],
          defaultViewport: null,
          ignoreHTTPSErrors: true,
        },
      );
    };

    browser = await launchBrowser();

    const page = await browser.newPage();

    // Set up page error handling
    page.on('error', (error) => {
      logger.error('Page crashed:', error);
    });

    page.on('pageerror', (error) => {
      logger.warn('Page error:', error.message);
    });

    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    logger.info('Browser launched successfully');

    // Authenticate user
    logger.info('🔐 Logging into WSEI platform...');
    const loginSuccess = await login(
      page,
      config.credentials,
      config.urls.loginUrl,
    );
    if (!loginSuccess) {
      throw new Error('Login failed');
    }

    logger.info('User authenticated successfully');

    // Fetch available courses
    const courses = await fetchCourses(page, config.urls.coursesUrl);
    if (courses.length === 0) {
      throw new Error('No courses found');
    }

    logger.info(`Found ${courses.length} courses`);

    // Validate all courses
    for (const course of courses) {
      if (!validateCourse(course)) {
        logger.warn(`Invalid course data: ${course.name}`);
      }
    }

    // Let user select courses
    const selectedCourses = await selectCourses(courses);
    if (selectedCourses.length === 0) {
      console.log(chalk.yellow('No courses selected. Exiting...'));
      await browser.close();
      return;
    }

    // Validate course selection
    if (!validateCourseSelection(selectedCourses, courses)) {
      throw new Error('Invalid course selection');
    }

    // Display selection summary
    displayCourseSelectionSummary(selectedCourses);

    logger.info(`User selected ${selectedCourses.length} courses`);

    // Download course materials with browser health check
    try {
      await downloadCourseMaterials(
        page,
        selectedCourses,
        config.downloadDir,
        stats,
      );
    } catch (downloadError) {
      // Check if browser is still connected
      if (
        downloadError.message.includes('Connection closed') ||
        downloadError.message.includes('Protocol error')
      ) {
        logger.error('Browser connection lost during downloads');
        throw new Error(
          'Browser connection lost. Please restart the application.',
        );
      }
      throw downloadError;
    }

    // Display final summary
    displayFinalSummary(stats, formatBytes);

    logger.info('Download process completed successfully', {
      downloaded: stats.downloadedFiles,
      skipped: stats.skippedFiles,
      failed: stats.failedFiles,
      totalSize: stats.totalSize,
    });

    // Close browser
    await browser.close();
  } catch (error) {
    logger.error('Application error', {
      error: error.message,
      stack: error.stack,
    });
    console.error(chalk.red(`\n❌ Application error: ${error.message}`));

    if (error.message.includes('config.json not found')) {
      console.log(
        chalk.yellow(
          'Please ensure config.json exists and contains valid credentials.',
        ),
      );
    } else if (
      error.message.includes('Connection closed') ||
      error.message.includes('Protocol error')
    ) {
      console.log(
        chalk.yellow(
          '\n⚠️  The browser connection was lost. This can happen due to:',
        ),
      );
      console.log(chalk.yellow('  • System resource constraints'));
      console.log(chalk.yellow('  • Network interruptions'));
      console.log(chalk.yellow('  • Long-running operations'));
      console.log(chalk.yellow('\nPlease try running the application again.'));
    }

    // Ensure browser is closed
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        logger.debug('Error closing browser:', closeError);
      }
    }

    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
function handleShutdown() {
  console.log(chalk.yellow('\n⚠️  Shutting down gracefully...'));
  logger.info('Application shutdown initiated');
  process.exit(0);
}

// Handle graceful shutdown
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack,
  });
  console.error(chalk.red(`\n❌ Uncaught Exception: ${error.message}`));
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection', {
    reason: reason,
    promise: promise,
  });
  console.error(chalk.red(`\n❌ Unhandled Promise Rejection: ${reason}`));
  process.exit(1);
});

// Export main function for testing
module.exports = { main };

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
