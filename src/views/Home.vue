<template>
  <h1>Min språkbank</h1>
  {{ user }}
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const user = computed(() => store.state.user);
</script>

<style>
</style>
