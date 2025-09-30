import { readonly, ref } from "vue";
import api from "@/api/api";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";
import useSpin from "@/spin/spin.composable";

const adminModeRef = ref<boolean>();

export default function useAdmin() {
  const { invalidateResources } = useResourceStore();
  const { alertError } = useMessenger();
  const { spin } = useSpin();

  async function checkAdminMode() {
    if (adminModeRef.value == undefined) {
      try {
        const value = await spin(api.adminModeStatus(), "admin-mode");
        adminModeRef.value = value || false;
      } catch (error) {
        alertError(error);
      }
    }
    return adminModeRef.value;
  }

  async function enableAdminMode() {
    try {
      await spin(api.adminModeOn(), "admin-mode");
      adminModeRef.value = true;
    } catch (error) {
      alertError(error);
    }
    await invalidateResources();
  }

  async function disableAdminMode() {
    try {
      await spin(api.adminModeOff(), "admin-mode");
      adminModeRef.value = false;
    } catch (error) {
      alertError(error);
    }
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
