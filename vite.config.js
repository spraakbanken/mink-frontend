import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import vueI18n from "@intlify/vite-plugin-vue-i18n";
const fs = require("fs");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    pluginRewriteAll(),
    vueI18n({
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, "./path/to/src/locales/**"),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: process.env.BASE,
  server: {
    // Remap hostname and enable HTTPS, in order for authentication to work.
    // Map this hostname to 127.0.0.1 in /etc/hosts.
    host: "minkdev.spraakbanken.gu.se",
    https: {
      // Make these certs with mkcert, see https://github.com/FiloSottile/mkcert
      // I used: mkcert spraakbanken.gu.se '*.spraakbanken.gu.se'
      key: fs.readFileSync("./local/spraakbanken.gu.se+1-key.pem"),
      cert: fs.readFileSync("./local/spraakbanken.gu.se+1.pem"),
    },
  },
});
