import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { spin } from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";
import { getCorpus, putSources, removeSource } from "@/assets/api";

export default function useSources() {
  const store = useStore();
  const { corpusId } = useCorpusIdParam();

  const sources = computed(
    () => store.state.corpora[corpusId.value]?.sources || []
  );

  function loadSources(el = null) {
    spin(getCorpus(corpusId.value), "Hämtar textlista", el).then(
      (sourcesFetched) =>
        store.commit("setSources", {
          corpusId: corpusId.value,
          sources: sourcesFetched,
        })
    );
  }

  async function remove(source, el = null) {
    await spin(
      removeSource(corpusId.value, source.name),
      "Raderar textfil",
      el
    );
    loadSources(el);
  }

  async function upload(files, el = null) {
    const message =
      files.length > 1 ? "Laddar upp textfiler" : "Laddar upp textfil";
    await spin(putSources(corpusId.value, files), message, el);
    loadSources(el);
  }

  return {
    sources,
    loadSources,
    remove,
    upload,
  };
}
