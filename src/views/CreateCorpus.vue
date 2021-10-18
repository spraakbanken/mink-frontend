<template>
  <Breadcrumbs />
  <PageTitle>Ny korpus</PageTitle>
  <Section>
    <label for="name">Namn:</label>
    <input id="name" v-model="name" class="border" />
  </Section>
  <div ref="refSubmit">
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
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Section from "@/components/layout/Section.vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const name = ref("");
const message = ref(null);
const refSubmit = ref(null);

async function submit() {
  spin(createCorpus(name.value), "Skapar korpus", refSubmit.value)
    .catch((reason) => (message.value = reason.response.data.message))
    .then(() => {
      store.commit("addCorpus", name.value);
      router.push(`/corpus/${name.value}`);
    });
}
</script>
