import api from "@/api/api";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";
import useSpin from "@/spin/spin.composable";

/** Tracks fully loaded resources, so subsequent load calls can be skipped. */
const isFresh: Record<string, true> = {};

export default function useMetadata(resourceId: string) {
  const resourceStore = useResourceStore();
  const { alertError } = useMessenger();
  const { spin } = useSpin();

  /** Load data about a metadata and store it. */
  async function loadMetadata(): Promise<void> {
    // Make sure the resource has an entry in the store.
    await resourceStore.loadResource(resourceId);

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
    try {
      const yaml = await spin(
        api.downloadMetaataYaml(resourceId),
        `resource/${resourceId}/metadata`,
      );
      resourceStore.metadatas[resourceId]!.metadata = yaml;
      return yaml;
    } catch (error) {
      alertError(error);
    }
  }

  async function uploadYaml(yaml: string): Promise<void> {
    await spin(
      api.uploadMetadataYaml(resourceId, yaml).catch(alertError),
      `resource/${resourceId}/metadata`,
    );
    resourceStore.metadatas[resourceId]!.metadata = yaml;
  }

  return {
    loadMetadata,
    loadYaml,
    uploadYaml,
  };
}
