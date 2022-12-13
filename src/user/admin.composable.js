import { computed } from "vue";
import useMinkBackend from "@/api/backend.composable";
import { useJwt } from "@/auth/jwt.composable";
import useCorpora from "@/corpora/corpora.composable";
import { useStore } from "vuex";

export default function useAdmin() {
  const { payload } = useJwt();
  const { loadCorpora } = useCorpora();
  const mink = useMinkBackend();
  const store = useStore();

  async function enableAdminMode() {
    await mink.enableAdminMode();
    store.commit("setAdminMode", true);
    await loadCorpora(true);
  }

  async function disableAdminMode() {
    await mink.disableAdminMode();
    store.commit("setAdminMode", false);
    await loadCorpora(true);
  }

  const adminMode = computed(() => store.state.adminMode);

  const isAdmin = computed(
    () =>
      payload.value?.scope?.other?.["mink-admin"] >=
      payload.value?.levels?.ADMIN
  );

  return {
    enableAdminMode,
    disableAdminMode,
    adminMode,
    isAdmin,
  };
}
