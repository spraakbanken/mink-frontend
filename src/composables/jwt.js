import { computed } from "vue";
import { useStore } from "vuex";

export function useJwt() {
  const store = useStore();
  const jwt = computed(() => store.state.jwt);
  const payload = computed(() =>
    jwt.value ? JSON.parse(atob(jwt.value.split(".")[1])) : undefined
  );

  return {
    jwt,
    payload,
  };
}
