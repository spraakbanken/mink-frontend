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
      </tbody>
    </table>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useRoute } from "vue-router";
import CorpusRibbon from "@/components/CorpusRibbon.vue";
import Section from "@/components/layout/Section.vue";
import PageTitle from "@/components/PageTitle.vue";
import useCheckStatus from "@/composables/checkStatus";
import { onUnmounted } from "@vue/runtime-core";

const route = useRoute();
const { loadJob, loadJobTimer, jobStatus } = useCheckStatus();

loadJob();
onUnmounted(() => clearTimeout(loadJobTimer));

const corpusId = computed(() => route.params.corpusId);
</script>

<style></style>
