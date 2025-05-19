<script setup lang="ts">
import { computed } from "vue";
import { groupBy } from "es-toolkit";
import { PhDownloadSimple } from "@phosphor-icons/vue";
import { useCorpus } from "../corpus.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import HelpBox from "@/components/HelpBox.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { filesize } = useLocale();
const {
  loadExports,
  exports,
  downloadResult,
  downloadResultFile,
  getDownloadFilename,
} = useCorpus(corpusId);

const exportsByFolder = computed(() =>
  exports.value
    ? groupBy(exports.value, (meta) => meta.path.split("/").shift()!)
    : undefined,
);

loadExports();
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}/exports`">
    <LayoutSection :title="$t('result')">
      <HelpBox>
        <p>{{ $t("exports.help") }}</p>
        <aside>
          <a
            href="https://spraakbanken.gu.se/en/tools/mink/manual#download-results"
          >
            {{ $t("exports.help.more.label") }}
          </a>
        </aside>
      </HelpBox>

      <div class="my-4">
        {{ $t("download_export") }}:
        <ActionButton
          v-if="exports && exports.length"
          class="button-primary mr-2"
          @click="downloadResult"
        >
          <PhDownloadSimple weight="bold" class="inline mb-0.5 mr-1" />
          {{ getDownloadFilename() }}
        </ActionButton>
      </div>

      <table class="w-full mt-4 striped">
        <thead>
          <tr>
            <th class="w-full">{{ $t("fileName") }}</th>
            <th class="text-right">{{ $t("fileSize") }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(exports_, folder) in exportsByFolder" :key="folder">
            <tr>
              <td colspan="2">{{ folder }}/</td>
            </tr>
            <tr v-for="file in exports_" :key="file.name">
              <td class="pl-6!">
                <a href="#" @click.prevent="downloadResultFile(file.path)">
                  <PhDownloadSimple
                    weight="fill"
                    class="inline mb-0.5 mr-1"
                  />{{ file.path.split("/").slice(1).join("/") }}
                </a>
              </td>
              <td class="text-right whitespace-nowrap">
                {{ filesize(file.size) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </LayoutSection>
  </PendingContent>
</template>
