import { useAuth } from "@/auth/auth.composable";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import api from "@/api/api";
import type { ResourceType } from "@/api/api.types";

export default function useDeleteResource() {
  const { refreshAuth } = useAuth();
  const { spin } = useSpin();
  const { loadResourceIds } = useResourceStore();

  async function doDeleteResource(
    type: ResourceType,
    id: string,
  ): Promise<void> {
    // Delete resource in the backend.
    await api.removeResource(type, id);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the resource list within it when listing available resources.
    await refreshAuth();
    // TODO This triggers `loadResource(id)` computeds in (Type)View.vue and results in 404 page
    await loadResourceIds();
  }

  /**
   * Delete a resource in the backend and refresh resources.
   */
  async function deleteResource(type: ResourceType, id: string) {
    // Wrap deletion as well as refreshing in spin, for visual feedback.
    return spin(doDeleteResource(type, id), id);
  }

  return { deleteResource };
}
