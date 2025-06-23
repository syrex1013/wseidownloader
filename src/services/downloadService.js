const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const {
  fileExistsAndValid,
  ensureDirectoryExists,
  getFileExtension,
  sanitizeFilename,
  formatBytes,
} = require('../utils/fileUtils');
const { getProgressBar } = require('../utils/progressBar');
const logger = require('../../logger');

/**
 * Downloads a single resource file from the WSEI platform with retry logic.
 * It opens a new page for each resource to prevent session corruption and closes it afterwards.
 * @param {Object} mainPage - The main Puppeteer page object to get the browser context from.
 * @param {Object} resource - Resource object containing name, url, and type.
 * @param {string} courseFolder - Directory path where the file should be saved.
 * @param {Array} cookies - Array of cookies for authentication.
 * @param {function} onProgress - Callback function to update progress.
 * @param {number} retryCount - Current retry attempt number
 * @returns {Promise<Object>} Download result object.
 */
async function downloadResourceFile(
  mainPage,
  resource,
  courseFolder,
  cookies,
  onProgress,
  retryCount = 0,
) {
  const MAX_RETRIES = 3;
  const DOWNLOAD_TIMEOUT = 120000; // Increased to 120 seconds
  let resourcePage = null;
  let finalUrl = 'not-visited';
  let downloadInfo = null;
  let navigationAborted = false;

  logger.info(`Starting download for: ${resource.name}`, {
    url: resource.url,
    type: resource.type,
    retryCount: retryCount,
  });

  try {
    // Create a new page with error handling
    try {
      resourcePage = await mainPage.browser().newPage();
    } catch (pageError) {
      if (
        retryCount < MAX_RETRIES &&
        pageError.message.includes('Connection closed')
      ) {
        logger.warn(
          `Connection closed, retrying... (${retryCount + 1}/${MAX_RETRIES})`,
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        return downloadResourceFile(
          mainPage,
          resource,
          courseFolder,
          cookies,
          onProgress,
          retryCount + 1,
        );
      }
      throw pageError;
    }

    await resourcePage.setCookie(...cookies);
    await resourcePage.setUserAgent(await mainPage.browser().userAgent());

    let response;
    try {
      logger.debug(`Navigating to: ${resource.url}`);
      response = await resourcePage.goto(resource.url, {
        waitUntil: 'networkidle2',
        timeout: 30000, // Reduced timeout
      });
    } catch (error) {
      if (
        error.message.includes('net::ERR_ABORTED') ||
        error.constructor.name === 'TimeoutError'
      ) {
        logger.debug(
          'Navigation aborted/timeout - likely a direct download trigger.',
        );
        navigationAborted = true;
      } else {
        throw error; // Rethrow other navigation errors.
      }
    }

    finalUrl = response ? response.url() : resourcePage.url();
    logger.debug(`Final URL after navigation: ${finalUrl}`);

    if (navigationAborted) {
      logger.info(
        'Navigation aborted, assuming direct download from original URL.',
      );
      downloadInfo = {
        url: resource.url,
        filename: resource.name,
        method: 'aborted-navigation-direct-download',
      };
    } else if (response && response.headers()['content-disposition']) {
      // Strategy 1: The page itself is the file (common for direct links).
      const disposition = response.headers()['content-disposition'];
      const filenameMatch = disposition.match(
        /filename\*?=(UTF-8''|")?([^";]+)"?/,
      );
      const filename = decodeURIComponent(filenameMatch[2]);

      downloadInfo = {
        url: finalUrl,
        filename: sanitizeFilename(filename),
        method: 'content-disposition',
      };
      logger.info('Download strategy: content-disposition', { filename });
    } else if (
      finalUrl.includes('/pluginfile.php/') ||
      finalUrl.match(
        /\.(pdf|doc|docx|ppt|pptx|xls|xlsx|zip|mp4|avi|mov|mkv|wmv|flv|webm)$/i,
      )
    ) {
      // Strategy 2: URL is a direct file link.
      downloadInfo = {
        url: finalUrl,
        filename: decodeURIComponent(finalUrl.split('/').pop().split('?')[0]),
        method: 'direct-file-url',
      };
      logger.info('Download strategy: direct file URL', { url: finalUrl });
    } else {
      // Strategy 3: Scrape the page for the actual download link.
      logger.debug('Attempting to scrape page for download link', {
        url: finalUrl,
      });
      downloadInfo = await Promise.race([
        resourcePage.evaluate(() => {
          /* global document, FormData, URLSearchParams, window */
          // Moodle folder download-all button
          const folderDownloadBtn = document.querySelector(
            'button[type="submit"][name="download"]',
          );
          if (folderDownloadBtn && folderDownloadBtn.form) {
            const formData = new FormData(folderDownloadBtn.form);
            const params = new URLSearchParams();
            for (const pair of formData.entries()) {
              params.append(pair[0], pair[1]);
            }
            return {
              url: `${folderDownloadBtn.form.action}?${params.toString()}`,
              filename: 'folder.zip',
              method: 'folder-zip-form',
            };
          }

          const linkSelectors = [
            'a[href*="/pluginfile.php/"]',
            'a.forcedownload',
            '.resourceworkaround a',
            'a[href*="forcedownload=1"]',
            'a[href*="public.php/dav/files"]',
          ];
          const downloadLink = document.querySelector(linkSelectors.join(', '));
          if (downloadLink) {
            return {
              url: downloadLink.href,
              filename:
                downloadLink.download ||
                downloadLink.href.split('/').pop().split('?')[0],
              method: 'download-link',
            };
          }

          // Embedded content (PDFs, videos, etc.)
          const embed = document.querySelector(
            'embed[type="application/pdf"], object[type="application/pdf"], iframe[src*=".pdf"], object[data], embed[src], video source, video[src]',
          );
          if (embed) {
            const src = embed.src || embed.data || embed.getAttribute('src');
            if (src) {
              return {
                url: new URL(src, window.location.origin).href,
                filename: src.split('/').pop().split('?')[0],
                method: 'embedded-content',
              };
            }
          }
          return null;
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Page evaluation timeout')), 10000),
        ),
      ]);

      if (downloadInfo) {
        logger.info('Download strategy: scraped from page', {
          method: downloadInfo.method,
          url: downloadInfo.url,
        });
      } else {
        // If scraping fails, it means the page is likely just informational.
        logger.warn('Could not find a download link on the page, skipping.', {
          resourceName: resource.name,
          finalUrl: finalUrl,
        });
        return {
          success: false,
          error: 'No download link found on page',
          filename: sanitizeFilename(resource.name),
          skipped: true,
        };
      }
    }

    // Skip HTML files unless they're actual downloadable files
    if (!downloadInfo && finalUrl && !finalUrl.startsWith('about:blank')) {
      logger.debug('No download info found, checking if page contains file');
      // Check if the page contains a file or is just an HTML page
      const isFileResource = await Promise.race([
        resourcePage.evaluate(() => {
          /* global document */
          // Check for file indicators
          const hasDownloadLink = document.querySelector(
            'a[href*="forcedownload"], a.forcedownload, .resourceworkaround a',
          );
          const hasEmbeddedContent = document.querySelector(
            'embed, object[data], iframe[src*=".pdf"], video',
          );
          const hasFileIcon = document.querySelector(
            'img[src*="/f/"], .activityicon[src*="/f/"]',
          );

          return hasDownloadLink || hasEmbeddedContent || hasFileIcon;
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('File check timeout')), 5000),
        ),
      ]);

      if (!isFileResource) {
        // This is just an HTML page, not a downloadable resource
        logger.info('Skipping HTML page - not a downloadable resource');
        return {
          success: false,
          error: 'Not a downloadable file - HTML page only',
          filename: sanitizeFilename(resource.name),
          skipped: true,
        };
      }
    }

    if (!downloadInfo) {
      // If we reach here and the final URL is about:blank, it's likely a failed navigation
      if (finalUrl === 'about:blank' || finalUrl === 'not-visited') {
        logger.warn('Navigation resulted in blank page, skipping', {
          resourceName: resource.name,
          finalUrl: finalUrl,
        });
        return {
          success: false,
          error: 'Navigation resulted in blank page',
          filename: sanitizeFilename(resource.name),
          skipped: true,
        };
      }

      logger.error('Could not find download link', {
        resourceName: resource.name,
        finalUrl: finalUrl,
      });
      throw new Error(
        'Could not find a valid download link or content on the page.',
      );
    }

    // Filename will be determined after axios response
    // const filepath = path.join(courseFolder, filename);

    logger.info(`Attempting to download from: ${downloadInfo.url}`);

    if (
      fileExistsAndValid(
        path.join(
          courseFolder,
          sanitizeFilename(resource.name) +
            getFileExtension(downloadInfo.url, resource.type),
        ),
      )
    ) {
      const fileStats = fs.statSync(
        path.join(
          courseFolder,
          sanitizeFilename(resource.name) +
            getFileExtension(downloadInfo.url, resource.type),
        ),
      );
      logger.info('File already exists, skipping', {
        filename: resource.name,
        size: fileStats.size,
      });
      return {
        success: true,
        filename: resource.name,
        skipped: true,
        size: fileStats.size,
      };
    }

    ensureDirectoryExists(courseFolder);

    const cookieString = (await resourcePage.cookies())
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const progressBar = getProgressBar();

    // Download with timeout and progress tracking
    logger.debug('Starting axios download', { url: downloadInfo.url });

    let downloadResponse;
    try {
      downloadResponse = await Promise.race([
        axios({
          method: 'GET',
          url: downloadInfo.url,
          responseType: 'stream',
          headers: {
            Cookie: cookieString,
            'User-Agent': await mainPage.browser().userAgent(),
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            Referer: resource.url,
          },
          maxRedirects: 15,
          timeout: DOWNLOAD_TIMEOUT,
          validateStatus: function (status) {
            return status >= 200 && status < 300; // Default
          },
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Download request timeout')),
            DOWNLOAD_TIMEOUT,
          ),
        ),
      ]);
    } catch (axiosError) {
      logger.error('Axios download error', {
        error: axiosError.message,
        url: downloadInfo.url,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
      });
      throw axiosError;
    }

    // Final check: If the content type is HTML, it's not a file we want.
    const contentType = downloadResponse.headers['content-type'] || '';
    if (contentType.includes('text/html')) {
      logger.warn('Downloaded content is an HTML page, not a file. Skipping.', {
        url: downloadInfo.url,
      });

      // We must consume the stream to avoid memory leaks, but not save it.
      downloadResponse.data.on('data', () => {});
      await new Promise((resolve) => downloadResponse.data.on('end', resolve));

      return {
        success: false,
        error: 'Downloaded content was an HTML page',
        filename: sanitizeFilename(resource.name),
        skipped: true,
      };
    }

    const totalBytes =
      parseInt(downloadResponse.headers['content-length']) || 0;
    let downloadedBytes = 0;

    logger.info('Download started', {
      filename: resource.name,
      totalBytes,
      contentType: downloadResponse.headers['content-type'],
    });

    const writer = fs.createWriteStream(
      path.join(
        courseFolder,
        sanitizeFilename(resource.name) +
          getFileExtension(downloadInfo.url, resource.type),
      ),
    );
    let lastProgressUpdate = Date.now();

    // Track download progress
    downloadResponse.data.on('data', (chunk) => {
      downloadedBytes += chunk.length;

      const now = Date.now();
      if (now - lastProgressUpdate > 100) {
        onProgress(downloadedBytes, totalBytes, resource.name);
        lastProgressUpdate = now;
      }
    });

    downloadResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        writer.destroy();
        logger.error('File write timeout', {
          filename: resource.name,
          downloadedBytes,
        });
        reject(new Error('File write timeout'));
      }, DOWNLOAD_TIMEOUT);

      writer.on('finish', () => {
        clearTimeout(timeout);
        logger.info('Download completed', {
          filename: resource.name,
          downloadedBytes,
        });
        resolve();
      });

      writer.on('error', (err) => {
        clearTimeout(timeout);
        logger.error('Writer error', {
          filename: resource.name,
          error: err.message,
        });
        reject(err);
      });

      downloadResponse.data.on('error', (err) => {
        clearTimeout(timeout);
        logger.error('Download stream error', {
          filename: resource.name,
          error: err.message,
        });
        reject(err);
      });
    });

    const finalStats = fs.statSync(
      path.join(
        courseFolder,
        sanitizeFilename(resource.name) +
          getFileExtension(downloadInfo.url, resource.type),
      ),
    );
    if (finalStats.size < 100) {
      fs.unlinkSync(
        path.join(
          courseFolder,
          sanitizeFilename(resource.name) +
            getFileExtension(downloadInfo.url, resource.type),
        ),
      ); // Delete tiny files, likely error pages
      logger.warn('Downloaded file too small, likely error page', {
        filename: resource.name,
        size: finalStats.size,
      });
      throw new Error('Downloaded file is empty or an error page.');
    }

    logger.info('Download successful', {
      filename: resource.name,
      size: finalStats.size,
    });
    return { success: true, filename: resource.name, bytes: finalStats.size };
  } catch (error) {
    // Log detailed error information
    const errorDetails = {
      resourceName: resource.name,
      resourceUrl: resource.url,
      resourceType: resource.type,
      finalUrl: finalUrl,
      downloadUrl: downloadInfo?.url || 'not found',
      downloadMethod: downloadInfo?.method || 'none',
      filename: sanitizeFilename(resource.name),
      courseFolder: courseFolder,
      error: error.message,
      errorStack: error.stack,
      retryCount: retryCount,
      timestamp: new Date().toISOString(),
    };

    logger.logDownloadError(
      `Failed to download: ${resource.name}`,
      errorDetails,
    );

    // Retry on connection errors
    if (
      retryCount < MAX_RETRIES &&
      (error.message.includes('Connection closed') ||
        error.message.includes('Protocol error') ||
        error.message.includes('Target closed') ||
        error.message.includes('timeout') ||
        error.message.includes('ECONNRESET') ||
        error.message.includes('ETIMEDOUT'))
    ) {
      logger.warn(
        `Connection error, retrying... (${retryCount + 1}/${MAX_RETRIES}): ${
          error.message
        }`,
      );
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Increased delay
      return downloadResourceFile(
        mainPage,
        resource,
        courseFolder,
        cookies,
        onProgress,
        retryCount + 1,
      );
    }

    return {
      success: false,
      error: error.message,
      filename: sanitizeFilename(resource.name),
    };
  } finally {
    if (resourcePage && !resourcePage.isClosed()) {
      try {
        await resourcePage.close();
      } catch (closeError) {
        // Ignore close errors
        logger.debug('Error closing page:', closeError.message);
      }
    }
  }
}

