import { useRoute, type RouteLocation } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";

/** Handle the custom title/createTitle route meta options. */
export default function usePageTitle() {
  const route = useRoute();
  const { t } = useI18n();
  const { th } = useLocale();
  const { resources } = storeToRefs(useResourceStore());

  /** Get the title for a route */
  function getTitle(route: RouteLocation): string | undefined {
    // Prefer excplicit title or title function from route config
    if (route.meta.title) return t(route.meta.title);
    if (route.meta.createTitle) return route.meta.createTitle(route.params);

    // Look for resource id/name using route params
    const id = route.params.id as string | undefined;
    if (id) return th(resources.value[id]?.name) || id;

    return undefined;
  }

  /** Computed title of the current route */
  const title = computed(() => getTitle(route));

  return {
    getTitle,
    title,
  };
}
