# 🎓 WSEI Course Downloader

> **Professional automated course material downloader for WSEI e-learning platform** 🚀

<!-- Add your picture here when ready -->

![WSEI Downloader](https://i.imgur.com/sgB5MpJ.png)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/syrex1013/wseidownloader)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

## ✨ Features

🔧 **Professional & Reliable**

- 🌐 **Automatic Chrome Installation** - No manual browser setup required!
- 🔄 **Intelligent Retry Logic** - Handles network interruptions gracefully
- 🎯 **Smart Course Selection** - Choose specific courses or download all
- 📊 **Real-time Progress Tracking** - Beautiful progress bars and status updates
- 🛡️ **Error Resilience** - Comprehensive error handling and logging
- ⚡ **Concurrent Downloads** - Optimized batch processing for faster downloads

📚 **Course Management**

- 📖 **Multiple File Types** - Supports PDFs, videos, documents, and more
- 🏗️ **Organized Structure** - Automatically creates course-specific folders
- 🔍 **Intelligent Detection** - Identifies downloadable resources automatically
- 💾 **Duplicate Prevention** - Skips already downloaded files

🎨 **User Experience**

- 🖥️ **Interactive CLI** - Beautiful terminal interface with colors
- 📈 **Detailed Statistics** - Track downloads, skips, and failures
- 📝 **Comprehensive Logging** - Detailed logs for troubleshooting
- ⚙️ **Easy Configuration** - Simple JSON-based setup

## 🚀 Quick Start

### Prerequisites

- 📦 **Node.js** 14.0.0 or higher
- 🔐 Valid WSEI e-learning platform credentials
- 🌐 Stable internet connection
- 💿 **Puppeteer** (for Chrome automation)

### Installation

#### 1. Install Node.js

Download and install Node.js from [nodejs.org](https://nodejs.org/)

#### 2. Install Puppeteer

You must install Puppeteer globally to ensure Chrome can be downloaded and managed:

```bash
npm install -g puppeteer
```

#### 3. Download Chrome for Puppeteer

Puppeteer will automatically download a compatible version of Chrome on first run. If you want to pre-install it:

```bash
npx puppeteer browsers install chrome
```

#### 4. Clone and Setup the Project

```bash
# Clone the repository
git clone https://github.com/yourusername/wsei-course-downloader.git
cd wsei-course-downloader

# Install dependencies
npm install

# Create configuration file
cp config.example.json config.json
```

### Configuration

Edit `config.json` with your credentials:

```json
{
  "credentials": {
    "username": "your_wsei_username",
    "password": "your_wsei_password"
  },
  "urls": {
    "loginUrl": "https://dl.wsei.pl/login/index.php",
    "coursesUrl": "https://dl.wsei.pl/my/courses.php"
  },
  "downloadDir": "downloads",
  "browser": {
    "headless": true,
    "args": [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled"
    ]
  }
}
```

### Usage

```bash
# Start the downloader
npm start
# or
node index.js

# Run with development mode (with debugging)
npm run dev
```

## 📋 How It Works

1. **🔐 Authentication** - Securely logs into WSEI platform
2. **📚 Course Discovery** - Scans available courses
3. **🎯 Selection Interface** - Interactive course selection menu
4. **📊 Analysis** - Examines each course for downloadable materials
5. **⚡ Download** - Concurrent, resumable downloads with progress tracking
6. **📁 Organization** - Saves files in structured folders

## 🛠️ Advanced Configuration

### Browser Options

```json
{
  "browser": {
    "headless": false, // Set to false for debugging
    "slowMo": 100, // Add delay between actions
    "args": ["--no-sandbox", "--disable-setuid-sandbox"]
  }
}
```

### Download Settings

```json
{
  "downloadDir": "my-courses", // Custom download directory
  "concurrency": 3, // Number of simultaneous downloads
  "retryAttempts": 5, // Max retry attempts per file
  "timeout": 120000 // Download timeout in milliseconds
}
```

## 📊 Progress Tracking

The downloader provides real-time updates on:

- 📈 **Overall Progress** - Files processed vs. total files
- 💾 **Download Speed** - Current transfer rate
- 📁 **Current File** - What's being downloaded now
- ✅ **Success Rate** - Downloads vs. failures
- 💿 **Total Size** - Accumulated downloaded data

## 🔧 Scripts

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `npm start`             | 🚀 Start the downloader           |
| `npm run dev`           | 🔍 Start with debugging enabled   |
| `npm run lint`          | 🧹 Check code style               |
| `npm run lint:fix`      | ✨ Fix code style issues          |
| `npm test`              | 🧪 Run unit tests                 |
| `npm run test:watch`    | 👀 Run tests in watch mode        |
| `npm run test:coverage` | 📊 Run tests with coverage report |
| `npm run build:exe`     | 📦 Build standalone executables   |
| `npm run clean`         | 🗑️ Clean downloads and logs       |
| `npm run setup`         | ⚙️ Create example configuration   |

## 🧪 Testing

This project includes comprehensive unit tests to ensure reliability and maintainability.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests** - Test individual functions and modules
- **Integration Tests** - Test component interactions
- **Mocked Dependencies** - Puppeteer and file system operations are mocked

Test files are located in the `tests/` directory and follow the pattern `*.test.js`.

### Coverage Reports

Coverage reports are generated in the `coverage/` directory and include:

- HTML report for detailed visualization
- LCOV format for CI/CD integration
- Text summary in terminal

## 📦 Building Executables

Create standalone executables for different platforms:

```bash
# Build executables for all platforms
npm run build:exe

# Executables will be created in the dist/ directory:
# - wsei-course-downloader-linux-x64
# - wsei-course-downloader-macos-x64
# - wsei-course-downloader-macos-arm64
# - wsei-course-downloader-win-x64.exe
```

### Alpine Linux / musl libc Support

The standard Linux build uses glibc and may not work on Alpine Linux or other musl-based systems. To build for Alpine:

```bash
# Build Alpine-compatible executable
./build-alpine-executable.sh

# Or build manually with Docker
docker build -f Dockerfile.build-alpine -t wsei-alpine .
```

This creates `wsei-course-downloader-alpine-x64` which works on:

- Alpine Linux
- Docker containers using Alpine base images
- Other musl libc-based systems

### Supported Platforms

| Platform | Architecture  | Executable Name                      |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `wsei-course-downloader-linux-x64`   |
| macOS    | x64 (Intel)   | `wsei-course-downloader-macos-x64`   |
| macOS    | arm64 (M1/M2) | `wsei-course-downloader-macos-arm64` |
| Windows  | x64           | `wsei-course-downloader-win-x64.exe` |

### Running Executables

```bash
# Linux/macOS
./dist/wsei-course-downloader-linux-x64

# Windows
./dist/wsei-course-downloader-win-x64.exe
```

## 🔄 CI/CD Pipeline

This project includes a GitHub Actions workflow that:

1. **🧪 Runs Tests** - Executes unit tests on multiple Node.js versions
2. **🧹 Code Quality** - Runs linting and style checks
3. **📊 Coverage** - Generates and uploads coverage reports
4. **📦 Build Validation** - Tests executable building process
5. **🚀 Release Builds** - Creates executables for all platforms on releases

### Workflow Triggers

- **Push** to `main` or `develop` branches
- **Pull Requests** to `main` branch
- **Releases** (creates and uploads executables)

## 📝 Logging

Comprehensive logging system:

- **📊 General Logs** - Application flow and status
- **📥 Download Logs** - Detailed download information
- **❌ Error Logs** - Failed downloads with retry information
- **🔍 Debug Logs** - Detailed debugging information (dev mode)

Logs are stored in the `logs/` directory with automatic rotation.

## 🤝 Contributing

We welcome contributions! 🎉

1. 🍴 Fork the repository
2. 🌟 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. ✅ Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

### Development Guidelines

- 📏 Follow ESLint configuration
- 📝 Add JSDoc comments for new functions
- 🧪 Test your changes thoroughly
- 📚 Update documentation as needed

## 🛡️ Security

- 🔒 Credentials are stored locally only
- 🌐 No data is sent to external servers
- 🛡️ Uses secure HTTPS connections
- 🔐 Implements browser security features

## 📚 Dependencies

### Core Dependencies

- **🎭 Puppeteer** - Browser automation
- **📡 Axios** - HTTP client for downloads
- **🎨 Chalk** - Terminal styling
- **❓ Inquirer** - Interactive CLI prompts
- **📊 CLI Progress** - Progress bars

### Development Dependencies

- **🧹 ESLint** - Code linting and style enforcement

## 🐛 Troubleshooting

### Common Issues

**❌ Login Failed**

- Verify credentials in `config.json`
- Check WSEI platform availability
- Ensure 2FA is not enabled (not supported)

**❌ Download Failures**

- Check internet connection stability
- Increase timeout values in configuration
- Review error logs for specific issues

**❌ Browser Issues**

- Chrome browser automatically downloads on first run
- No manual Chrome installation required
- Try running with `headless: false` for debugging
- Check browser arguments compatibility

**❌ Linux Executable Errors**

- **"unsupported relocation type"** - You're running a glibc build on musl system (Alpine)
  - Use `./build-alpine-executable.sh` to create Alpine-compatible build
  - Or use the standard build on Ubuntu/Debian-based systems
- **Missing libraries** - Install required dependencies:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install libglib2.0-0 libnss3 libatk1.0-0
  ```

**❌ Chrome Not Found**

- Make sure you have run:
  ```bash
  npx puppeteer browsers install chrome
  ```
- Ensure Puppeteer is installed globally:
  ```bash
  npm install -g puppeteer
  ```
- If running in a CI or server environment, make sure the user has write permissions to the Puppeteer cache directory (usually `~/.cache/puppeteer`)

### Getting Help

- 📖 Check the [Wiki](https://github.com/yourusername/wsei-course-downloader/wiki)
- 🐛 Report bugs in [Issues](https://github.com/yourusername/wsei-course-downloader/issues)
- 💬 Join discussions in [Discussions](https://github.com/yourusername/wsei-course-downloader/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 🎓 WSEI University for providing the e-learning platform
- 🌟 The open-source community for the amazing tools and libraries
- 👥 All contributors who help improve this project

## ⭐ Star History

If this project helped you, please consider giving it a star! ⭐

---

<div align="center">

**Made with ❤️ by the WSEI Downloader Team**

[⬆ Back to Top](#-wsei-course-downloader)

</div>
