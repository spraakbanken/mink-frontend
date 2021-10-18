import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { spin } from "@/assets/spin";
import { getCorpus, putSources, removeSource } from "@/assets/api";

export default function useSources() {
  const store = useStore();
  const route = useRoute();

  const corpusId = route.params.corpusId;
  const sources = computed(() => store.state.corpora[corpusId]?.sources || []);

  function loadSources(el = null) {
    spin(getCorpus(corpusId), "Hämtar textlista", el).then((sourcesFetched) =>
      store.commit("setSources", {
        corpusId: corpusId,
        sources: sourcesFetched,
      })
    );
  }

  async function remove(source, el = null) {
    await spin(removeSource(corpusId, source.name), "Raderar textfil", el);
    loadSources(el);
  }

  async function upload(files, el = null) {
    const message =
      files.length > 1 ? "Laddar upp textfiler" : "Laddar upp textfil";
    await spin(putSources(corpusId, files), message, el);
    loadSources(el);
  }

  return {
    sources,
    loadSources,
    remove,
    upload,
  };
}
