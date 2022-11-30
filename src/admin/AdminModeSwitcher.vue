<template>
  <PendingContent on="admin-mode">
    <input id="admin-mode" v-model="localValue" type="checkbox" />
    <label for="admin-mode" class="ml-2">
      {{ t("user.settings.admin_mode") }}
    </label>
  </PendingContent>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import useAdmin from "./admin.composable";
import PendingContent from "@/spin/PendingContent.vue";

const { t } = useI18n();
const { enableAdminMode, disableAdminMode, adminMode } = useAdmin();

const localValue = ref(false);

watchEffect(() => (localValue.value = adminMode.value));

watch(localValue, (value) => (value ? enableAdminMode() : disableAdminMode()));
</script>
