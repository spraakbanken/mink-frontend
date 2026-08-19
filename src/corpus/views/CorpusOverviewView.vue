<script setup lang="ts">
import CorpusStateHelp from "../CorpusStateHelp.vue";
import CorpusChecklist from "../CorpusChecklist.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import JobStatusPanel from "@/job/JobStatusPanel.vue";

const id = useResourceIdParam();
</script>

<template>
  <div>
    <CorpusStateHelp :id class="mb-4" />
    <div class="flex flex-wrap gap-2">
      <LayoutBox :title="$t('corpus.checklist')" class="w-96 grow">
        <CorpusChecklist :id />
      </LayoutBox>

      <LayoutBox :title="$t('job.status')" class="w-96 grow">
        <JobStatusPanel :id />
      </LayoutBox>
    </div>
  </div>
</template>
