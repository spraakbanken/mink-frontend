<template>
  <h1>Hej {{ name }}</h1>
  <div v-if="corpora.length">
    <h2>Mina korpusar</h2>
    <div class="corpus-list">
      <router-link
        v-for="corpusId in corpora"
        :key="corpusId"
        :to="`/corpus/${corpusId}`"
        custom
        v-slot="{ navigate }"
      >
        <PadButton @click="navigate">{{ corpusId }}</PadButton>
      </router-link>
      <router-link to="/corpus" custom v-slot="{ navigate }">
        <PadButton @click="navigate" class="create">
          + Ny korpus
        </PadButton></router-link
      >
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
import { listCorpora } from "@/assets/api";
import { spin } from "@/assets/spin";
import PadButton from "@/components/layout/PadButton.vue";

const store = useStore();

const name = computed(() => store.state.auth?.username);
const corpora = computed(() => Object.keys(store.state.corpora));

spin(listCorpora(), "Hämtar korpusar").then((corporaFetched) =>
  store.commit("setCorpora", corporaFetched)
);
</script>

<style>
.corpus-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
