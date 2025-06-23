module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    // Error handling
    "no-console": "off", // Allow console for CLI application
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-undef": "error",

    // Code style
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],

    // Best practices
    "prefer-const": "error",
    "no-var": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",

    // Async/Await
    "require-await": "error",
    "no-async-promise-executor": "error",

    // Documentation
    "valid-jsdoc": "warn",

    // Security
    "no-implied-eval": "error",
    "no-new-func": "error",
  },
  globals: {
    // Node.js globals
    process: "readonly",
    Buffer: "readonly",
    __dirname: "readonly",
    __filename: "readonly",
    global: "readonly",
    module: "readonly",
    require: "readonly",
    exports: "readonly",
  },
};
