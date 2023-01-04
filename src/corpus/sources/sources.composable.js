import { computed } from "@vue/reactivity";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";

export default function useSources(corpusId) {
  const corpusStore = useCorpusStore();
  const mink = useMinkBackend();

  const sources = computed(
    () => corpusStore.getCorpus(corpusId).value?.sources || []
  );

  async function loadSources(corpusId_ = corpusId) {
    console.log("loadSources", corpusId);
    const sourcesFetched = await mink.loadSources(corpusId_);
    corpusStore.corpora[corpusId_].sources = sourcesFetched;
    console.log("loadSources", corpusStore.corpora[corpusId_].sources);
  }

  async function downloadSource(source) {
    return mink.downloadSource(corpusId, source.name);
  }

  async function downloadPlaintext(source) {
    return mink.downloadPlaintext(corpusId, source.name);
  }

  async function uploadSources(files, corpusId_ = corpusId) {
    await mink.uploadSources(corpusId_, files);
    loadSources(corpusId_);
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
