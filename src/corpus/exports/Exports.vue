<template>
  <PendingContent
    :on="`corpus/${corpusId}/exports`"
    class="grid grid-cols-2 gap-4"
  >
    <div>
      <h3 class="text-lg uppercase">
        {{ $t("tools") }}
      </h3>
      <p>{{ $t("exports.tools.help") }}</p>

      <div class="flex gap-2 my-2 justify-between items-baseline">
        <h3 class="text-lg uppercase">Korp</h3>

        <div class="flex flex-wrap gap-2 justify-end">
          <ActionButton
            :variant="canInstall ? 'primary' : null"
            :disabled="!canInstall"
            @click="canInstall ? korpInstall() : null"
          >
            {{
              $t(
                !korpStatus.isDone
                  ? "exports.tools.install"
                  : "exports.tools.reinstall",
                { tool: "Korp" }
              )
            }}
          </ActionButton>

          <a
            v-if="korpStatus.isDone"
            :href="`${korpUrl}?mode=mink#?corpus=${corpusId}`"
            target="_blank"
          >
            <ActionButton variant="primary">
              {{ $t("exports.tools.view", { tool: "Korp" }) }}
            </ActionButton>
          </a>
          <ActionButton v-else disabled>
            {{ $t("exports.tools.view", { tool: "Korp" }) }}
          </ActionButton>
        </div>
      </div>

      <div class="flex gap-2 my-2 justify-between items-baseline">
        <h3 class="text-lg uppercase">Strix</h3>

        <div class="flex flex-wrap gap-2 justify-end">
          <ActionButton
            :variant="canInstall ? 'primary' : null"
            :disabled="!canInstall"
            @click="canInstall ? strixInstall() : null"
          >
            {{
              $t(
                !strixStatus.isDone
                  ? "exports.tools.install"
                  : "exports.tools.reinstall",
                { tool: "Strix" }
              )
            }}
          </ActionButton>

          <a
            v-if="strixStatus.isDone"
            :href="`${strixUrl}?mode=mink#?corpus=${corpusId}`"
            target="_blank"
          >
            <ActionButton variant="primary">
              {{ $t("exports.tools.view", { tool: "Strix" }) }}
            </ActionButton>
          </a>
          <ActionButton v-else disabled>
            {{ $t("exports.tools.view", { tool: "Strix" }) }}
          </ActionButton>
        </div>
      </div>
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

<script setup>
import { computed, ref, watch } from "vue";
import { ensureTrailingSlash } from "@/util";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useExports from "./exports.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import useJob from "@/corpus/job/job.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";

const corpusId = useCorpusIdParam();
const { exports, loadExports, downloadResult, getDownloadFilename } =
  useExports(corpusId);
const { isDone } = useCorpusState(corpusId);
const { installKorp, installStrix, sparvStatus, korpStatus, strixStatus } =
  useJob(corpusId);

const korpUrl = ensureTrailingSlash(import.meta.env.VITE_KORP_URL);
const strixUrl = ensureTrailingSlash(import.meta.env.VITE_STRIX_URL);

const isInstallPending = ref(false);
const canInstall = computed(
  () =>
    sparvStatus.value.isDone &&
    !korpStatus.value.isRunning &&
    !strixStatus.value.isRunning &&
    !isInstallPending.value
);

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
