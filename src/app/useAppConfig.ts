import { inject } from "vue";
import { injectionKeys } from "@/injection";

/** Injects app config from instance plugin */
export function useAppConfig() {
  // Get app config from instance plugin
  // TODO Validate config
  const appConfig = inject(injectionKeys.config, undefined);

  if (!appConfig) {
    throw new Error(
      "App config not found. Make sure to provide it in the instance plugin.",
    );
  }

  const resourceTypes = enabledKeys(appConfig.types || {});

  const corpusSettings = { ...appConfig.types?.corpus };

  const exploreTools = enabledKeys(appConfig.types?.corpus?.explore || {});

  const lexiconSettings = {
    // Use current base URL as default Mink URL
    minkUrl: location.origin + import.meta.env.BASE_URL,
    ...appConfig.types?.lexicon,
  };

  const tools = enabledKeys(appConfig.tools || {});

  return {
    appConfig,
    resourceTypes,
    exploreTools,
    corpusSettings,
    lexiconSettings,
    tools,
  };
}

/** Returns an array of keys from an object where the value is truthy */
const enabledKeys = <T extends object>(obj: T): (keyof T)[] =>
  (Object.keys(obj) as (keyof T)[]).filter((key) => !!obj[key]);
