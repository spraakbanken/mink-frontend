<template>
  <h1>Korpus: {{ corpusId }}</h1>
  <Breadcrumbs />
  <div class="flex flex-wrap">
    <Section title="Texter" class="lg:w-2/3 lg:pr-4">
      <Sources :corpusId="corpusId" />
    </Section>
    <Section title="Analys" class="lg:w-1/3">
      <Job :corpusId="corpusId" />
    </Section>
  </div>
  <div>
    <ActionButton @click="deleteCorpus" class="bg-red-200 border-red-300">
      Radera korpus
    </ActionButton>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { removeCorpus } from "@/assets/api";
import { computed, ref } from "@vue/reactivity";
import { spin } from "@/assets/spin";
import Sources from "@/components/Sources.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Section from "@/components/layout/Section.vue";
import Job from "@/components/Job.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();

const corpusId = computed(() => route.params.corpusId);

async function deleteCorpus() {
  await spin(removeCorpus(corpusId.value), "Raderar korpus");
  store.commit("removeCorpus", corpusId.value);
  router.push("/");
}
</script>

<style>
</style>
