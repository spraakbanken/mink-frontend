import { computed } from "vue";
import { useRoute, type RouteLocation } from "vue-router";
import { useI18n } from "vue-i18n";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";
import { parseConfig, type ConfigOptions } from "@/api/corpusConfig";

/** Handle the custom title/createTitle route meta options. */
export default function usePageTitle() {
  const route = useRoute();
  const { t } = useI18n();
  const { th } = useLocale();
  const resourceStore = useResourceStore();

  /** Get the title for a route */
  function getTitle(route: RouteLocation): string | undefined {
    // Prefer excplicit title or title function from route config
    if (route.meta.title) return t(route.meta.title);
    if (route.meta.createTitle) return route.meta.createTitle(route.params);

    // Look for resource id/name using route params
    const resourceId =
      (route.params.resourceId as string | undefined) ||
      (route.params.corpusId as string | undefined);
    const resourceName = (resourceId && getName(resourceId)) || resourceId;
    return resourceName;
  }

  /** Look for name in corpus config */
  function getName(corpusId: string): string | undefined {
    const config = resourceStore.corpora[corpusId]?.config;
    if (!config) return;

    let parsedConfig: ConfigOptions;
    try {
      parsedConfig = parseConfig(config);
    } catch (error) {
      console.error(`Error parsing config for "${corpusId}":`, error);
      return;
    }

    return th(parsedConfig.name);
  }

  /** Computed title of the current route */
  const title = computed(() => getTitle(route));

  return {
    getTitle,
    title,
  };
}
