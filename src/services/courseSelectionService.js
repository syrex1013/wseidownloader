const inquirer = require('inquirer');
const chalk = require('chalk');

/**
 * Handles course selection by the user
 * @param {Array} courses - Array of available courses
 * @returns {Promise<Array>} Array of selected course objects
 */
async function selectCourses(courses) {
  if (!courses || courses.length === 0) {
    console.log(chalk.red('❌ No courses available for selection'));
    return [];
  }

  console.log(chalk.cyan('\n📚 Available Courses:'));
  console.log(chalk.gray('─'.repeat(80)));

  courses.forEach((course, index) => {
    const courseNumber = chalk.cyan(`[${index + 1}]`);
    const courseName = chalk.white(course.name);
    const category = chalk.gray(`(${course.category})`);
    const progress = chalk.yellow(`Progress: ${course.progress}`);

    console.log(`${courseNumber} ${courseName} ${category} - ${progress}`);
  });

  console.log(chalk.gray('─'.repeat(80)));

  const questions = [
    {
      type: 'confirm',
      name: 'downloadAll',
      message: chalk.blue('Do you want to download all courses?'),
      default: true,
    },
  ];

  const { downloadAll } = await inquirer.prompt(questions);

  if (downloadAll) {
    console.log(chalk.green(`✓ Selected all ${courses.length} courses`));
    return courses;
  }

  // Manual course selection
  const courseSelectionQuestion = {
    type: 'input',
    name: 'selectedCourseNumbers',
    message: chalk.blue(
      'Enter course numbers separated by commas (e.g., 1,3,5):',
    ),
    validate: (input) => {
      if (!input.trim()) {
        return 'Please enter at least one course number';
      }

      const numbers = input.split(',').map((n) => n.trim());
      for (const num of numbers) {
        const courseIndex = parseInt(num) - 1;
        if (
          isNaN(courseIndex) ||
          courseIndex < 0 ||
          courseIndex >= courses.length
        ) {
          return `Invalid course number: ${num}. Please enter numbers between 1 and ${courses.length}`;
        }
      }
      return true;
    },
  };

  const { selectedCourseNumbers } = await inquirer.prompt([
    courseSelectionQuestion,
  ]);

  const selectedIndices = selectedCourseNumbers
    .split(',')
    .map((n) => parseInt(n.trim()) - 1);

  const selectedCourses = selectedIndices.map((index) => courses[index]);

  console.log(chalk.green(`✓ Selected ${selectedCourses.length} courses:`));
  selectedCourses.forEach((course) => {
    console.log(chalk.white(`   - ${course.name}`));
  });

  return selectedCourses;
}

/**
 * Validates selected courses
 * @param {Array} selectedCourses - Array of selected course objects
 * @param {Array} availableCourses - Array of all available courses
 * @returns {boolean} True if selection is valid, false otherwise
 */
function validateCourseSelection(selectedCourses, availableCourses) {
  if (!selectedCourses || !Array.isArray(selectedCourses)) {
    return false;
  }

  if (selectedCourses.length === 0) {
    return false;
  }

  // Check if all selected courses exist in available courses
  for (const selectedCourse of selectedCourses) {
    const exists = availableCourses.some(
      (available) =>
        available.name === selectedCourse.name &&
        available.url === selectedCourse.url,
    );

    if (!exists) {
      return false;
    }
  }

  return true;
}

/**
 * Displays course selection summary
 * @param {Array} selectedCourses - Array of selected course objects
 * @returns {void}
 */
function displayCourseSelectionSummary(selectedCourses) {
  console.log(chalk.cyan('\n📋 Course Selection Summary:'));
  console.log(chalk.gray('─'.repeat(60)));

  selectedCourses.forEach((course, index) => {
    const courseNumber = chalk.cyan(`[${index + 1}]`);
    const courseName = chalk.white(course.name);
    const category = chalk.gray(`(${course.category})`);

    console.log(`${courseNumber} ${courseName} ${category}`);
  });

  console.log(chalk.gray('─'.repeat(60)));
  console.log(chalk.green(`Total courses selected: ${selectedCourses.length}`));
}

module.exports = {
  selectCourses,
  validateCourseSelection,
  displayCourseSelectionSummary,
};
