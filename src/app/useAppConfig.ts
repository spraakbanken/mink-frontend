import { inject } from "vue";
import { injectionKeys } from "@/injection";
import { getBaseUrl } from "@/util";

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

  // Provide current instance URL as fallback for minkUrl
  const minkUrl = appConfig.minkUrl || getBaseUrl();

  const resourceTypes = enabledKeys(appConfig.types || {});

  const corpusSettings = { ...appConfig.types?.corpus };

  const exploreTools = enabledKeys(appConfig.types?.corpus?.explore || {});

  const lexiconSettings = { ...appConfig.types?.lexicon };

  const tools = enabledKeys(appConfig.tools || {});

  return {
    appConfig,
    minkUrl,
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
