<script setup>
import { computed } from "vue";

const props = defineProps({ messages: { type: Array, required: true } });

const messagesFiltered = computed(() =>
  props.messages.filter(({ status }) => status !== "success")
);
</script>

<template>
  <aside>
    <div
      v-for="message in messagesFiltered"
      :key="message.message"
      class="rounded-lg my-2 bg-gray-600 text-white p-2 px-4"
    >
      {{ message }}
    </div>
  </aside>
</template>
