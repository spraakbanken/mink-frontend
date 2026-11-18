<script setup lang="ts">
import { computed, ref } from "vue";
import { PhGearFine, PhInfo } from "@phosphor-icons/vue";
import { useLexicon } from "../lexicon.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useUserStore } from "@/store/user.store";
import useMessenger from "@/alert/alert.composable";
import useSources from "@/resource/sources.composable";
import useResource from "@/resource/resource.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";

const id = useResourceIdParam();
const { job, isRunning, runJob } = useResource(id);
const { exports } = useLexicon(id);
const { sources } = useSources("lexicon", id);
const { canWrite } = useUserStore();
const { showAlert } = useMessenger();

const isPending = ref(false);

const canRun = computed(
  () =>
    canWrite("lexicon", id) &&
    sources.value.length &&
    !isPending.value &&
    !isRunning.value,
);

async function doRunJob() {
  isPending.value = true;
  await runJob().catch(showAlert);
  isPending.value = false;
}
</script>

<template>
  <div>
    <PendingContent :on="`${id}/job/run`" class="flex flex-col gap-3">
      <div class="flex gap-3 items-center">
        <div class="grow">
          <div class="font-semibold">{{ $t("lexicon.karp_pipeline.run") }}</div>
          {{ $t("lexicon.karp_pipeline.help") }}
        </div>

        <ActionButton
          :disabled="!canRun"
          class="ms-auto"
          :class="{ 'button-primary': canRun && !exports?.length }"
          @click="canRun ? doRunJob() : null"
        >
          <PhGearFine weight="bold" class="inline mb-1 mr-1" />
          {{ $t("lexicon.karp_pipeline.run") }}
        </ActionButton>
      </div>

      <div>
        <div v-if="!isRunning && exports?.length" class="text-sm">
          <PhInfo class="inline mb-0.5 mr-1" />
          {{ $t("job.rerun.overwrite") }}
        </div>

        <div
          v-if="
            !isRunning &&
            (job?.status.karpred == 'done' || job?.status.karps == 'done')
          "
          class="text-sm"
        >
          <PhInfo class="inline mb-0.5 mr-1" />
          {{ $t("job.rerun.tools_outdated") }}
        </div>
      </div>
    </PendingContent>
  </div>
</template>
