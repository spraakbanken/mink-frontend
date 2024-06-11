<script setup lang="ts"></script>

<template>
  <div class="overflow-scroll h-fit max-h-60 resize-y"><slot /></div>
</template>

<style scoped>
/* Override max-height when resized. */
.resize-y[style*="height"] {
  max-height: unset;
}
</style>
