<script setup lang="ts">
import { PhWarning } from "@phosphor-icons/vue";
import useAdmin from "@/user/admin.composable";
import { useAuth } from "@/auth/auth.composable";
import ActionButton from "@/components/ActionButton.vue";

const { refreshJwt, canUserAdmin } = useAuth();
const { adminMode, checkAdminMode, disableAdminMode } = useAdmin();

(async () => {
  await refreshJwt();
  if (canUserAdmin.value) checkAdminMode();
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
    <div class="container py-1 flex flex-wrap items-center gap-2">
      <PhWarning />
      {{ $t("user.admin_mode.warning") }}
      <ActionButton class="button-slim text-sm" @click="disable">
        {{ $t("disable") }}
      </ActionButton>
      {{ $t("admin.goto") }}:
      <router-link to="/admin/resources" class="text-inherit">
        {{ $t("resources") }}
      </router-link>
    </div>
  </div>
</template>
