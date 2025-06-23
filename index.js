#!/usr/bin/env node

/**
 * WSEI Course Downloader - Professional Edition
 *
 * This is the main entry point for the WSEI Course Downloader application.
 * The application is now organized into a modular structure for better
 * maintainability and production readiness.
 *
 * @author WSEI Course Downloader Team
 * @version 2.0.0
 */

// Import and run the main application
const { main } = require("./src/app");

// Run the application
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
