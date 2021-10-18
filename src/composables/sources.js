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

  function loadSources() {
    spin(getCorpus(corpusId), "Hämtar textlista").then((sourcesFetched) =>
      store.commit("setSources", {
        corpusId: corpusId,
        sources: sourcesFetched,
      })
    );
  }

  async function remove(source) {
    await spin(removeSource(corpusId, source.name), "Raderar textfil");
    loadSources();
  }

  async function upload(event) {
    await spin(putSources(corpusId, event.target.files), "Laddar upp textfil");
    loadSources();
  }

  return {
    sources,
    loadSources,
    remove,
    upload,
  };
}
