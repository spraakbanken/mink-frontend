<template>
  <Section title="Analys" ref="refForm">
    <table class="w-full my-4">
      <thead></thead>
      <tbody>
        <tr>
          <th class="text-right">Meddelande:</th>
          <td>{{ jobStatus.message }}</td>
        </tr>
        <tr>
          <th class="text-right">Sparv-output:</th>
          <td>
            <pre class="text-sm">{{ jobStatus.sparv_output }}</pre>
          </td>
        </tr>
        <tr v-if="isJobRunning">
          <th />
          <td>
            <ActionButton
              v-if="hasConfig && !isJobRunning"
              class="mr-2 bg-blue-100 border-blue-200"
              @click="run"
            >
              Starta analys
            </ActionButton>

            <ActionButton @click="abort" class="bg-red-200 border-red-300">
              Avbryt analys
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import Section from "@/components/layout/Section.vue";
import useCheckStatus from "@/composables/checkStatus";
import { onMounted } from "@vue/runtime-core";
import ActionButton from "@/components/layout/ActionButton.vue";
import { abortJob, queueJob } from "@/assets/api";
import useCorpusIdParam from "@/composables/corpusIdParam";
import { useStore } from "vuex";

const store = useStore();
const { loadJob, jobStatus, isJobRunning } = useCheckStatus();
const { corpusId } = useCorpusIdParam();
const refForm = ref(null);
const hasConfig = computed(
  () => store.state.corpora[corpusId.value].configSummary
);

onMounted(() => loadJob(refForm.value.$el));

async function run() {
  await spin(queueJob(corpusId.value), "Lägger analys i kö", refForm.value.$el);
}

async function abort() {
  await spin(abortJob(corpusId.value), "Avbryter analys", refForm.value.$el);
  await loadJob();
}
</script>

<style></style>
