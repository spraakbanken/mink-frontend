<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import useMessenger from "@/message/messenger.composable";

const { alerts, dismiss, clear } = useMessenger();
const route = useRoute();

watch(
  () => route.path,
  () => clear(),
);
</script>

<template>
  <aside class="container max-w-3xl my-4 sticky top-2 z-50">
    <div
      v-for="{ key, message, level } in alerts"
      :key="message"
      class="opacity-80 rounded-lg my-2 text-white p-2 shadow-lg flex items-start"
      :class="level == 'error' ? ['bg-red-500'] : ['bg-gray-400']"
    >
      <div class="flex-1 px-2">
        {{ message }}
      </div>
      <div
        class="p-1 cursor-pointer rounded bg-white bg-opacity-40 hover:bg-opacity-50 transition-all"
        @click="dismiss(key)"
      >
        <icon icon="xmark" class="block aspect-square" />
      </div>
    </div>
  </aside>
</template>
