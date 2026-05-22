<script setup lang="ts">
import { storeToRefs } from "pinia";
import PendingContent from "@/spin/PendingContent.vue";
import useAlert from "@/alert/alert.composable";
import { useUserStore } from "@/store/user.store";

const userStore = useUserStore();
const { adminMode } = storeToRefs(userStore);
const { enableAdminMode, disableAdminMode } = userStore;
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
