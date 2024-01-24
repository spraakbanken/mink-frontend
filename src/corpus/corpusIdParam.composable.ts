import { useRoute } from "vue-router";

export default function useCorpusIdParam() {
  const route = useRoute();
  return route.params.corpusId as string;
}
