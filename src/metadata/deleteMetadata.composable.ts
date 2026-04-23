import { useAuth } from "@/auth/auth.composable";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import api from "@/api/api";

export default function useDeleteMetadata() {
  const { refreshAuth } = useAuth();
  const { spin } = useSpin();
  const { loadResourceIds } = useResourceStore();

  async function doDeleteMetadata(id: string): Promise<void> {
    // Delete resource in the backend.
    await api.removeResource("metadata", id);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the resource list within it when listing available resources.
    await refreshAuth();
    await loadResourceIds();
  }

  /**
   * Delete a metadata resource in the backend and refresh resources.
   */
  async function deleteMetadata(id: string) {
    // Wrap deletion as well as refreshing in spin, for visual feedback.
    return spin(doDeleteMetadata(id), `resource/${id}`);
  }

  return { deleteMetadata };
}
