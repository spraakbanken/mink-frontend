import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useJwtStore } from "@/store/jwt.store";
import type { User } from "@/store/resource.types";
import {
  getAccess,
  hasAccessLevel,
  type ResourceType as AuthResourceType,
} from "@/api/sbauth";
import type { ResourceType } from "@/api/api.types";
import useAdmin from "@/user/admin.composable";

const TYPE_MAP: Readonly<Record<ResourceType, AuthResourceType>> = {
  corpus: "corpora",
  lexicon: "lexica",
  metadata: "metadata",
};

export function useAuth() {
  const jwtStore = useJwtStore();
  const { payload } = storeToRefs(jwtStore);
  const { loadJwt, unloadJwt } = jwtStore;

  const { adminMode } = useAdmin();
  const isAuthenticated = computed<boolean>(() => !!payload.value);
  const canUserAdmin = computed<boolean>(() =>
    hasAccessLevel(payload.value, "other", "mink-app", "ADMIN"),
  );
  const canUserWrite = computed(() => isAuthenticated.value);
  const userName = computed(() => payload.value?.name || payload.value?.email);

  /** Force reload JWT */
  async function refreshAuth() {
    unloadJwt();
    await loadJwt();
  }

  /** Check if a resource user is the currently logged in user. */
  function isCurrentUser(other: User): boolean {
    if (!payload.value) return false;
    const { idp, sub } = payload.value;
    // Build a user ID the same way as backend.
    const userId = `${idp}-${sub}`.replace(/[^\w\-_\.]/g, "");
    return other.id == userId;
  }

  /** Get current user's access level to a resource */
  const getAccessLevel = (type: ResourceType, id: string) =>
    getAccess(payload.value, TYPE_MAP[type], id);

  /** Check if current user has at least READ access to a resource */
  const canRead = (type: ResourceType, id: string): boolean =>
    adminMode.value ||
    hasAccessLevel(payload.value, TYPE_MAP[type], id, "READ");

  /** Check if current user has at least WRITE access to a resource */
  const canWrite = (type: ResourceType, id: string): boolean =>
    adminMode.value ||
    hasAccessLevel(payload.value, TYPE_MAP[type], id, "WRITE");

  /** Check if current user has ADMIN access to a resource */
  const canAdmin = (type: ResourceType, id: string): boolean =>
    adminMode.value ||
    hasAccessLevel(payload.value, TYPE_MAP[type], id, "ADMIN");

  return {
    isAuthenticated,
    canUserAdmin,
    canUserWrite,
    userName,
    refreshAuth,
    isCurrentUser,
    getAccessLevel,
    canRead,
    canWrite,
    canAdmin,
  };
}
