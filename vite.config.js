import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import visualizer from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load .env files. Vite will do it itself, but only later. See https://github.com/vitejs/vite/issues/1930
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  // Read HTTPS cert and key, if their paths are specified in env.
  const DEV_HTTPS = {};
  if (process.env.DEV_HTTPS_KEY && process.env.DEV_HTTPS_CERT) {
    const fs = require("fs");
    DEV_HTTPS.key = fs.readFileSync(process.env.DEV_HTTPS_KEY);
    DEV_HTTPS.cert = fs.readFileSync(process.env.DEV_HTTPS_CERT);
  }

  return {
    plugins: [
      vue(),
      pluginRewriteAll(),
      visualizer(), // Keep visualizer last.
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
      https: DEV_HTTPS,
    },
  };
});
