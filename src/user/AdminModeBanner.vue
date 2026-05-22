<script setup lang="ts">
import { PhWarning } from "@phosphor-icons/vue";
import { storeToRefs } from "pinia";
import ActionButton from "@/components/ActionButton.vue";
import useAlert from "@/alert/alert.composable";
import { useUserStore } from "@/store/user.store";

const userStore = useUserStore();
const { adminMode } = storeToRefs(userStore);
const { disableAdminMode } = userStore;
const { showAlert } = useAlert();
</script>

<template>
  <div
    v-if="adminMode"
    class="bg-amber-300 shadow-sm shadow-amber-600 text-amber-900 p-2 px-4"
  >
    <div class="container py-1 flex flex-wrap items-center gap-2">
      <PhWarning />
      {{ $t("user.admin_mode.warning") }}
      <ActionButton
        class="button-slim text-sm"
        @click="disableAdminMode().catch(showAlert)"
      >
        {{ $t("disable") }}
      </ActionButton>
      {{ $t("admin.goto") }}:
      <router-link to="/admin/resources" class="text-inherit">
        {{ $t("resources") }}
      </router-link>
    </div>
  </div>
</template>
