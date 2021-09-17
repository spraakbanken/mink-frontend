<template>
  <h1>Hej {{ name }}</h1>
  <div v-if="corpora.length">
    <h2>Mina korpusar</h2>
    <div v-for="corpusId in corpora" :key="corpusId">
      <router-link :to="`/corpus/${corpusId}`">{{ corpusId }}</router-link>
    </div>
    <Spinner v-if="isSpinning" />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
import { listCorpora } from "@/assets/api";
import useSpin from "@/composables/spin";

const store = useStore();
const { spin, isSpinning, Spinner } = useSpin();

const name = computed(() => store.state.auth?.username);
const corpora = computed(() => store.state.corpora);

spin(listCorpora()).then((corporaFetched) =>
  store.commit("setCorpora", corporaFetched)
);
</script>

<style>
</style>
