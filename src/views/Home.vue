<template>
  <h1>Hej {{ user }}</h1>
</template>

<script setup>
import store from "@/store";
import { computed } from "@vue/reactivity";

const user = computed(() => store.state.user);
</script>

<style>
</style>
