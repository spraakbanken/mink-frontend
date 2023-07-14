import { computed } from "@vue/reactivity";
import uniq from "lodash/uniq";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";

export default function useSources(corpusId) {
  const corpusStore = useCorpusStore();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

  const sources = computed(() => corpusStore.corpora[corpusId]?.sources || []);

  async function loadSources(corpusId_ = corpusId) {
    const sourcesFetched = await mink.loadSources(corpusId_).catch(alertError);
    corpusStore.corpora[corpusId_].sources = sourcesFetched;
  }

  async function downloadSource(source) {
    return mink.downloadSource(corpusId, source.name).catch(alertError);
  }

  async function downloadPlaintext(source) {
    return mink.downloadPlaintext(corpusId, source.name).catch(alertError);
  }

  async function uploadSources(files, corpusId_ = corpusId) {
    await mink.uploadSources(corpusId_, files);
    loadSources(corpusId_);
  }

  async function deleteSource(source) {
    await mink.deleteSource(corpusId, source.name).catch(alertError);
    loadSources();
  }

  /** Find file extensions present in source files. Undefined if no files. */
  const extensions = computed(() =>
    uniq(
      corpusStore.corpora[corpusId]?.sources?.map((source) =>
        source.name.split(".").pop()
      )
    )
  );

  return {
    sources,
    loadSources,
    downloadSource,
    downloadPlaintext,
    uploadSources,
    deleteSource,
    extensions,
  };
}
