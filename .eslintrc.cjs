module.exports = {
  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/eslint-config-typescript",
    "prettier", // Keep Prettier last
  ],
  plugins: ["import"],
  rules: {
    "import/order": ["warn"],
  },
};
