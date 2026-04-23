<script setup lang="ts">
import useAdmin from "@/user/admin.composable";
import PendingContent from "@/spin/PendingContent.vue";
import useAlert from "@/alert/alert.composable";

const { enableAdminMode, disableAdminMode, adminMode } = useAdmin();
const { showAlert } = useAlert();

const toggle = () =>
  (adminMode.value ? disableAdminMode : enableAdminMode)().catch(showAlert);
</script>

<template>
  <PendingContent on="admin-mode" blocking>
    <input
      id="admin-mode"
      type="checkbox"
      :checked="adminMode"
      :disabled="adminMode === undefined"
      @change="toggle()"
    />
    <label for="admin-mode" class="ml-2">
      {{ $t("user.settings.admin_mode") }}
    </label>
  </PendingContent>
</template>
