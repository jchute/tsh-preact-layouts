import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";

export default [
  { ignores: ["build/", "node_modules/"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: { react },
    settings: { react: { pragma: "h", version: "16.0" } },
    rules: {
      "react/jsx-uses-vars": "error",
      "no-unused-vars": [
        "error",
        { ignoreRestSiblings: true, destructuredArrayIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["vite.config.js", "eslint.config.mjs", "plugins/**/*.js"],
    ignores: ["plugins/layouts/runtime/**/*.js"],
    languageOptions: { globals: { ...globals.node } },
  },
];
