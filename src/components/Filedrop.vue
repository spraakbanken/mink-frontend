<template>
  <div @drop.prevent="drop" @dragover.prevent>
    <slot />
  </div>
</template>

<script setup>
const emit = defineEmits(["drop"]);

function drop(event) {
  emit("drop", event.dataTransfer.files);
}
</script>

<style></style>