/**
 * Downloads course materials for selected courses using a concurrent batching strategy.
 */
async function downloadCourseMaterials(
  page,
  selectedCourses,
  downloadDir,
  stats,
) {
  const mainDownloadDir = path.join(process.cwd(), downloadDir);
  ensureDirectoryExists(mainDownloadDir);
  const cookies = await page.cookies();
  const progressBar = getProgressBar();
  let statusMessage = chalk.cyan('Analyzing courses...');

  const updateUI = () => {
    const processedCount =
      stats.downloadedFiles + stats.skippedFiles + stats.failedFiles;
    progressBar.update(processedCount, stats, statusMessage);
  };

  logger.info('📊 Analyzing courses and preparing download queue...');
  updateUI();

  const resourceQueue = [];
  for (const course of selectedCourses) {
    const { extractResources } = require('./courseService');
    const resources = await extractResources(page, course.url);
    const courseFolderName = require('../utils/fileUtils').normalizeFolderName(
      course.name,
    );
    const courseFolder = path.join(mainDownloadDir, courseFolderName);

    logger.info(`Course folder: ${courseFolder}`, {
      courseName: course.name,
      resourceCount: resources.length,
    });

    for (const resource of resources) {
      resourceQueue.push({ resource, courseFolder, courseName: course.name });
    }
  }

  stats.totalFiles = resourceQueue.length;
  statusMessage = chalk.green(
    `✓ Found ${stats.totalFiles} total resources to process.`,
  );
  progressBar.start(stats.totalFiles);
  updateUI();

  const CONCURRENCY = 2;
  const processedCount = 0;

  for (let i = 0; i < resourceQueue.length; i += CONCURRENCY) {
    const chunk = resourceQueue.slice(i, i + CONCURRENCY);

    const downloadPromises = chunk.map((item) => {
      stats.currentCourse = item.courseName;
      stats.currentFile = item.resource.name;

      const onProgress = (downloadedBytes, totalBytes, filename) => {
        const downloadedMB = (downloadedBytes / 1024 / 1024).toFixed(1);
        const totalMB =
          totalBytes > 0 ? (totalBytes / 1024 / 1024).toFixed(1) : '?';
        const percentage =
          totalBytes > 0 ? Math.round((downloadedBytes / totalBytes) * 100) : 0;

        if (totalBytes > 0) {
          statusMessage = `📥 ${filename.substring(
            0,
            20,
          )}... ${downloadedMB}MB/${totalMB}MB (${percentage}%)`;
        } else {
          const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
          const spinnerFrame =
            spinner[Math.floor(Date.now() / 100) % spinner.length];
          statusMessage = `📥 ${filename.substring(
            0,
            20,
          )}... ${downloadedMB}MB ${spinnerFrame}`;
        }
        updateUI();
      };

      return downloadResourceFile(
        page,
        item.resource,
        item.courseFolder,
        cookies,
        onProgress,
      );
    });

    try {
      const results = await Promise.all(downloadPromises);

      results.forEach((result) => {
        if (result.success) {
          if (result.skipped) {
            stats.skippedFiles++;
            stats.totalSize += result.size || 0;
            statusMessage = chalk.yellow(
              `⏭️ Skipped: ${result.filename} (exists)`,
            );
          } else {
            stats.downloadedFiles++;
            stats.totalSize += result.bytes || 0;
            statusMessage = chalk.green(
              `✅ Downloaded: ${result.filename} (${formatBytes(
                result.bytes || 0,
              )})`,
            );
          }
        } else {
          if (result.skipped) {
            stats.skippedFiles++;
            statusMessage = chalk.yellow(
              `⏭️ Skipped: ${result.filename} - ${result.error}`,
            );
          } else {
            stats.failedFiles++;
            statusMessage = chalk.red(
              `❌ Failed: ${result.filename} - ${result.error.substring(0, 60)}`,
            );
          }
        }
        updateUI();
      });
    } catch (batchError) {
      stats.failedFiles += chunk.length;
      logger.error('Batch processing error', {
        error: batchError.message,
        stack: batchError.stack,
      });
      statusMessage = chalk.red(`❌ Batch error: ${batchError.message}`);
      updateUI();
    }

    if (i + CONCURRENCY < resourceQueue.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  progressBar.stop();
  console.log(chalk.cyan('\n✨ Download process completed!\n'));
}

module.exports = {
  downloadResourceFile,
  downloadCourseMaterials,
};
