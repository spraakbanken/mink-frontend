<template>
  <PendingContent :on="`corpus/${corpusId}/job`">
    <Section title="Analys">
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
                @click="runJob"
              >
                Starta analys
              </ActionButton>

              <ActionButton
                v-if="isJobRunning"
                @click="abortJob"
                class="bg-red-200 border-red-300"
              >
                Avbryt analys
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  </PendingContent>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useJob from "@/composables/job";
import useCorpusIdParam from "@/composables/corpusIdParam";
import Section from "@/components/layout/Section.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import PendingContent from "@/components/PendingContent.vue";

const store = useStore();
const { loadJob, runJob, abortJob, jobStatus, isJobRunning } = useJob();
const { corpusId } = useCorpusIdParam();
const hasConfig = computed(
  () => store.state.corpora[corpusId.value].configSummary
);

onMounted(() => loadJob());
</script>

<style></style>
