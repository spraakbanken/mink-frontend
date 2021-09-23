<template>
  <h2>Ny analys</h2>
  <div>Korpus: {{ corpusId }}</div>
  <div>
    <label for="format">Format:</label>
    <select id="format" v-model="format">
      <option>txt</option>
      <option>xml</option>
    </select>
  </div>
  <div>
    <input type="submit" @click="submit" value="Starta" />
  </div>
  <Spinner v-if="isSpinning" />
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { queueJob } from "@/assets/api";
import useSpin from "@/composables/spin";

const route = useRoute();
const router = useRouter();
const { spin, isSpinning, Spinner } = useSpin();

const corpusId = computed(() => route.params.corpusId);
const format = ref("txt");

async function submit() {
  await spin(queueJob(corpusId.value, { format: format.value }));
  router.push(`/corpus/${corpusId.value}`);
}
</script>

<style>
</style>
