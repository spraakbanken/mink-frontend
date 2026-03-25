import api from "@/api/api";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import type { Metadata } from "@/store/resource.types";

/** Tracks fully loaded resources, so subsequent load calls can be skipped. */
const isFresh: Record<string, true> = {};

export default function useMetadata(id: string) {
  const resourceStore = useResourceStore();
  const { spin } = useSpin();

  /** Load data about a metadata and store it. */
  async function loadMetadata(): Promise<Metadata | undefined> {
    // Make sure the resource has an entry in the store.
    const resource = (await resourceStore.loadResource(id)) as Metadata;

    // Skip if already loaded.
    if (!isFresh[id]) {
      // Load remaining essential info, unless removed.
      if (id in resourceStore.metadatas) {
        await loadYaml();
      }
    }

    // Remember to skip loading next time.
    isFresh[id] = true;

    return resource;
  }

  /** Load and store the metadata yaml string. */
  async function loadYaml(): Promise<string | undefined> {
    const yaml = await spin(
      api.downloadMetaataYaml(id),
      `resource/${id}/metadata`,
    );
    resourceStore.metadatas[id]!.metadata = yaml;
    return yaml;
  }

  async function uploadYaml(yaml: string): Promise<void> {
    await spin(api.uploadMetadataYaml(id, yaml), `resource/${id}/metadata`);
    resourceStore.metadatas[id]!.metadata = yaml;
  }

  return {
    loadMetadata,
    loadYaml,
    uploadYaml,
  };
}
