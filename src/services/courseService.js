const chalk = require('chalk');
const logger = require('../../logger');

/**
 * Fetches available courses from the WSEI platform
 * @param {Object} page - Puppeteer page object
 * @param {string} coursesUrl - Courses URL from config
 * @returns {Promise<Array>} Array of course objects
 */
async function fetchCourses(page, coursesUrl) {
  console.log(chalk.blue('📚 Fetching available courses...'));
  logger.info('Navigating to courses page', { url: coursesUrl });

  try {
    await page.goto(coursesUrl, { waitUntil: 'networkidle2' });

    // Click on "Moje kursy" to expand the list
    try {
      logger.info('Looking for \'Moje kursy\' to expand...');
      await page.waitForSelector(
        'a[href="https://dl.wsei.pl/my/courses.php"]',
        { timeout: 10000 },
      );
      await page.click('a[href="https://dl.wsei.pl/my/courses.php"]');
      logger.info('\'Moje kursy\' link clicked.');

      // Wait for the nested course list to be populated
      await page.waitForSelector('li.type_course a', { timeout: 15000 });
      logger.info('Nested course list loaded.');
    } catch (e) {
      logger.warn(
        '\'Moje kursy\' link not found or course list did not load, proceeding with existing content.',
      );
    }

    // Updated logic to find courses within the specific "Moje kursy" structure
    const courses = await page.evaluate(() => {
      /* global document */
      // First, try the specific nested structure for "Moje kursy"
      let courseElements = document.querySelectorAll(
        'li.type_course a[href*="view.php?id="]',
      );

      // Fallback to the old method if the new one finds nothing
      if (courseElements.length === 0) {
        courseElements = document.querySelectorAll(
          '[data-region="course-content"] a',
        );
      }

      const courseList = [];
      const seenUrls = new Set();

      courseElements.forEach((element) => {
        try {
          const courseUrl = element.href;
          if (seenUrls.has(courseUrl)) return;

          let courseName = (element.title || element.textContent).trim();

          // Clean up course name
          courseName = courseName
            .replace(/Moduł:\s*/, '')
            .replace(/Ćwiczenia:\s*/, '')
            .replace(/\s*-\s*S$/, '')
            .trim();

          if (courseName && courseUrl) {
            courseList.push({
              name: courseName,
              url: courseUrl,
              category: 'My Courses', // All courses from here are user's courses
              progress: 'N/A',
            });
            seenUrls.add(courseUrl);
          }
        } catch (error) {
          /* global console */
          console.warn('Skipping malformed course element:', error);
        }
      });

      return courseList;
    });

    logger.info(`Found ${courses.length} courses`, { count: courses.length });
    console.log(chalk.green(`✓ Found ${courses.length} courses`));
    return courses;
  } catch (error) {
    logger.error('Error fetching courses', {
      error: error.message,
      stack: error.stack,
    });
    console.log(chalk.red(`❌ Error fetching courses: ${error.message}`));
    return [];
  }
}

/**
 * Extracts downloadable resources from a course page
 * @param {Object} page - Puppeteer page object
 * @param {string} courseUrl - URL of the course to extract resources from
 * @returns {Promise<Array>} Array of resource objects
 */
async function extractResources(page, courseUrl) {
  try {
    logger.info(`Extracting resources from course: ${courseUrl}`);
    await page.goto(courseUrl, { waitUntil: 'networkidle2' });

    const resources = await page.evaluate(() => {
      /* global document */
      const resourceList = [];

      // Find all resource links
      const resourceSelectors = [
        'a[href*="/pluginfile.php/"]',
        'a[href*="forcedownload=1"]',
        'a[href*="public.php/dav/files"]',
        'a[href*="accept=zip"]',
        '.resourceworkaround a',
        'a[class*="resource"]',
        'a[class*="file"]',
        // New selectors to capture standard Moodle resource links
        'a[href*="/mod/resource/view.php"]',
        'a[href*="/mod/folder/view.php"]',
        'a[href*="/mod/url/view.php"]',
        'a[href*="/mod/page/view.php"]',
        'a.aalink',
      ];

      const resourceElements = document.querySelectorAll(
        resourceSelectors.join(', '),
      );

      resourceElements.forEach((element) => {
        try {
          const url = element.href;
          const name = element.textContent.trim();

          // Skip if no name or URL
          if (!name || !url) return;

          // Determine resource type
          let type = 'unknown';
          const urlLower = url.toLowerCase();

          if (urlLower.includes('.pdf')) {
            type = 'pdf';
          } else if (urlLower.includes('.doc')) {
            type = urlLower.includes('.docx') ? 'docx' : 'doc';
          } else if (urlLower.includes('.ppt')) {
            type = urlLower.includes('.pptx') ? 'pptx' : 'ppt';
          } else if (urlLower.includes('.xls')) {
            type = urlLower.includes('.xlsx') ? 'xlsx' : 'xls';
          } else if (
            urlLower.includes('.zip') ||
            urlLower.includes('accept=zip')
          ) {
            type = 'zip';
          } else if (urlLower.includes('.mp4')) {
            type = 'mp4';
          } else if (urlLower.includes('.avi')) {
            type = 'avi';
          } else if (urlLower.includes('.mov')) {
            type = 'mov';
          }

          const modMatch = url.match(/\/mod\/(\w+)\//);
          const modType = modMatch ? modMatch[1] : null;
          const allowedMods = ['resource', 'folder', 'url', 'page', 'file'];
          if (
            modType &&
            !allowedMods.includes(modType) &&
            !url.includes('/pluginfile.php/')
          ) {
            return; // Skip non-downloadable items like assign, quiz, etc.
          }

          // Check if this resource is already in the list
          const exists = resourceList.some(
            (r) => r.name === name && r.url === url,
          );
          if (!exists) {
            resourceList.push({
              name: name,
              url: url,
              type: type,
            });
          }
        } catch (error) {
          // Skip malformed resource elements
          /* global console */
          console.warn('Skipping malformed resource element:', error);
        }
      });

      return resourceList;
    });

    logger.info(`Found ${resources.length} resources`, {
      count: resources.length,
      sample: resources
        .slice(0, 3)
        .map((r) => ({ name: r.name, type: r.type })),
    });

    return resources;
  } catch (error) {
    logger.error(`Error extracting resources: ${error.message}`, {
      courseUrl,
      error: error.stack,
    });
    console.log(chalk.red(`❌ Error extracting resources: ${error.message}`));
    return [];
  }
}

/**
 * Validates course data structure
 * @param {Object} course - Course object to validate
 * @returns {boolean} True if course is valid, false otherwise
 */
function validateCourse(course) {
  if (!course || typeof course !== 'object') {
    return false;
  }

  if (
    !course.name ||
    typeof course.name !== 'string' ||
    course.name.trim() === ''
  ) {
    return false;
  }

  if (
    !course.url ||
    typeof course.url !== 'string' ||
    course.url.trim() === ''
  ) {
    return false;
  }

  return true;
}

module.exports = {
  fetchCourses,
  extractResources,
  validateCourse,
};
