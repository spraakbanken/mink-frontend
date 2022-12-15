import { computed, readonly, ref } from "vue";
import useMinkBackend from "@/api/backend.composable";
import { useAuth } from "@/auth/auth.composable";
import useCorpora from "@/corpora/corpora.composable";

const adminModeRef = ref(false);

export default function useAdmin() {
  const { payload } = useAuth();
  const { loadCorpora } = useCorpora();
  const mink = useMinkBackend();

  async function enableAdminMode() {
    await mink.enableAdminMode();
    adminModeRef.value = true;
    await loadCorpora(true);
  }

  async function disableAdminMode() {
    await mink.disableAdminMode();
    adminModeRef.value = false;
    await loadCorpora(true);
  }

  const isAdmin = computed(
    () =>
      payload.value?.scope?.other?.["mink-admin"] >=
      payload.value?.levels?.ADMIN
  );

  return {
    enableAdminMode,
    disableAdminMode,
    adminMode: readonly(adminModeRef),
    isAdmin,
  };
}
