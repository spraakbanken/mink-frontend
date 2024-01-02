<template>
  <PendingContent on="admin-mode" blocking>
    <input id="admin-mode" v-model="localValue" type="checkbox" />
    <label for="admin-mode" class="ml-2">
      {{ $t("user.settings.admin_mode") }}
    </label>
  </PendingContent>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue";
import useAdmin from "./admin.composable";
import PendingContent from "@/spin/PendingContent.vue";

const { enableAdminMode, disableAdminMode, adminMode } = useAdmin();

const localValue = ref(false);

watchEffect(() => (localValue.value = adminMode.value));

watch(localValue, (value) => (value ? enableAdminMode() : disableAdminMode()));
</script>
