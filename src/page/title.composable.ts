import { computed } from "vue";
import { useRoute, type RouteLocation } from "vue-router";
import { useI18n } from "vue-i18n";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";

/** Handle the custom title/createTitle route meta options. */
export default function usePageTitle() {
  const route = useRoute();
  const { t } = useI18n();
  const { th } = useLocale();
  const resourceStore = useResourceStore();
  const corpusName = computed<string>(
    () =>
      th(resourceStore.corpora[route.params.corpusId as string]?.name) ||
      (route.params.corpusId as string),
  );

  function getTitle(route: RouteLocation) {
    return route.meta.title
      ? t(route.meta.title)
      : route.meta.createTitle?.(route.params, corpusName.value);
  }

  const title = computed(() => getTitle(route));

  return {
    getTitle,
    title,
  };
}
