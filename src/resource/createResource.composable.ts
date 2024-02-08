import { useAuth } from "@/auth/auth.composable";
import { useResourceStore } from "@/store/resource.store";

export default function useCreateResource() {
  const { refreshJwt } = useAuth();
  const resourceStore = useResourceStore();

  async function addNewResource(resourceId: string) {
    // Have the new corpus included in further API calls.
    await refreshJwt();

    // Adding the new id to store may trigger API calls, so do it after updating the JWT.
    resourceStore.resources[resourceId] =
      resourceStore.resources[resourceId] || {};

    return resourceId;
  }

  return {
    addNewResource,
  };
}
