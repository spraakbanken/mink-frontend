import { useRoute, type RouteLocation } from "vue-router";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { storeToRefs } from "pinia";
import useLocale from "@/i18n/locale.composable";
import type { ConfigOptions } from "@/api/corpusConfig";
import { useConfigStore } from "@/store/config.store";

/** Handle the custom title/createTitle route meta options. */
export default function usePageTitle() {
  const route = useRoute();
  const { t } = useI18n();
  const { th } = useLocale();
  const { configs } = storeToRefs(useConfigStore());

  /** Get the title for a route */
  async function getTitle(route: RouteLocation): Promise<string | undefined> {
    // Prefer excplicit title or title function from route config
    if (route.meta.title) return t(route.meta.title);
    if (route.meta.createTitle) return route.meta.createTitle(route.params);

    // Look for resource id/name using route params
    const id = route.params.id as string | undefined;
    const resourceName = (id && (await getName(id))) || id;
    return resourceName;
  }

  /** Look for name in corpus config */
  async function getName(id: string): Promise<string | undefined> {
    if (!configs.value[id]) return;

    const { parseConfig } = await import("@/api/corpusConfig");
    let parsedConfig: ConfigOptions;
    try {
      parsedConfig = parseConfig(configs.value[id]);
    } catch (error) {
      console.error(`Error parsing config for "${id}":`, error);
      return;
    }

    return th(parsedConfig.name);
  }

  /** Computed title of the current route */
  const title = computedAsync(() => getTitle(route));

  return {
    getTitle,
    title,
  };
}
