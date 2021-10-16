<template>
  <PageTitle subtitle="Korpus">{{ corpusId }}</PageTitle>
  <CorpusRibbon />
  <Section title="Konfiguration">
    <table class="my-4">
      <thead></thead>
      <tbody>
        <tr>
          <th class="text-right">
            <label for="format">Format:</label>
          </th>
          <td>
            <select id="format" v-model="format">
              <option>txt</option>
              <option>xml</option>
            </select>
          </td>
        </tr>
        <tr>
          <th />
          <td class="py-4">
            <ActionButton
              @click="save"
              class="mr-2 bg-blue-100 border-blue-200"
            >
              Spara konfiguration
            </ActionButton>
            <ActionButton @click="run" class="bg-green-200 border-green-300">
              Starta analys
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { putConfig, queueJob } from "@/assets/api";
import { spin } from "@/assets/spin";
import ActionButton from "@/components/layout/ActionButton.vue";
import { useStore } from "vuex";
import PageTitle from "@/components/PageTitle.vue";
import CorpusRibbon from "@/components/CorpusRibbon.vue";
import Section from "@/components/layout/Section.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();

const corpusId = computed(() => route.params.corpusId);
const format = ref("txt");

async function save() {
  await spin(
    putConfig(corpusId.value, { format: format.value }),
    "Sparar konfiguration"
  );
  router.push(`/corpus/${corpusId.value}`);
}

async function run() {
  store.commit("setStatus", { corpusId: corpusId.value, status: null });
  await spin(
    putConfig(corpusId.value, { format: format.value }),
    "Sparar konfiguration"
  );
  await spin(queueJob(corpusId.value), "Lägger analys i kö");
  router.push(`/corpus/${corpusId.value}`);
}
</script>

<style></style>
