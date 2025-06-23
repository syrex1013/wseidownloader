const fs = require('fs');
const chalk = require('chalk');

/**
 * Loads configuration from config.json file
 * @returns {Object} Configuration object
 * @throws {Error} If config file is missing or invalid
 */
function loadConfig() {
  try {
    const configPath = 'config.json';

    if (!fs.existsSync(configPath)) {
      throw new Error('config.json not found');
    }

    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);

    // Validate required configuration fields
    validateConfig(config);

    return config;
  } catch (error) {
    if (error.message === 'config.json not found') {
      console.error(chalk.red('❌ Error: config.json not found.'));
      console.log(
        chalk.yellow(
          '📝 Please copy config.example.json to config.json and update with your credentials.',
        ),
      );
    } else if (error instanceof SyntaxError) {
      console.error(chalk.red('❌ Error: Invalid JSON in config.json'));
    } else {
      console.error(chalk.red(`❌ Error loading config: ${error.message}`));
    }
    process.exit(1);
  }
}

/**
 * Validates configuration object structure
 * @param {Object} config - Configuration object to validate
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
  const requiredFields = [
    'credentials.username',
    'urls.loginUrl',
    'urls.coursesUrl',
    'downloadDir',
  ];

  // Check required fields (except password, which has special handling)
  for (const field of requiredFields) {
    const value = getNestedValue(config, field);
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new Error(`Missing or empty required field: ${field}`);
    }
  }

  // Special handling for password - check if it exists first
  const password = getNestedValue(config, 'credentials.password');
  if (!password || (typeof password === 'string' && password.trim() === '')) {
    throw new Error('Password cannot be empty');
  }

  // Validate URLs
  if (!isValidUrl(config.urls.loginUrl)) {
    throw new Error('Invalid login URL format');
  }

  if (!isValidUrl(config.urls.coursesUrl)) {
    throw new Error('Invalid courses URL format');
  }

  // Validate credentials
  if (!isValidUsername(config.credentials.username)) {
    throw new Error(
      'Invalid username format: must be a non-empty string (username or email)',
    );
  }
}

/**
 * Gets nested object value using dot notation
 * @param {Object} obj - Object to search in
 * @param {string} path - Dot-separated path to the value
 * @returns {*} Value at the specified path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid, false otherwise
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates username (accepts email or non-empty string)
 * @param {string} username - Username to validate
 * @returns {boolean} True if valid
 */
function isValidUsername(username) {
  if (typeof username !== 'string' || username.trim() === '') return false;
  // Accepts email or any non-empty string (username or numeric ID)
  return true;
}

/**
 * Creates a default configuration object
 * @returns {Object} Default configuration structure
 */
function getDefaultConfig() {
  return {
    credentials: {
      username: 'your_email@example.com',
      password: 'your_password',
    },
    urls: {
      loginUrl: 'https://wsei.pl/login/index.php',
      coursesUrl: 'https://wsei.pl/my/',
    },
    downloadDir: 'downloads',
    browserOptions: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
    },
  };
}

/**
 * Creates example configuration file
 * @param {string} filepath - Path where to create the example file
 */
function createExampleConfig(filepath = 'config.example.json') {
  const defaultConfig = getDefaultConfig();
  fs.writeFileSync(filepath, JSON.stringify(defaultConfig, null, 2));
  console.log(chalk.green(`✓ Created example config file: ${filepath}`));
}

module.exports = {
  loadConfig,
  validateConfig,
  getDefaultConfig,
  createExampleConfig,
};
