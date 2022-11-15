<script setup>
defineProps({ messages: { type: Array, required: true } });
</script>

<template>
  <aside class="container max-w-3xl my-4 sticky top-2 z-50">
    <div
      v-for="{ message, status } in messages"
      :key="message"
      class="opacity-80 rounded-lg my-2 text-white p-2 px-4 shadow-lg"
      :class="status == 'error' ? ['bg-red-500'] : ['bg-gray-400']"
    >
      {{ message }}
    </div>
  </aside>
</template>
