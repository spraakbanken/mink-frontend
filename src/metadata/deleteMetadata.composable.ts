import { useAuth } from "@/auth/auth.composable";
import useMessenger from "@/message/messenger.composable";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import api from "@/api/api";

export default function useDeleteMetadata() {
  const { refreshAuth } = useAuth();
  const { spin } = useSpin();
  const { loadResourceIds } = useResourceStore();
  const { alertError } = useMessenger();

  async function doDeleteMetadata(resourceId: string): Promise<void> {
    // Delete resource in the backend.
    await api.removeMetadata(resourceId);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the resource list within it when listing available resources.
    await refreshAuth();
    await loadResourceIds();
  }

  /**
   * Delete a metadata resource in the backend and refresh resources.
   */
  async function deleteMetadata(resourceId: string) {
    // Wrap deletion as well as refreshing in spin, for visual feedback.
    return spin(
      doDeleteMetadata(resourceId).catch(alertError),
      `resource/${resourceId}`,
    );
  }

  return { deleteMetadata };
}
