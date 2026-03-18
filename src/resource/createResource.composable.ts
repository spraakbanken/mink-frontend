import { useAuth } from "@/auth/auth.composable";
import { useResourceStore } from "@/store/resource.store";

export default function useCreateResource() {
  const { refreshAuth } = useAuth();
  const { loadResource } = useResourceStore();

  /**
   * Register a newly created resource.
   * @param type The type is necessary for the store's filter getters to include the new object.
   * @param resourceId The resource id.
   */
  async function addNewResource(resourceId: string) {
    // Have the new corpus included in further API calls.
    await refreshAuth();
    // Load new resource info
    await loadResource(resourceId);
  }

  return {
    addNewResource,
  };
}
