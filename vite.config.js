import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import pluginRewriteAll from "vite-plugin-rewrite-all";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), pluginRewriteAll()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
