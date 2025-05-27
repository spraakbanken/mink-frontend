import { computed } from "vue";
import { uniq } from "es-toolkit";
import useMinkBackend from "@/api/backend.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useMessenger from "@/message/messenger.composable";
import { getFilenameExtension } from "@/util";
import type { FileMeta, ProgressHandler } from "@/api/api.types";

export default function useSources(corpusId: string) {
  const corpusStore = useCorpusStore();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

  const sources = computed(() => corpusStore.corpora[corpusId]?.sources || []);
  const hasSources = computed(() => sources.value.length > 0);

  async function loadSources() {
    const info = await mink.listSources(corpusId).catch(alertError);
    if (!info) return;
    corpusStore.corpora[corpusId].sources = info.resource.source_files;
  }

  async function downloadSource(source: FileMeta, binary: boolean) {
    return mink.downloadSource(corpusId, source.name, binary).catch(alertError);
  }

  async function downloadPlaintext(source: FileMeta) {
    return mink.downloadPlaintext(corpusId, source.name).catch(alertError);
  }

  async function uploadSources(files: File[], onProgress?: ProgressHandler) {
    await mink.uploadSources(corpusId, files, onProgress);
    loadSources();
  }

  async function deleteSource(source: FileMeta) {
    await mink.deleteSource(corpusId, source.name).catch(alertError);
    loadSources();
  }

  /** Find file extensions present in source files. Undefined if no files. */
  const extensions = computed(() =>
    uniq(
      sources.value?.map((source) => getFilenameExtension(source.name)) || [],
    ),
  );

  return {
    sources,
    hasSources,
    loadSources,
    downloadSource,
    downloadPlaintext,
    uploadSources,
    deleteSource,
    extensions,
  };
}
