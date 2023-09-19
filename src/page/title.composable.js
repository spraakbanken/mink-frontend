import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import useLocale from "../i18n/locale.composable";
import { useCorpusStore } from "../store/corpus.store";

/** Handle the custom title/createTitle route meta options. */
export default function usePageTitle() {
  const route = useRoute();
  const { t } = useI18n();
  const { th } = useLocale();
  const corpusStore = useCorpusStore();
  const corpusName = computed(
    () =>
      th(corpusStore.corpora[route.params.corpusId]?.config?.name) ||
      route.params.corpusId
  );

  function getTitle(route) {
    return route.meta.title
      ? t(route.meta.title)
      : route.meta.createTitle?.(t, corpusName.value, route.params);
  }

  const title = computed(() => getTitle(route));

  return {
    getTitle,
    title,
  };
}
