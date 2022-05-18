module.exports = {
  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    // https://eslint.vuejs.org/user-guide/#does-not-work-well-with-script-setup
    "vue/script-setup-uses-vars": "error",
  },
};
