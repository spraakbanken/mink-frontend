<script setup lang="ts">
import { PhTrash } from "@phosphor-icons/vue";
import CorpusStateHelp from "../CorpusStateHelp.vue";
import CorpusChecklist from "../CorpusChecklist.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import JobStatusPanel from "@/job/JobStatusPanel.vue";
import RouteButton from "@/components/RouteButton.vue";
import { useUserStore } from "@/store/user.store";
import { useAppConfig } from "@/app/useAppConfig";
import SharingPanel from "@/auth/SharingPanel.vue";

const { appConfig } = useAppConfig();
const id = useResourceIdParam();
const { canAdmin } = useUserStore();
</script>

<template>
  <div class="flex flex-col gap-2">
    <CorpusStateHelp :id />

    <div class="grid lg:grid-cols-2 gap-2">
      <LayoutBox :title="$t('checklist')">
        <CorpusChecklist :id />
      </LayoutBox>

      <LayoutBox :title="$t('job.process')">
        <JobStatusPanel :id />
      </LayoutBox>

      <LayoutBox v-if="appConfig.sharing" :title="$t('sharing')">
        <SharingPanel resource-type="corpus" :id />
      </LayoutBox>
    </div>

    <div class="flex justify-center items-baseline gap-4">
      <RouteButton
        :disabled="!canAdmin('corpus', id)"
        :to="`/library/corpus/${id}/delete`"
        class="button-danger"
      >
        <PhTrash weight="fill" class="inline mb-1 mr-1" />
        {{ $t("delete") }}
      </RouteButton>
    </div>
  </div>
</template>
