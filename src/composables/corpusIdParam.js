import { useRoute } from "vue-router";
import { computed } from "@vue/reactivity";

export default function useCorpusIdParam() {
  const route = useRoute();
  const corpusId = computed(() => route.params.corpusId);
  return {
    corpusId,
  };
}
