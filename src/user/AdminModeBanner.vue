<script setup lang="ts">
import { useAuth } from "@/auth/auth.composable";
import ActionButton from "@/components/ActionButton.vue";
import useAdmin from "./admin.composable";

const { refreshJwt } = useAuth();
const { adminMode, isAdmin, checkAdminMode, disableAdminMode } = useAdmin();

(async () => {
  await refreshJwt();
  if (isAdmin.value) checkAdminMode();
})();

function disable() {
  disableAdminMode();
}
</script>

<template>
  <div
    v-if="adminMode"
    class="bg-amber-300 shadow shadow-amber-600 text-amber-900 p-2 px-4 mb-4"
  >
    <div class="container py-1">
      <icon icon="triangle-exclamation" class="mr-2" />
      {{ $t("user.admin_mode.warning") }}
      <ActionButton class="ml-2 button-slim text-sm" @click="disable">
        {{ $t("disable") }}
      </ActionButton>
    </div>
  </div>
</template>
