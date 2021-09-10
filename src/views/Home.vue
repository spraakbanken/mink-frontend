<template>
  <h1>Hej {{ name }}</h1>
</template>

<script setup>
import store from "@/store";
import { computed } from "@vue/reactivity";
import { listCorpora } from "@/assets/api";

const name = computed(() => store.state.auth?.username);
listCorpora().then((response) => console.log(response.data));
</script>

<style>
</style>
