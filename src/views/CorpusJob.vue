<template>
  <PendingContent :on="`corpus/${corpusId}/job`">
    <Section :title="$t('analysis')">
      <table class="w-full my-4">
        <thead></thead>
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("message") }}:</th>
            <td>{{ jobStatus.message }}</td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("sparvOutput") }}:</th>
            <td>
              <pre class="text-sm">{{ jobStatus.sparv_output }}</pre>
            </td>
          </tr>
          <tr v-if="jobStatus.errors">
            <th class="lg:w-1/6">{{ $t("errors") }}:</th>
            <td>
              <pre class="text-sm">{{ jobStatus.errors }}</pre>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-center">
        <ActionButton
          v-if="hasConfig && !isJobRunning"
          variant="primary"
          class="mr-2"
          @click="runJob"
        >
          <icon :icon="['fas', 'gears']" class="mr-1" />
          {{ $t("job_run") }}
        </ActionButton>

        <ActionButton v-if="isJobRunning" variant="danger" @click="abortJob">
          {{ $t("job_abort") }}
        </ActionButton>
      </div>
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
const hasConfig = computed(() => store.state.corpora[corpusId.value].config);

onMounted(() => loadJob());
</script>

<style></style>
