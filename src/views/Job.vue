<template>
  <PageTitle subtitle="Korpus">{{ corpusId }}</PageTitle>
  <CorpusRibbon />
  <Section title="Analys">
    <table class="w-full my-2">
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
import { computed } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import CorpusRibbon from "@/components/CorpusRibbon.vue";
import Section from "@/components/layout/Section.vue";
import PageTitle from "@/components/PageTitle.vue";
import useCheckStatus from "@/composables/checkStatus";
import { onUnmounted } from "@vue/runtime-core";
import ActionButton from "@/components/layout/ActionButton.vue";
import { abortJob } from "@/assets/api";

const route = useRoute();
const router = useRouter();
const { loadJob, loadJobTimer, jobStatus, isJobRunning } = useCheckStatus();

loadJob();
onUnmounted(() => clearTimeout(loadJobTimer));

const corpusId = computed(() => route.params.corpusId);

async function abort() {
  await spin(abortJob(corpusId.value), "Avbryter analys");
  await loadJob();
}
</script>

<style></style>
