<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { PhX } from "@phosphor-icons/vue";
import useAlert from "@/alert/alert.composable";

const { alerts, dismiss, clear } = useAlert();
const route = useRoute();

// Remove messages when navigating to a new page
watch(
  () => route.path,
  () => clear(),
);
</script>

<template>
  <aside
    v-if="alerts.length"
    class="container max-w-3xl my-4 sticky top-2 z-50"
  >
    <div
      v-for="{ key, message } in alerts"
      :key="message"
      class="opacity-80 rounded-lg my-2 bg-red-500 text-white p-2 shadow-lg flex items-start"
    >
      <div class="flex-1 px-2">
        {{ message }}
      </div>
      <div
        class="p-1 cursor-pointer rounded-sm bg-white/20 hover:bg-white/50 transition-all"
        @click="dismiss(key)"
      >
        <PhX weight="bold" />
      </div>
    </div>
  </aside>
</template>
