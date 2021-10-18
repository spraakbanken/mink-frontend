<template>
  <PageTitle subtitle="Korpus">{{ corpusId }}</PageTitle>
  <CorpusRibbon />

  <Section title="Texter">
    <Sources />
  </Section>
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
import Section from "@/components/layout/Section.vue";
import CorpusRibbon from "@/components/CorpusRibbon.vue";

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
