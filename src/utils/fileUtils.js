const fs = require('fs');
const sanitize = require('sanitize-filename');

/**
 * Formats bytes into human-readable format
 * @param {number} bytes - Number of bytes to format
 * @returns {string} Formatted string (e.g., "1.5 MB")
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Normalizes folder name by removing invalid characters and limiting length
 * @param {string} name - Original folder name
 * @returns {string} Normalized folder name safe for filesystem
 */
function normalizeFolderName(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .substring(0, 255); // Limit length
}

/**
 * Checks if a file exists and has a size greater than 0.
 * @param {string} filepath - The full path to the file.
 * @returns {boolean} True if file exists and has content, false otherwise
 */
function fileExistsAndValid(filepath) {
  try {
    if (!fs.existsSync(filepath)) {
      return false;
    }

    const stats = fs.statSync(filepath);

    // Check if file is empty (less than 100 bytes might be an error page)
    if (stats.size < 100) {
      return false;
    }

    // Check if file is actually a file (not a directory)
    if (!stats.isFile()) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Ensures a directory exists, creating it if necessary
 * @param {string} dirPath - Directory path to ensure exists
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Extracts file extension from URL or filename
 * @param {string} url - URL or filename to extract extension from
 * @param {string} resourceType - Type of resource (optional)
 * @returns {string} File extension with dot (e.g., ".pdf")
 */
function getFileExtension(url, resourceType = 'unknown') {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('.pdf') || resourceType === 'pdf') {
    return '.pdf';
  } else if (urlLower.includes('.doc')) {
    return urlLower.includes('.docx') ? '.docx' : '.doc';
  } else if (urlLower.includes('.ppt')) {
    return urlLower.includes('.pptx') ? '.pptx' : '.ppt';
  } else if (urlLower.includes('.xls')) {
    return urlLower.includes('.xlsx') ? '.xlsx' : '.xls';
  } else if (urlLower.includes('.zip') || urlLower.includes('accept=zip')) {
    return '.zip';
  } else if (urlLower.includes('.mp4')) {
    return '.mp4';
  } else if (urlLower.includes('.avi')) {
    return '.avi';
  } else if (urlLower.includes('.mov')) {
    return '.mov';
  } else if (resourceType !== 'unknown') {
    return `.${resourceType}`;
  } else {
    return '.html'; // Default fallback
  }
}

/**
 * Sanitizes filename by removing invalid characters
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename safe for filesystem
 */
function sanitizeFilename(filename) {
  return filename.replace(/[<>:"/\\|?*]/g, '_');
}

module.exports = {
  formatBytes,
  normalizeFolderName,
  fileExistsAndValid,
  ensureDirectoryExists,
  getFileExtension,
  sanitizeFilename,
};
