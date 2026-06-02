import { MinkClient } from "@/api/api";

/** Global single client instance */
let api: MinkClient | null = null;

/** Use the Mink backend client singleton instance */
export function useApi() {
  // Instantiate at first use
  if (!api) {
    const base = import.meta.env.VITE_BACKEND_URL;
    api = new MinkClient(base);
  }

  return api;
}
