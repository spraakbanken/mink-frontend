import { useAuth } from "@/auth/auth.composable";
import useMinkBackend from "@/api/backend.composable";
import useMessenger from "@/message/messenger.composable";
import useResources from "@/library/resources.composable";
import useSpin from "@/spin/spin.composable";

export default function useDeleteMetadata() {
  const { refreshJwt } = useAuth();
  const mink = useMinkBackend();
  const { spin } = useSpin();
  const { refreshResources } = useResources();
  const { alertError } = useMessenger();

  async function doDeleteMetadata(resourceId: string): Promise<void> {
    // Delete resource in the backend.
    await mink.deleteMetadata(resourceId).catch(alertError);
    // The backend will have updated the remote JWT, so refresh our copy.
    // The backend uses the resource list within it when listing available resources.
    await refreshJwt();
    await refreshResources();
  }

  /**
   * Delete a metadata resource in the backend and refresh resources.
   */
  async function deleteMetadata(resourceId: string) {
    // Wrap deletion as well as refreshing in spin, for visual feedback.
    return spin(doDeleteMetadata(resourceId), `resource/${resourceId}`);
  }

  return { deleteMetadata };
}
