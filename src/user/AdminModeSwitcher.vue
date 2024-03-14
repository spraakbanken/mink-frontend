<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import useAdmin from "./admin.composable";
import PendingContent from "@/spin/PendingContent.vue";

const { enableAdminMode, disableAdminMode, adminMode } = useAdmin();

const localValue = ref<boolean>();

watchEffect(() => (localValue.value = adminMode.value));

watch(localValue, (value) => (value ? enableAdminMode() : disableAdminMode()));
</script>

<template>
  <PendingContent on="admin-mode" blocking>
    <input
      id="admin-mode"
      v-model="localValue"
      type="checkbox"
      :disabled="localValue === undefined"
    />
    <label for="admin-mode" class="ml-2">
      {{ $t("user.settings.admin_mode") }}
    </label>
  </PendingContent>
</template>
