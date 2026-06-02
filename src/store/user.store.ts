import { whenever } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { readonly, ref, watchEffect } from "vue";
import { useJwtStore } from "./jwt.store";
import { useResourceStore } from "./resource.store";
import type { User } from "./resource.types";
import { useApi } from "@/api/useApi";
import useSpin from "@/spin/spin.composable";
import type { ResourceType, UserInfoFull } from "@/api/api.types";
import {
  getAccess,
  hasAccessLevel,
  type ResourceType as AuthResourceType,
} from "@/api/sbauth";

const TYPE_MAP: Readonly<Record<ResourceType, AuthResourceType>> = {
  corpus: "corpora",
  lexicon: "lexica",
  metadata: "metadata",
};

export const useUserStore = defineStore("user", () => {
  const api = useApi();
  const { payload } = storeToRefs(useJwtStore());
  const { invalidateResources } = useResourceStore();
  const { spin } = useSpin();

  const userInfo = ref<UserInfoFull>();
  const adminMode = ref<boolean | undefined>();

  // Load info as soon as JWT is available
  whenever(
    () => !!payload.value,
    async () => {
      userInfo.value = await spin(api.getUserInfo(), "jwt");
    },
  );

  // Set admin mode reactively from user info
  watchEffect(() => (adminMode.value = userInfo.value?.admin_mode));

  async function enableAdminMode() {
    await spin(api.adminModeOn(), "admin-mode");
    adminMode.value = true;
    invalidateResources();
  }

  async function disableAdminMode() {
    await spin(api.adminModeOff(), "admin-mode");
    adminMode.value = false;
    invalidateResources();
  }

  /** Check if a resource user is the currently logged in user. */
  function isCurrentUser(other: User): boolean {
    if (!userInfo.value) return false;
    const { id } = userInfo.value;
    return other.id == id;
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
    userInfo: readonly(userInfo),
    adminMode: readonly(adminMode),
    enableAdminMode,
    disableAdminMode,
    isCurrentUser,
    getAccessLevel,
    canRead,
    canWrite,
    canAdmin,
  };
});
