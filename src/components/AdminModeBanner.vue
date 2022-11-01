<script setup>
import useAdmin from "@/composables/admin";
import { useI18n } from "vue-i18n";
import ActionButton from "./layout/ActionButton.vue";

const { t } = useI18n();
const { adminMode } = useAdmin();

function disable() {
  adminMode.value = false;
}
</script>

<template>
  <div
    v-if="adminMode"
    class="bg-amber-300 shadow shadow-amber-600 text-amber-900"
  >
    <div class="container py-1">
      <icon icon="triangle-exclamation" class="mr-2" />
      {{ t("user.admin_mode.warning") }}
      <ActionButton class="ml-2 slim text-sm" @click="disable">
        {{ t("disable") }}
      </ActionButton>
    </div>
  </div>
</template>
