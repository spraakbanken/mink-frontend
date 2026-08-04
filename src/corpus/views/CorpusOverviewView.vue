<script setup lang="ts">
import CorpusStateHelp from "../CorpusStateHelp.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import SharingPanel from "@/auth/SharingPanel.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import JobStatusPanel from "@/job/JobStatusPanel.vue";
import { useAppConfig } from "@/app/useAppConfig";

const id = useResourceIdParam();
const { appConfig } = useAppConfig();
</script>

<template>
  <div>
    <CorpusStateHelp :id class="mb-4" />
    <div class="flex flex-wrap gap-2">
      <LayoutBox :title="$t('job.status')" class="w-96 grow">
        <JobStatusPanel :id />
      </LayoutBox>

      <LayoutBox
        v-if="appConfig.sharing"
        :title="$t('sharing')"
        class="w-96 grow"
      >
        <SharingPanel resource-type="corpus" :id />
      </LayoutBox>
    </div>
  </div>
</template>
