export default {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended",
  ],
  rules: {
    // Your custom rules (optional)
    "vue/multi-word-component-names": "off", // if you have single-word components
  },
};
