import { MinkClient } from "@/api/api";
import { useAppConfig } from "@/app/useAppConfig";

/** Global single client instance */
let api: MinkClient | null = null;

/** Use the Mink backend client singleton instance */
export function useApi() {
  const { appConfig } = useAppConfig();

  // Instantiate at first use
  if (!api) {
    const baseUrl = appConfig.backendUrl;
    api = new MinkClient(baseUrl);
  }

  return api;
}
