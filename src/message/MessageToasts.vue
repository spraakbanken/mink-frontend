<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import useMessenger from "./messenger.composable";

const { alerts, dismiss, clear } = useMessenger();
const route = useRoute();

watch(
  () => route.path,
  () => clear()
);
</script>

<template>
  <aside class="container max-w-3xl my-4 sticky top-2 z-50">
    <div
      v-for="{ key, message, status } in alerts"
      :key="message"
      class="opacity-80 rounded-lg my-2 text-white p-2 px-4 shadow-lg flex"
      :class="status == 'error' ? ['bg-red-500'] : ['bg-gray-400']"
    >
      <div class="flex-1">
        {{ message }}
      </div>
      <icon
        icon="xmark"
        class="ml-2 p-1 cursor-pointer"
        @click="dismiss(key)"
      />
    </div>
  </aside>
</template>
