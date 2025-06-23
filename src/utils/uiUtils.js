const chalk = require('chalk');

/**
 * Updates progress display in the terminal
 * @param {number} current - Current progress value
 * @param {number} total - Total value for progress calculation
 * @param {string} status - Status message to display
 * @returns {void}
 */
function updateProgress(current, total, status) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const barLength = 40;
  const filledLength = Math.round((percentage / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

  process.stdout.write('\r\x1b[K'); // Clear line
  process.stdout.write(
    `${chalk.cyan(bar)} ${chalk.yellow(percentage + '%')} | ` +
      `${chalk.green(current)}/${chalk.blue(total)} | ` +
      `${chalk.white(status.substring(0, 50))}...`,
  );
}

/**
 * Displays the application header
 * @returns {void}
 */
function displayHeader() {
  console.clear();
  console.log(
    chalk.cyan(
      '╔══════════════════════════════════════════════════════════════╗',
    ),
  );
  console.log(
    chalk.cyan(
      '║                  🎓 WSEI Course Downloader                   ║',
    ),
  );
  console.log(
    chalk.cyan(
      '║                    Professional Edition                      ║',
    ),
  );
  console.log(
    chalk.cyan(
      '╚══════════════════════════════════════════════════════════════╝',
    ),
  );
  console.log();
}

/**
 * Displays download statistics in a formatted box
 * @param {Object} stats - Statistics object containing download information
 * @param {string} formatBytes - Function to format bytes
 * @returns {void}
 */
function displayStats(stats, formatBytes) {
  console.log(
    chalk.cyan(
      '\n╔═══════════════════ DOWNLOAD STATISTICS ═══════════════════╗',
    ),
  );
  console.log(
    chalk.cyan('║') +
      chalk.white(` Course: ${stats.currentCourse}`.padEnd(58)) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.white(
        ` Current: ${stats.currentFile}`.substring(0, 58).padEnd(58),
      ) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.green(` Downloaded: ${stats.downloadedFiles}`.padEnd(20)) +
      chalk.yellow(`Skipped: ${stats.skippedFiles}`.padEnd(18)) +
      chalk.red(`Failed: ${stats.failedFiles}`.padEnd(18)) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.blue(` Total Size: ${formatBytes(stats.totalSize)}`.padEnd(58)) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.magenta(
        ` Success Rate: ${
          stats.totalFiles > 0
            ? Math.round(
              ((stats.downloadedFiles + stats.skippedFiles) /
                  stats.totalFiles) *
                  100,
            )
            : 0
        }%`.padEnd(58),
      ) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('╚════════════════════════════════════════════════════════════╝'),
  );
}

/**
 * Displays final summary statistics
 * @param {Object} stats - Statistics object containing download information
 * @param {string} formatBytes - Function to format bytes
 * @returns {void}
 */
function displayFinalSummary(stats, formatBytes) {
  console.log(
    chalk.cyan('\n\n╔═══════════════════ FINAL SUMMARY ═══════════════════╗'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.green(` ✅ Downloaded: ${stats.downloadedFiles} files`.padEnd(58)) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.yellow(
        ` ⏭️  Skipped: ${stats.skippedFiles} files (already existed)`.padEnd(58),
      ) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.red(` ❌ Failed: ${stats.failedFiles} files`.padEnd(58)) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.blue(` 📊 Total Size: ${formatBytes(stats.totalSize)}`.padEnd(58)) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.magenta(
        ` 🎯 Success Rate: ${
          stats.totalFiles > 0
            ? Math.round(
              ((stats.downloadedFiles + stats.skippedFiles) /
                  stats.totalFiles) *
                  100,
            )
            : 0
        }%`.padEnd(58),
      ) +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('╚════════════════════════════════════════════════════════════╝'),
  );
  console.log(chalk.green('\n🎉 Process completed successfully!\n'));
}

/**
 * Displays a status line with current statistics
 * @param {Object} stats - Statistics object
 * @param {string} formatBytes - Function to format bytes
 * @returns {string} Formatted status line
 */
function getStatusLine(stats, formatBytes) {
  return (
    chalk.cyan('   📊 Status: ') +
    chalk.green(`Downloaded: ${stats.downloadedFiles} `) +
    chalk.yellow(`Skipped: ${stats.skippedFiles} `) +
    chalk.red(`Failed: ${stats.failedFiles} `) +
    chalk.blue(`Size: ${formatBytes(stats.totalSize)}`)
  );
}

module.exports = {
  updateProgress,
  displayHeader,
  displayStats,
  displayFinalSummary,
  getStatusLine,
};
