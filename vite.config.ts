import { ServerOptions } from "https";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { defineConfig, loadEnv, Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";
import vueDevTools from "vite-plugin-vue-devtools";
import { visualizer } from "rollup-plugin-visualizer";
import { parse } from "yaml";

type HttpsOptions = Pick<ServerOptions, "key" | "cert">;

const srcDir = fileURLToPath(new URL("src", import.meta.url));
const instanceDir = fileURLToPath(new URL("instance", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Load .env files. Vite will do it itself, but only later. See https://vite.dev/config/#using-environment-variables-in-config
  const env = loadEnv(mode, instanceDir, "");

  function getHttpsOptions(): HttpsOptions | undefined {
    if (env.DEV_HTTPS_KEY && env.DEV_HTTPS_CERT)
      return {
        key: readFileSync(env.DEV_HTTPS_KEY),
        cert: readFileSync(env.DEV_HTTPS_CERT),
      };
  }

  return {
    // Load env files from the instance folder
    envDir: instanceDir,
    plugins: [
      vue(),
      yamlLoader(),
      tailwindcss(),
      vueDevTools(),
      // Enable typechecking, see https://vite-plugin-checker.netlify.app/introduction/getting-started.html
      checker({ vueTsc: true }),
      visualizer(), // Keep visualizer last.
    ],
    resolve: {
      alias: {
        "@": srcDir,
        // Resolve imports of the instance plugin and custom code
        "@instance": instanceDir,
      },
      // Support module resolution in instance code when symlinked from an external directory
      preserveSymlinks: true,
    },
    // Allow env variable to override the base URL
    base: env.BASE || "/mink/",
    server: {
      // Change hostname and enable HTTPS if needed for authentication.
      // Map this hostname to 127.0.0.1 in /etc/hosts.
      host: env.DEV_HOST,
      https: getHttpsOptions(),
    },
    test: {
      environment: "happy-dom",
    },
  };
});

// Custom plugin for importing YAML files directly in code.
function yamlLoader(): Plugin {
  return {
    name: "vite-plugin-yaml",
    transform(src, id) {
      // Match file extension
      if (/\.yaml$/.test(id)) {
        // Load data from YAML
        const data = parse(src);
        // Dump JSON into JS
        return {
          code: `const data = ${JSON.stringify(data)};
            export default data;`,
        };
      }
    },
  };
}
