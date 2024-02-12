import { computed } from "@vue/reactivity";
import uniq from "lodash/uniq";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";
import { getFilenameExtension } from "@/util";
import type { FileMeta } from "@/api/api.types";

export default function useSources(corpusId: string) {
  const corpusStore = useCorpusStore();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

  const sources = computed(() => corpusStore.corpora[corpusId]?.sources || []);

  async function loadSources() {
    const info = await mink.resourceInfoOne(corpusId).catch(alertError);
    if (!info) return;
    corpusStore.corpora[corpusId].sources = info.resource.source_files;
  }

  async function downloadSource(source: FileMeta, binary: boolean) {
    return mink.downloadSource(corpusId, source.name, binary).catch(alertError);
  }

  async function downloadPlaintext(source: FileMeta) {
    return mink.downloadPlaintext(corpusId, source.name).catch(alertError);
  }

  async function uploadSources(files: FileList) {
    await mink.uploadSources(corpusId, files);
    loadSources();
  }

  async function deleteSource(source: FileMeta) {
    await mink.deleteSource(corpusId, source.name).catch(alertError);
    loadSources();
  }

  /** Find file extensions present in source files. Undefined if no files. */
  const extensions = computed(() =>
    uniq(
      corpusStore.corpora[corpusId]?.sources?.map((source) =>
        getFilenameExtension(source.name),
      ),
    ),
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
