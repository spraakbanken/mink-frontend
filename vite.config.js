import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), pluginRewriteAll(),
    vueI18n({
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, './path/to/src/locales/**')
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
