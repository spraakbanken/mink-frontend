import { useRoute, type RouteLocation } from "vue-router";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";

/** Handle the custom title/createTitle route meta options. */
export default function usePageTitle() {
  const route = useRoute();
  const { t } = useI18n();
  const { th } = useLocale();
  const { resources } = useResourceStore();

  /** Get the title for a route */
  async function getTitle(route: RouteLocation): Promise<string | undefined> {
    // Prefer excplicit title or title function from route config
    if (route.meta.title) return t(route.meta.title);
    if (route.meta.createTitle) return route.meta.createTitle(route.params);

    // Look for resource id/name using route params
    const id = route.params.id as string | undefined;
    if (id) return th(resources[id]?.name) || id;

    return undefined;
  }

  /** Computed title of the current route */
  const title = computedAsync(() => getTitle(route));

  return {
    getTitle,
    title,
  };
}
