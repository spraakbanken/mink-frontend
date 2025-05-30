import { readonly, ref } from "vue";
import useMinkBackend from "@/api/backend.composable";
import { useResourceStore } from "@/store/resource.store";
import useMessenger from "@/message/messenger.composable";

const adminModeRef = ref<boolean>();

export default function useAdmin() {
  const { invalidateResources } = useResourceStore();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

  async function checkAdminMode() {
    const value = await mink.checkAdminMode().catch(alertError);
    adminModeRef.value = value || false;
  }

  async function enableAdminMode() {
    await mink.enableAdminMode().catch(alertError);
    adminModeRef.value = true;
    await invalidateResources();
  }

  async function disableAdminMode() {
    await mink.disableAdminMode().catch(alertError);
    adminModeRef.value = false;
    await invalidateResources();
  }

  return {
    checkAdminMode,
    enableAdminMode,
    disableAdminMode,
    adminMode: readonly(adminModeRef),
  };
}
