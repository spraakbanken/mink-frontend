<template>
  <h1>Ny analys</h1>
  <Breadcrumbs :links="[{ route: `/corpus/${corpusId}`, label: corpusId }]" />
  <div>Korpus: {{ corpusId }}</div>
  <div>
    <label for="format">Format:</label>
    <select id="format" v-model="format">
      <option>txt</option>
      <option>xml</option>
    </select>
  </div>
  <div>
    <ActionButton @click="submit" class="bg-green-200 border-green-300"
      >Starta</ActionButton
    >
  </div>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { queueJob } from "@/assets/api";
import { spin } from "@/assets/spin";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const store = useStore();

const corpusId = computed(() => route.params.corpusId);
const format = ref("txt");

async function submit() {
  store.commit("setStatus", { corpusId: corpusId.value, status: null });
  await spin(
    queueJob(corpusId.value, { format: format.value }),
    "Lägger analys i kö"
  );
  router.push(`/corpus/${corpusId.value}`);
}
</script>

<style>
</style>
