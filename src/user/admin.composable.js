import { readonly, ref } from "vue";
import useMinkBackend from "@/api/backend.composable";
import { useAuth } from "@/auth/auth.composable";
import useCorpora from "@/corpora/corpora.composable";
import useMessenger from "@/message/messenger.composable";

const adminModeRef = ref(false);

export default function useAdmin() {
  const { canUserAdmin } = useAuth();
  const { refreshCorpora } = useCorpora();
  const mink = useMinkBackend();
  const { alertError } = useMessenger();

  async function checkAdminMode() {
    adminModeRef.value = await mink.checkAdminMode().catch(alertError);
  }

  async function enableAdminMode() {
    await mink.enableAdminMode().catch(alertError);
    adminModeRef.value = true;
    await refreshCorpora();
  }

  async function disableAdminMode() {
    await mink.disableAdminMode().catch(alertError);
    adminModeRef.value = false;
    await refreshCorpora();
  }

  return {
    checkAdminMode,
    enableAdminMode,
    disableAdminMode,
    adminMode: readonly(adminModeRef),
    isAdmin: canUserAdmin,
  };
}
