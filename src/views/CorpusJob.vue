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
        <tr>
          <th />
          <td>
            <ActionButton
              v-if="hasConfig && !isJobRunning"
              class="mr-2 bg-blue-100 border-blue-200"
              @click="run"
            >
              Starta analys
            </ActionButton>

            <ActionButton
              v-if="isJobRunning"
              @click="abort"
              class="bg-red-200 border-red-300"
            >
              Avbryt analys
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { abortJob, queueJob } from "@/assets/api";
import { spin } from "@/assets/spin";
import useCheckStatus from "@/composables/checkStatus";
import useCorpusIdParam from "@/composables/corpusIdParam";
import Section from "@/components/layout/Section.vue";
import ActionButton from "@/components/layout/ActionButton.vue";

const store = useStore();
const { loadJob, runJob, jobStatus, isJobRunning } = useCheckStatus();
const { corpusId } = useCorpusIdParam();
const refForm = ref(null);
const hasConfig = computed(
  () => store.state.corpora[corpusId.value].configSummary
);

onMounted(() => loadJob(refForm.value.$el));

const run = () => runJob(refForm.value.$el);

async function abort() {
  await spin(abortJob(corpusId.value), "Avbryter analys", refForm.value.$el);
  await loadJob();
}
</script>

<style></style>
