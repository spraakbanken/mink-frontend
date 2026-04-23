import { useRouter } from "vue-router";
import api from "@/api/api";
import { useAuth } from "@/auth/auth.composable";
import useDeleteResource from "@/resource/deleteResource.composable";
import type { ResourceType } from "@/api/api.types";
import useSpin from "@/spin/spin.composable";

export default function useCreateResource() {
  const { refreshAuth } = useAuth();
  const { deleteResource } = useDeleteResource();
  const router = useRouter();
  const { spin } = useSpin();

  async function createResource(
    type: ResourceType,
    createConfig: (id: string) => string,
    sources: File[] = [],
  ) {
    async function inner() {
      const id = await api.createResource(type);
      // Have the new resource included in further API calls.
      await refreshAuth();

      const config = createConfig(id);
      const uploads = [api.uploadConfig(type, id, config)];

      if (sources.length) uploads.push(api.uploadSources(type, id, sources));

      // Wait for sources and config to be uploaded in parallel.
      try {
        await Promise.all(uploads);
      } catch (error) {
        // If something fails, delete the resource draft and abort.
        await deleteResource(type, id);
        throw error;
      }

      // Visit new resource when successfully created.
      router.push(`/library/${type}/${id}`);

      return id;
    }

    return spin(inner(), "create");
  }

  return {
    createResource,
  };
}
