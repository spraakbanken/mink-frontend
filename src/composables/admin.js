import { api } from "@/assets/api";
import useSpin from "@/assets/spin";
import { computed, ref } from "vue";
import { useJwt } from "./jwt";

const adminModeRef = ref(false);

export default function useAdmin() {
  const { payload } = useJwt();
  const { spin } = useSpin();

  async function enableAdminMode() {
    await spin(api.adminModeOn(), "Enabling admin mode", "admin-mode");
    adminModeRef.value = true;
  }

  async function disableAdminMode() {
    await spin(api.adminModeOff(), "Disabling admin mode", "admin-mode");
    adminModeRef.value = false;
  }

  const adminMode = computed(() => adminModeRef.value);

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
