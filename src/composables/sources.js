import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useMinkBackend from "./backend";

export default function useSources(corpusId) {
  const store = useStore();
  const mink = useMinkBackend();

  const sources = computed(() => store.state.corpora[corpusId]?.sources || []);

  async function loadSources(corpusId_ = corpusId) {
    const sourcesFetched = await mink.loadSources(corpusId_);
    store.commit("setSources", {
      corpusId: corpusId_,
      sources: sourcesFetched,
    });
  }

  async function downloadSource(source) {
    return mink.downloadSource(corpusId, source.name);
  }

  async function downloadPlaintext(source) {
    return mink.downloadPlaintext(corpusId, source.name);
  }

  async function uploadSources(files, corpusId_ = corpusId) {
    await mink.uploadSources(corpusId_, files);
    loadSources();
  }

  async function deleteSource(source) {
    await mink.deleteSource(corpusId, source.name);
    loadSources();
  }

  return {
    sources,
    loadSources,
    downloadSource,
    downloadPlaintext,
    uploadSources,
    deleteSource,
  };
}
