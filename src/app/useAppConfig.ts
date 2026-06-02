import { inject } from "vue";
import { injectionKeys } from "@/injection";

/** Injects app config from instance plugin */
export function useAppConfig() {
  // Get app config from instance plugin
  const appConfig = inject(injectionKeys.config, {});

  const resourceTypes = enabledKeys(appConfig.types || {});

  const exploreTools = enabledKeys(appConfig.types?.corpus?.explore || {});

  const tools = enabledKeys(appConfig.tools || {});

  return {
    appConfig,
    resourceTypes,
    exploreTools,
    tools,
  };
}

/** Returns an array of keys from an object where the value is truthy */
const enabledKeys = <T extends object>(obj: T): (keyof T)[] =>
  (Object.keys(obj) as (keyof T)[]).filter((key) => !!obj[key]);
