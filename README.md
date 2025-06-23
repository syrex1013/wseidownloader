# WSEI Course Downloader - Professional Edition

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Style: ESLint](https://img.shields.io/badge/code%20style-eslint-brightgreen.svg)](https://eslint.org/)

A professional, automated course material downloader for the WSEI e-learning platform. This tool helps students efficiently download course materials, presentations, documents, and other resources from their WSEI courses.

## ✨ Features

- **🔐 Secure Authentication**: Automated login to WSEI platform
- **📚 Course Discovery**: Automatically fetches all available courses
- **🎯 Smart Selection**: Choose specific courses or download all
- **📁 Organized Downloads**: Files are organized by course in separate folders
- **⏭️ Smart Skipping**: Skips files that already exist (with validation)
- **📊 Live Statistics**: Real-time download progress and statistics
- **🔄 Multiple File Types**: Supports PDF, DOC, PPT, XLS, ZIP, MP4, and more
- **🛡️ Error Handling**: Robust error handling and recovery
- **📝 Professional Logging**: Comprehensive logging for debugging
- **🎨 Beautiful CLI**: Professional terminal interface with colors and progress bars

## 🏗️ Architecture

The application is built with a modular, production-ready architecture:

```
src/
├── app.js                 # Main application orchestrator
├── config/
│   └── configManager.js   # Configuration management
├── services/
│   ├── authService.js     # Authentication handling
│   ├── courseService.js   # Course fetching and management
│   ├── downloadService.js # File download operations
│   └── courseSelectionService.js # Course selection UI
└── utils/
    ├── fileUtils.js       # File operations and utilities
    └── uiUtils.js         # User interface utilities
```

## 🚀 Quick Start

### Prerequisites

- Node.js 14.0.0 or higher
- npm 6.0.0 or higher
- Valid WSEI account credentials

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/wsei-course-downloader.git
   cd wsei-course-downloader
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up configuration:**

   ```bash
   npm run setup
   cp config.example.json config.json
   ```

4. **Edit configuration:**
   Open `config.json` and update with your WSEI credentials:

   ```json
   {
     "credentials": {
       "username": "your_email@wsei.pl",
       "password": "your_password"
     },
     "urls": {
       "loginUrl": "https://wsei.pl/login/index.php",
       "coursesUrl": "https://wsei.pl/my/"
     },
     "downloadDir": "downloads"
   }
   ```

5. **Run the application:**
   ```bash
   npm start
   ```

## 📖 Usage

### Basic Usage

```bash
# Start the downloader
npm start

# Or run directly
node index.js
```

### Advanced Usage

```bash
# Development mode with debugging
npm run dev

# Clean downloads and logs
npm run clean

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Global Installation

```bash
# Install globally
npm install -g .

# Run from anywhere
wsei-downloader
```

## ⚙️ Configuration

### Configuration File Structure

```json
{
  "credentials": {
    "username": "your_email@wsei.pl",
    "password": "your_password"
  },
  "urls": {
    "loginUrl": "https://wsei.pl/login/index.php",
    "coursesUrl": "https://wsei.pl/my/"
  },
  "downloadDir": "downloads",
  "browserOptions": {
    "headless": true,
    "args": [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  }
}
```

### Environment Variables

You can also use environment variables for sensitive data:

```bash
export WSEI_USERNAME="your_email@wsei.pl"
export WSEI_PASSWORD="your_password"
```

## 🔧 Development

### Project Structure

```
wseidownloader/
├── src/                   # Source code
│   ├── app.js            # Main application
│   ├── config/           # Configuration management
│   ├── services/         # Business logic services
│   └── utils/            # Utility functions
├── downloads/            # Downloaded files (created automatically)
├── logs/                 # Application logs
├── config.json          # User configuration
├── config.example.json  # Example configuration
├── index.js             # Entry point
├── logger.js            # Logging configuration
└── package.json         # Project metadata
```

### Code Quality

The project uses ESLint for code quality:

```bash
# Check code quality
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Adding New Features

1. **Create a new service** in `src/services/`
2. **Add utility functions** in `src/utils/`
3. **Update configuration** in `src/config/` if needed
4. **Add tests** (when test framework is added)
5. **Update documentation**

## 🐛 Troubleshooting

### Common Issues

1. **Login Failed**

   - Verify your credentials in `config.json`
   - Check if WSEI platform is accessible
   - Ensure your account is active

2. **No Courses Found**

   - Verify you're enrolled in courses
   - Check the courses URL in configuration
   - Ensure you're logged in successfully

3. **Download Failures**

   - Check internet connection
   - Verify file permissions in download directory
   - Check available disk space

4. **Browser Issues**
   - Update Node.js and npm
   - Clear browser cache
   - Try running in non-headless mode

### Debug Mode

Run in debug mode for detailed logging:

```bash
npm run dev
```

### Logs

Check the `logs/` directory for detailed application logs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add JSDoc comments for all functions
- Update documentation for new features
- Ensure all tests pass
- Follow semantic versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WSEI for providing the e-learning platform
- Puppeteer team for the excellent browser automation library
- All contributors who helped improve this tool

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Search existing [issues](https://github.com/yourusername/wsei-course-downloader/issues)
3. Create a new issue with detailed information

## 🔄 Changelog

### Version 2.0.0

- **Major refactoring** to modular architecture
- **Fixed file skipping logic** with proper validation
- **Added comprehensive error handling**
- **Improved logging and debugging**
- **Enhanced code quality** with ESLint
- **Production-ready** configuration and scripts
- **Better documentation** and examples

### Version 1.0.0

- Initial release with basic functionality
- Course discovery and download
- Simple CLI interface

---

**Note**: This tool is for educational purposes only. Please respect WSEI's terms of service and use responsibly.
