/** @type {import("stylelint").Config} */
export default {
  ignoreFiles: ["build/**", "node_modules/**"],
  plugins: ["stylelint-order"],
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    "order/properties-alphabetical-order": true,
  },
};
