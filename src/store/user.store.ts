import { whenever } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { readonly, ref, watchEffect } from "vue";
import { useJwtStore } from "./jwt.store";
import { useResourceStore } from "./resource.store";
import api from "@/api/api";
import useSpin from "@/spin/spin.composable";
import type { UserInfoFull } from "@/api/api.types";

export const useUserStore = defineStore("user", () => {
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

  return {
    userInfo: readonly(userInfo),
    adminMode: readonly(adminMode),
    enableAdminMode,
    disableAdminMode,
  };
});
