<script setup lang="ts">
import { computed, ref } from "vue";
import { PhGearFine } from "@phosphor-icons/vue";
import { useCorpus } from "../corpus.composable";
import { useSparv } from "../sparv.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useAlert from "@/alert/alert.composable";
import useSources from "@/resource/sources.composable";
import useResource from "@/resource/resource.composable";
import { useUserStore } from "@/store/user.store";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import HelpBox from "@/components/HelpBox.vue";

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
  <div class="grid lg:grid-cols-2 gap-2">
    <!-- Analyze -->
    <PendingContent :on="`${id}/job/run`">
      <LayoutBox :title="$t('corpus.sparv.run')">
        <div class="flex gap-3 items-center">
          <div class="grow grid gap-2">
            <i18n-t tag="div" keypath="analysis.help" scope="global">
              <template #sparv>
                <a :href="$t('sparv.url')">Sparv</a>
              </template>
            </i18n-t>

            <!-- Warnings -->
            <HelpBox v-if="exports?.length">
              <i18n-t keypath="job.rerun.overwrite" scope="global">
                <template #exports_link>
                  <router-link :to="`/library/corpus/${id}/exports`">
                    {{ $t("job.rerun.overwrite.exports") }}
                  </router-link>
                </template>
              </i18n-t>
            </HelpBox>

            <HelpBox
              v-if="job?.status.korp == 'done' || job?.status.strix == 'done'"
              important
            >
              <i18n-t keypath="job.rerun.tools_outdated" scope="global">
                <template #reinstall_link>
                  <router-link :to="`/library/corpus/${id}/explore`">
                    {{ $t("job.rerun.tools_outdated.reinstall") }}
                  </router-link>
                </template>
              </i18n-t>
            </HelpBox>
          </div>

          <ActionButton
            :disabled="!canRun"
            :class="{ 'button-primary': canRun && job?.status.sparv != 'done' }"
            @click="canRun ? doRunJob() : null"
          >
            <PhGearFine weight="bold" class="inline mb-1 mr-1" />
            {{ $t("corpus.sparv.run") }}
          </ActionButton>
        </div>
      </LayoutBox>
    </PendingContent>

    <!-- Clear annotations -->
    <PendingContent :on="`${id}/exports/list`">
      <LayoutBox :title="$t('annotations.clear')">
        <div class="flex gap-3 items-center">
          <div class="grow">
            {{ $t("annotations.clear.help") }}
          </div>

          <ActionButton
            :disabled="
              !canWrite('corpus', id) ||
              isRunning ||
              job?.status.sparv != 'done'
            "
            @click="clearAnnotations().catch(showAlert)"
          >
            {{ $t("annotations.clear") }}
          </ActionButton>
        </div>
      </LayoutBox>
    </PendingContent>
  </div>
</template>
