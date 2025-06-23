const chalk = require('chalk');

/**
 * Handles user authentication to the WSEI platform
 * @param {Object} page - Puppeteer page object
 * @param {Object} credentials - User credentials object
 * @param {string} credentials.username - Username/email
 * @param {string} credentials.password - Password
 * @param {string} loginUrl - Login URL from config
 * @returns {Promise<boolean>} True if login successful, false otherwise
 */
async function login(page, credentials, loginUrl) {
  console.log(chalk.blue('🔐 Logging into WSEI platform...'));

  try {
    await page.goto(loginUrl, { waitUntil: 'networkidle2' });
    console.log(chalk.green('✓ Login page loaded'));

    // Wait for and fill username field
    await page.waitForSelector('#username', { visible: true });
    await page.type('#username', credentials.username, { delay: 100 });

    // Wait for and fill password field
    await page.waitForSelector('#password', { visible: true });
    await page.type('#password', credentials.password, { delay: 100 });

    // Click login button
    await page.click('#loginbtn');

    // Wait for successful login redirect
    try {
      await page.waitForFunction(
        () =>
          /* eslint-disable-next-line no-undef */
          window.location.hostname === 'wsei.pl' ||
          /* eslint-disable-next-line no-undef */
          window.location.href.includes('/my/'),
        { timeout: 10000 },
      );

      // Additional wait to ensure page is fully loaded
      await new Promise((r) => setTimeout(r, 2000));
      console.log(chalk.green('✓ Login successful!'));

      // Check for login errors
      const loginError = await page.evaluate(() => {
        /* global document */
        const errorElement = document.querySelector('.alert-danger');
        return errorElement ? errorElement.textContent.trim() : null;
      });

      if (loginError) {
        console.log(chalk.red('❌ Login failed - invalid credentials'));
        return false;
      }

      // Verify successful login by checking for a logout button or user profile link
      await page.waitForSelector('a[href*="logout.php"], .userbutton', {
        visible: true,
        timeout: 15000,
      });

      console.log(
        chalk.green('✓ Login successful, navigating to main page...'),
      );
      return true;
    } catch (timeoutError) {
      const currentUrl = page.url();
      if (currentUrl.includes('login')) {
        console.log(chalk.red('❌ Login failed - invalid credentials'));
        return false;
      } else {
        console.log(chalk.green('✓ Login successful!'));
        return true;
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ Login error: ${error.message}`));
    return false;
  }
}

/**
 * Validates user credentials format
 * @param {Object} credentials - User credentials object
 * @returns {boolean} True if credentials are valid, false otherwise
 */
function validateCredentials(credentials) {
  if (!credentials || typeof credentials !== 'object') {
    return false;
  }

  if (
    !credentials.username ||
    typeof credentials.username !== 'string' ||
    credentials.username.trim() === ''
  ) {
    return false;
  }

  if (
    !credentials.password ||
    typeof credentials.password !== 'string' ||
    credentials.password.trim() === ''
  ) {
    return false;
  }

  return true;
}

module.exports = {
  login,
  validateCredentials,
};
