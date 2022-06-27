import useSpin from "@/assets/spin";
import { checkLogin } from "@/auth";
import { sleep } from "@/util";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

export function useJwt() {
  const store = useStore();
  const { spin } = useSpin();
  const { t } = useI18n();

  const jwt = computed(() => store.state.jwt);
  const payload = computed(() =>
    jwt.value ? JSON.parse(atob(jwt.value.split(".")[1])) : undefined
  );

  async function refreshJwtInner() {
    // Wait until the backend has updated the JWT corpus list...
    await sleep(2000);
    const jwt = await checkLogin();
    store.commit("setJwt", jwt);
    // Wait until the watcher in App.vue has configured Axios requests...
    await sleep(100);
  }
  const refreshJwt = () => spin(refreshJwtInner(), t("jwt.refreshing"), "jwt");

  return {
    jwt,
    payload,
    refreshJwt,
  };
}
