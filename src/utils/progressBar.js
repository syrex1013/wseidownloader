const cliProgress = require('cli-progress');
const chalk = require('chalk');

/**
 * Rich progress bar that acts as a stateless renderer.
 */
class ProgressBarManager {
  constructor() {
    this.progressBar = new cliProgress.SingleBar({
      format: '{bar} | {percentage}% | {value}/{total} | {status}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      clearOnComplete: false,
    });
    this.isStarted = false;
  }

  /**
   * Starts the progress bar.
   * @param {number} total - The total number of items to process.
   * @returns {void}
   */
  start(total) {
    if (this.isStarted) return;
    this.progressBar.start(total, 0, {
      status: chalk.cyan('Initializing...'),
    });
    this.isStarted = true;
  }

  /**
   * Stops the progress bar.
   * @returns {void}
   */
  stop() {
    if (this.isStarted) {
      this.progressBar.stop();
      this.isStarted = false;
    }
  }

  /**
   * Updates the progress bar with the current state.
   * @param {number} processedCount - The number of items processed so far.
   * @param {object} stats - The stats object with downloaded, skipped, failed counts.
   * @param {string} statusMessage - The message to display.
   * @returns {void}
   */
  update(processedCount, stats, statusMessage) {
    if (!this.isStarted) return;

    const successRate =
      stats.totalFiles > 0
        ? Math.round(
          ((stats.downloadedFiles + stats.skippedFiles) / stats.totalFiles) *
              100,
        )
        : 0;

    const fileStats =
      chalk.green(`✅ ${stats.downloadedFiles} `) +
      chalk.yellow(`⏭️ ${stats.skippedFiles} `) +
      chalk.red(`❌ ${stats.failedFiles} `);

    const status = `${fileStats} | ${successRate}% | ${statusMessage}`;

    this.progressBar.update(processedCount, { status });
  }
}

// Singleton instance
let progressBarInstance = null;

/**
 * Gets or creates the progress bar manager instance.
 * @returns {ProgressBarManager} The progress bar manager instance.
 */
function getProgressBar() {
  if (!progressBarInstance) {
    progressBarInstance = new ProgressBarManager();
  }
  return progressBarInstance;
}

module.exports = { getProgressBar };
