<script setup lang="ts">
import { PhWarning } from "@phosphor-icons/vue";
import { whenever } from "@vueuse/core";
import useAdmin from "@/user/admin.composable";
import { useAuth } from "@/auth/auth.composable";
import ActionButton from "@/components/ActionButton.vue";

const { canUserAdmin } = useAuth();
const { adminMode, checkAdminMode, disableAdminMode } = useAdmin();

whenever(canUserAdmin, checkAdminMode);
</script>

<template>
  <div
    v-if="adminMode"
    class="bg-amber-300 shadow-sm shadow-amber-600 text-amber-900 p-2 px-4"
  >
    <div class="container py-1 flex flex-wrap items-center gap-2">
      <PhWarning />
      {{ $t("user.admin_mode.warning") }}
      <ActionButton class="button-slim text-sm" @click="disableAdminMode()">
        {{ $t("disable") }}
      </ActionButton>
      {{ $t("admin.goto") }}:
      <router-link to="/admin/resources" class="text-inherit">
        {{ $t("resources") }}
      </router-link>
    </div>
  </div>
</template>
