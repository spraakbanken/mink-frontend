<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ensureTrailingSlash } from "@/util";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useExports from "./exports.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import useJob from "@/corpus/job/job.composable";
import PendingContent from "@/spin/PendingContent.vue";
import ToolPanel from "./ToolPanel.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { exports, loadExports, downloadResult, getDownloadFilename } =
  useExports(corpusId);
const { isDone } = useCorpusState(corpusId);
const { installKorp, installStrix, jobState } = useJob(corpusId);
const { locale3 } = useLocale();

const korpUrl = ensureTrailingSlash(import.meta.env.VITE_KORP_URL);
const strixUrl = ensureTrailingSlash(import.meta.env.VITE_STRIX_URL);

const isInstallPending = ref(false);
const canInstall = computed(
  () =>
    jobState.value?.sparv == "done" &&
    !["waiting", "running"].includes(jobState?.value.korp) &&
    !["waiting", "running"].includes(jobState?.value.strix) &&
    !isInstallPending.value,
);

loadExports();

async function korpInstall() {
  isInstallPending.value = true;
  await installKorp();
  isInstallPending.value = false;
}

async function strixInstall() {
  isInstallPending.value = true;
  await installStrix();
  isInstallPending.value = false;
}

// When a job finishes, show download button.
watch(isDone, () => {
  if (isDone.value) {
    loadExports();
  }
});
</script>

<template>
  <PendingContent
    :on="`corpus/${corpusId}/exports`"
    class="xl:grid grid-cols-2 gap-4"
  >
    <div>
      <h3 class="text-lg uppercase">
        {{ $t("tools") }}
      </h3>
      <p>{{ $t("exports.tools.help") }}</p>

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

      <ToolPanel
        name="Strix"
        :info="$t('exports.tools.help.strix')"
        :can-install="canInstall"
        :is-installed="jobState?.strix == 'done'"
        :show-url="`${strixUrl}?modeSelected=mink&filters=corpus_id:${corpusId}&lang=${locale3}`"
        @install="strixInstall()"
      />
    </div>

    <div>
      <h3 class="text-lg uppercase">{{ $t("download") }}</h3>
      <p>{{ $t("exports.download.help") }}</p>

      <table v-if="exports?.length">
        <tr>
          <th>{{ $t("file.archive") }}</th>
          <td>
            <a href="#" @click.prevent="downloadResult">
              <icon :icon="['fas', 'download']" class="mr-1" />
              {{ getDownloadFilename() }}
            </a>
          </td>
        </tr>
        <tr>
          <th>{{ $t("file.singles") }}</th>
          <td>
            <router-link :to="`/corpus/${corpusId}/exports`">
              {{ $t("show") }}...
            </router-link>
          </td>
        </tr>
      </table>
    </div>
  </PendingContent>
</template>
