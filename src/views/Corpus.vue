<template>
  <Breadcrumbs />
  <PageTitle subtitle="Korpus">{{ corpusId }}</PageTitle>

  <div class="my-4 flex">
    <div class="flex-1 text-sm p-2 rounded-xl bg-gray-100">
      <h4 class="uppercase text-gray-600 text-base">Texter</h4>
      <div>6 MB</div>
      <div>20 dokument</div>
    </div>
    <div class="mx-2 text-4xl self-center">〉</div>
    <router-link
      :to="`/corpus/${corpusId}/config`"
      class="
        flex-1
        text-sm
        p-2
        border
        rounded-xl
        bg-white
        hover:bg-gray-100
        shadow-sm
        text-current
      "
    >
      <h4 class="uppercase text-gray-600 text-base">Konfiguration</h4>
      <div>Saldo, namntaggning, CONLL-output</div>
    </router-link>
    <div class="mx-2 text-4xl self-center">〉</div>
    <div class="flex-1 text-sm p-2">
      <h4 class="uppercase text-gray-600 text-base">Analys</h4>
      <div class="flex justify-center items-center">
        <ActionButton class="bg-blue-100 border-blue-200">Kör</ActionButton>
      </div>
    </div>
    <div class="mx-2 text-4xl self-center">〉</div>
    <div class="flex-1 text-sm p-2">
      <h4 class="uppercase text-gray-600 text-base">Export</h4>
    </div>
  </div>

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
import PageTitle from "@/components/PageTitle.vue";
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

<style></style>
