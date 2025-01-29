import pluginVue from "eslint-plugin-vue";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import importPlugin from "eslint-plugin-import";

export default defineConfigWithVueTs(
  {
    ignores: ["node_modules", "dist", ".vscode"],
  },

  // https://github.com/vuejs/eslint-config-typescript?tab=readme-ov-file#minimal-setup
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,

  // https://github.com/import-js/eslint-plugin-import

  {
    ...importPlugin.flatConfigs.recommended,

    settings: {
      // Tell eslint-plugin-import to use eslint-import-resolver-typescript
      "import/resolver": "typescript",
    },
    rules: {
      // https://github.com/import-js/eslint-plugin-import
      "import/order": ["warn"],
    },
  },

  // Assume that a separate command is used for formatting
  // https://github.com/vuejs/eslint-config-prettier?tab=readme-ov-file#use-separate-commands-for-linting-and-formatting
  skipFormatting,
);
