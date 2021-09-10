<template>
  <h1>Hej {{ name }}</h1>
</template>

<script setup>
import store from "@/store";
import { computed } from "@vue/reactivity";

const name = computed(() => store.state.auth?.username);
</script>

<style>
</style>
