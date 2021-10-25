<template>
  <PageTitle subtitle="Korpus">{{ corpusId }}</PageTitle>
  <CorpusRibbon />
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
import { ref } from "@vue/reactivity";
import CorpusRibbon from "@/components/CorpusRibbon.vue";
import Section from "@/components/layout/Section.vue";
import PageTitle from "@/components/PageTitle.vue";
import useCheckStatus from "@/composables/checkStatus";
import { onMounted, onUnmounted } from "@vue/runtime-core";
import ActionButton from "@/components/layout/ActionButton.vue";
import { abortJob } from "@/assets/api";
import useCorpusIdParam from "@/composables/corpusIdParam";

const { loadJob, loadJobTimer, jobStatus, isJobRunning } = useCheckStatus();
const refForm = ref(null);

onMounted(() => loadJob(refForm.value.$el));
onUnmounted(() => clearTimeout(loadJobTimer));

const { corpusId } = useCorpusIdParam();

async function abort() {
  await spin(abortJob(corpusId.value), "Avbryter analys", refForm.value.$el);
  await loadJob();
}
</script>

<style></style>
