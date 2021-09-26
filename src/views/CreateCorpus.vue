<template>
  <h1>Ny korpus</h1>
  <Breadcrumbs />
  <Section>
    <label for="name">Namn:</label>
    <input id="name" v-model="name" class="border" />
  </Section>
  <div>
    <ActionButton @click="submit" class="bg-green-200 border-green-300">
      Spara
    </ActionButton>
  </div>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { createCorpus } from "@/assets/api";
import { useRouter } from "vue-router";
import { spin } from "@/assets/spin";
import ActionButton from "@/components/layout/ActionButton.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Section from "@/components/layout/Section.vue";

const router = useRouter();

const name = ref("");
const message = ref(null);

async function submit() {
  spin(createCorpus(name.value), "Skapar korpus")
    .catch((reason) => (message.value = reason.response.data.message))
    .then(() => router.push(`/corpus/${name.value}`));
}
</script>
