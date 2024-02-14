import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import useResources from "@/library/resources.composable";
import useMessenger from "@/message/messenger.composable";

/** Tracks fully loaded resources, so subsequent load calls can be skipped. */
const isFresh: Record<string, true> = {};

export default function useMetadata(resourceId: string) {
  const mink = useMinkBackend();
  const resourceStore = useResourceStore();
  const { loadResources } = useResources();
  const { alertError } = useMessenger();

  /** Load data about a metadata and store it. */
  async function loadMetadata(): Promise<void> {
    // Make sure the resource has an entry in the store.
    await loadResources();

    // Skip if already loaded.
    if (isFresh[resourceId]) return;

    // Load remaining essential info, unless removed.
    if (resourceId in resourceStore.metadatas) {
      await loadYaml();
    }

    // Remember to skip loading next time.
    isFresh[resourceId] = true;
  }

  /** Load and store the metadata yaml string. */
  async function loadYaml(): Promise<string | undefined> {
    const yaml = await mink
      .downloadMetadata(resourceId)
      // 404 means no metadata yaml which is fine, rethrow other errors.
      .catch((error) => {
        if (error.response?.status == 404) return undefined;
        throw error;
      })
      .catch(alertError);
    resourceStore.metadatas[resourceId].metadata = yaml;
    return yaml;
  }

  async function uploadYaml(yaml: string): Promise<void> {
    await mink.uploadMetadata(resourceId, yaml).catch(alertError);
    resourceStore.metadatas[resourceId].metadata = yaml;
  }

  return {
    loadMetadata,
    loadYaml,
    uploadYaml,
  };
}
