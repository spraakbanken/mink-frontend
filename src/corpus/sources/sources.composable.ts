import { computed } from "vue";
import uniq from "lodash/uniq";
import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";
import { getFilenameExtension } from "@/util";
import type { FileMeta, ProgressHandler } from "@/api/api.types";

export default function useSources(corpusId: string) {
  const resourceStore = useResourceStore();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

  const sources = computed(
    () => resourceStore.corpora[corpusId]?.sources || [],
  );

  async function loadSources() {
    const info = await mink.resourceInfoOne(corpusId).catch(alertError);
    if (!info) return;
    resourceStore.corpora[corpusId].sources = info.resource.source_files;
  }

  async function downloadSource(source: FileMeta, binary: boolean) {
    return mink.downloadSource(corpusId, source.name, binary).catch(alertError);
  }

  async function downloadPlaintext(source: FileMeta) {
    return mink.downloadPlaintext(corpusId, source.name).catch(alertError);
  }

  async function uploadSources(files: FileList, onProgress?: ProgressHandler) {
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
      resourceStore.corpora[corpusId]?.sources?.map((source) =>
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
