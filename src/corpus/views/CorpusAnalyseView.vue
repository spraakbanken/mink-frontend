<script setup lang="ts">
import { computed, ref } from "vue";
import { PhGearFine, PhInfo } from "@phosphor-icons/vue";
import { useCorpus } from "../corpus.composable";
import { useSparv } from "../sparv.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useAlert from "@/alert/alert.composable";
import useSources from "@/resource/sources.composable";
import useResource from "@/resource/resource.composable";
import { useUserStore } from "@/store/user.store";
import useResourceIdParam from "@/resource/resourceIdParam.composable";

const id = useResourceIdParam();
const { configOptions, isConfigValid, exports, clearAnnotations } =
  useCorpus(id);
const { job, isRunning, runJob } = useResource(id);
const { sources } = useSources("corpus", id);
const { canWrite } = useUserStore();
const { loadExporters } = useSparv();
const { showAlert } = useAlert();

const isPending = ref(false);
const canRun = computed(
  () =>
    canWrite("corpus", id) &&
    sources.value.length &&
    isConfigValid.value &&
    !isPending.value &&
    !isRunning.value,
);

async function doRunJob() {
  isPending.value = true;
  const exporters = await loadExporterNames();
  await runJob(exporters).catch(showAlert);
  isPending.value = false;
}

/** Load which Sparv exporters to use for the language of this corpus */
async function loadExporterNames() {
  const language = configOptions.value?.language;
  if (!language) return undefined;
  const exporters = await loadExporters(language);
  return exporters
    .filter((exporter) => exporter.enabled_by_default)
    .map((exporter) => exporter.export);
}
</script>

<template>
  <div>
    <PendingContent :on="`${id}/job/run`" class="flex flex-col gap-3">
      <PendingContent
        :on="`${id}/exports/list`"
        v-if="!isRunning && exports?.length"
        class="flex gap-3 items-center"
      >
        <div class="grow">
          <div class="font-semibold">{{ $t("annotations.clear") }}</div>
          {{ $t("annotations.clear.help") }}
        </div>

        <ActionButton
          :disabled="!canWrite('corpus', id)"
          @click="clearAnnotations().catch(showAlert)"
        >
          {{ $t("annotations.clear") }}
        </ActionButton>
      </PendingContent>

      <div class="flex gap-3 items-center">
        <div class="grow">
          <div class="font-semibold">{{ $t("corpus.sparv.run") }}</div>
          <i18n-t keypath="analysis.help" scope="global">
            <template #sparv>
              <a :href="$t('sparv.url')">Sparv</a>
            </template>
          </i18n-t>
        </div>

        <ActionButton
          :disabled="!canRun"
          :class="{ 'button-primary': canRun && !exports?.length }"
          @click="canRun ? doRunJob() : null"
        >
          <PhGearFine weight="bold" class="inline mb-1 mr-1" />
          {{ $t("corpus.sparv.run") }}
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
            (job?.status.korp == 'done' || job?.status.strix == 'done')
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
