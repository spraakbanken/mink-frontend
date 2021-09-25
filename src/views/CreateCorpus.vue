<template>
  <h2>Ny korpus</h2>
  <div>
    <div class="label">Namn</div>
    <div><input v-model="name" /></div>
  </div>
  <div><input type="submit" @click="submit" :disabled="!name" /></div>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { createCorpus } from "@/assets/api";
import { useRouter } from "vue-router";
import { spin } from "@/assets/spin";

const router = useRouter();

const name = ref("");
const message = ref(null);

async function submit() {
  spin(createCorpus(name.value), "Skapar korpus")
    .catch((reason) => (message.value = reason.response.data.message))
    .then(() => router.push(`/corpus/${name.value}`));
}
</script>
