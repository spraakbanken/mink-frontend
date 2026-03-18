import { readonly, ref } from "vue";
import api from "@/api/api";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";

const adminModeRef = ref<boolean>();

export default function useAdmin() {
  const { invalidateResources } = useResourceStore();
  const { spin } = useSpin();

  async function checkAdminMode() {
    if (adminModeRef.value == undefined) {
      const value = await spin(api.adminModeStatus(), "admin-mode");
      adminModeRef.value = value || false;
    }
    return adminModeRef.value;
  }

  async function enableAdminMode() {
    await spin(api.adminModeOn(), "admin-mode");
    adminModeRef.value = true;
    await invalidateResources();
  }

  async function disableAdminMode() {
    await spin(api.adminModeOff(), "admin-mode");
    adminModeRef.value = false;
    await invalidateResources();
  }

  return {
    checkAdminMode,
    enableAdminMode,
    disableAdminMode,
    /**
     * Whether admin mode is enabled.
     *
     * Initialized to `undefined`.
     * Gets set to `true` or `false` when completing any of the check/enable/disable functions.
     */
    adminMode: readonly(adminModeRef),
  };
}
