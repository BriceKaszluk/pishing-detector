module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "next", 
    "next/core-web-vitals", 
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/node_modules/**/*", // Ignore files in node_modules folder
    ".eslintrc.cjs", // Ignore the .eslintrc.cjs file
  ],
  plugins: [
    "@typescript-eslint",
    "import",
    "prettier",
  ],
  rules: {
    "quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": false }],
    "prettier/prettier": ["error", {}, { usePrettierrc: true }],
    "object-curly-spacing": ["error", "never"],
  },
};
