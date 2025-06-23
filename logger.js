const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

class Logger {
  constructor() {
    this.logDir = "logs";
    this.logFile = path.join(
      this.logDir,
      `download-${new Date().toISOString().split("T")[0]}.log`
    );
    this.errorLogFile = path.join(this.logDir, "error.log");
    this.ensureLogDir();
    this.debugMode = process.env.DEBUG === "true";
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  writeToFile(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };

    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + "\n");
  }

  writeToErrorLog(message, data) {
    const timestamp = new Date().toISOString();
    const errorEntry = {
      timestamp,
      message,
      data,
    };

    // Write detailed error to error.log
    fs.appendFileSync(
      this.errorLogFile,
      JSON.stringify(errorEntry, null, 2) + "\n\n"
    );
  }

  debug(message, data = null) {
    if (this.debugMode) {
      console.log(chalk.gray(`🔍 ${message}`));
    }
    this.writeToFile("DEBUG", message, data);
  }

  info(message, data = null) {
    this.writeToFile("INFO", message, data);
  }

  success(message, data = null) {
    this.writeToFile("SUCCESS", message, data);
  }

  warn(message, data = null) {
    this.writeToFile("WARNING", message, data);
  }

  warning(message, data = null) {
    this.warn(message, data);
  }

  error(message, data = null) {
    if (data && typeof data === "object" && (data.error || data.stack)) {
      this.writeToFile("ERROR", message, data);
      this.writeToErrorLog(message, data);
    } else {
      const errorData = {
        error: data?.message || data,
        stack: data?.stack,
      };
      this.writeToFile("ERROR", message, errorData);
      if (data) {
        this.writeToErrorLog(message, errorData);
      }
    }
  }

  // Special method for download failures with all details
  logDownloadError(message, details) {
    this.writeToFile("DOWNLOAD_ERROR", message, details);
    this.writeToErrorLog(`Download Failed: ${message}`, details);
  }

  download(filename, size, status) {
    const message = `${status}: ${filename} (${size})`;
    if (status === "Downloaded") {
      console.log(chalk.green(`   ✅ ${message}`));
    } else if (status === "Skipped") {
      console.log(chalk.yellow(`   ⏭️  ${message}`));
    } else {
      console.log(chalk.red(`   ❌ ${message}`));
    }
    this.writeToFile("DOWNLOAD", message, { filename, size, status });
  }

  getLogPath() {
    return this.logFile;
  }

  getErrorLogPath() {
    return this.errorLogFile;
  }
}

module.exports = new Logger();
