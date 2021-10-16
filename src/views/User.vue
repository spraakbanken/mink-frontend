<template>
  <PageTitle>{{ name }}</PageTitle>
  <div class="my-4">
    <ActionButton @click="logout">Logga ut</ActionButton>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

const store = useStore();

const name = computed(() => store.state.auth?.username);
</script>

<style></style>
