<script setup lang="ts">
import { computed, watch } from "vue";
import useExports from "@/corpus/exports/exports.composable";
import ToolPanel from "@/corpus/explore/ToolPanel.vue";
import { ensureTrailingSlash } from "@/util";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import useJob from "@/corpus/job/job.composable";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";
import useSpin from "@/spin/spin.composable";

const corpusId = useCorpusIdParam();
const { isPending } = useSpin();
const { exports, loadExports } = useExports(corpusId);
const { isDone } = useCorpusState(corpusId);
const { installKorp, installStrix, isJobRunning, jobState } = useJob(corpusId);
const { locale3 } = useLocale();

const korpUrl = ensureTrailingSlash(import.meta.env.VITE_KORP_URL);
const strixUrl = ensureTrailingSlash(import.meta.env.VITE_STRIX_URL);

const canInstall = computed(
  () =>
    !isJobRunning.value &&
    exports.value?.length > 0 &&
    !isPending(`corpus/${corpusId}/job`),
);

loadExports();

async function korpInstall() {
  await installKorp();
}

async function strixInstall() {
  await installStrix();
}

// When a job finishes, show download button.
watch(isDone, () => {
  if (isDone.value) {
    loadExports();
  }
});
</script>

<template>
  <p>{{ $t("exports.tools.help") }}</p>
  <div class="grid xl:grid-cols-2 gap-4 mt-4">
    <PendingContent :on="`corpus/${corpusId}/job/install/korp`">
      <ToolPanel
        name="Korp"
        :info="$t('exports.tools.help.korp')"
        :link-url="$t('exports.tools.help.korp.manual.url')"
        :link-text="$t('exports.tools.help.korp.manual.text')"
        :can-install="canInstall"
        :is-installed="jobState?.korp == 'done'"
        :show-url="`${korpUrl}?mode=mink#?corpus=${corpusId}&lang=${locale3}`"
        @install="korpInstall()"
      />
    </PendingContent>

    <PendingContent :on="`corpus/${corpusId}/job/install/strix`">
      <ToolPanel
        name="Strix"
        :info="$t('exports.tools.help.strix')"
        :can-install="canInstall"
        :is-installed="jobState?.strix == 'done'"
        :show-url="`${strixUrl}?modeSelected=mink&filters=corpus_id:${corpusId}&lang=${locale3}`"
        @install="strixInstall()"
      />
    </PendingContent>
  </div>
</template>
