<script setup lang="ts">
import { PhTrash } from "@phosphor-icons/vue";
import CorpusStateHelp from "../CorpusStateHelp.vue";
import CorpusChecklist from "../CorpusChecklist.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import JobStatusPanel from "@/job/JobStatusPanel.vue";
import RouteButton from "@/components/RouteButton.vue";
import { useUserStore } from "@/store/user.store.ts";

const id = useResourceIdParam();
const { canAdmin } = useUserStore();
</script>

<template>
  <div class="flex flex-col gap-2">
    <CorpusStateHelp :id class="my-0!" />

    <div class="flex flex-wrap gap-2">
      <LayoutBox :title="$t('corpus.checklist')" class="w-96 grow">
        <CorpusChecklist :id />
      </LayoutBox>

      <LayoutBox :title="$t('job.process')" class="w-96 grow">
        <JobStatusPanel :id />
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
