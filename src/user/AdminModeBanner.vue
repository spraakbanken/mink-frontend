<script setup>
import useAdmin from "./admin.composable";
import ActionButton from "@/components/ActionButton.vue";

const { adminMode, disableAdminMode } = useAdmin();

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
      <ActionButton class="ml-2 slim text-sm" @click="disable">
        {{ $t("disable") }}
      </ActionButton>
    </div>
  </div>
</template>
