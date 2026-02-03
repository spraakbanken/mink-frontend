import type { ResourceType } from "@/api/api.types";
import { useAuth } from "@/auth/auth.composable";
import { useResourceStore } from "@/store/resource.store";

export default function useCreateResource() {
  const { refreshAuth } = useAuth();
  const resourceStore = useResourceStore();

  /**
   * Register a newly created resource.
   * @param type The type is necessary for the store's filter getters to include the new object.
   * @param resourceId The resource id.
   */
  async function addNewResource(type: ResourceType, resourceId: string) {
    // Have the new corpus included in further API calls.
    await refreshAuth();

    // Adding the new id to store may trigger API calls, so do it after updating the JWT.
    if (!(resourceId in resourceStore.resources)) {
      resourceStore.resources[resourceId] = { type };
    }
  }

  return {
    addNewResource,
  };
}
