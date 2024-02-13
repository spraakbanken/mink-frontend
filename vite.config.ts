import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import { visualizer } from "rollup-plugin-visualizer";
import { ServerOptions as HttpsServerOptions } from "https";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Load .env files. Vite will do it itself, but only later. See https://github.com/vitejs/vite/issues/1930
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  // Read HTTPS cert and key, if their paths are specified in env.
  async function getHttpsOptions(): Promise<HttpsServerOptions | undefined> {
    if (process.env.DEV_HTTPS_KEY && process.env.DEV_HTTPS_CERT) {
      const fs = await import("fs");
      return <HttpsServerOptions>{
        key: fs.readFileSync(process.env.DEV_HTTPS_KEY),
        cert: fs.readFileSync(process.env.DEV_HTTPS_CERT),
      };
    }
  }

  return {
    plugins: [
      vue(),
      ViteYaml(),
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
      https: await getHttpsOptions(),
    },
    test: {
      environment: "happy-dom",
    },
  };
});
