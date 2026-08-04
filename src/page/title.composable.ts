import { useRoute, type RouteLocation } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";

/** Find a page title for the current route */
export default function usePageTitle() {
  const route = useRoute();
  const { t } = useI18n();
  const { th } = useLocale();
  const { resources } = useResourceStore();

  /** Get the title for a route */
  function getTitle(route: RouteLocation): string | undefined {
    // Prefer explicit title from route config
    if (route.meta.title) return t(route.meta.title);

    const paramValues = Object.values(route.params);

    // Look for resource id/name using route params
    if (paramValues.length == 1) {
      const id = route.params.id as string | undefined;
      if (id) return th(resources[id]?.name) || id;
    }

    // Use last given param
    if (paramValues.length > 0)
      return decodeURIComponent(String(paramValues.pop()));

    return undefined;
  }

  /** Computed title of the current route */
  const title = computed(() => getTitle(route));

  return {
    getTitle,
    title,
  };
}
