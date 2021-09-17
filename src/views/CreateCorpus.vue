<template>
  <h2>Ny korpus</h2>
  <div>
    <div class="label">Namn</div>
    <div><input v-model="name" /></div>
  </div>
  <div><input type="submit" @click="submit" :disabled="!name" /></div>
  <div>{{ message }}</div>
  <Spinner v-if="isSpinning" />
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { createCorpus } from "@/assets/api";
import useSpin from "@/composables/spin";
import { useRouter } from "vue-router";

const router = useRouter();
const { spin, isSpinning, Spinner } = useSpin();

const name = ref("");
const message = ref(null);

async function submit() {
  spin(createCorpus(name.value))
    .catch((reason) => (message.value = reason.response.data.message))
    .then(() => router.push(`/corpus/${name.value}`));
}
</script>
