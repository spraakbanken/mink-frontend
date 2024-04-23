<script setup lang="ts">
import type { AxiosError } from "axios";
import useCorpusIdParam from "../corpusIdParam.composable";
import useConfig from "./config.composable";
import FileUpload from "@/components/FileUpload.vue";
import HelpBox from "@/components/HelpBox.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import type { MinkResponse } from "@/api/api.types";
import useMessenger from "@/message/messenger.composable";

const corpusId = useCorpusIdParam();
const { config, uploadConfigRaw } = useConfig(corpusId);
const { alertError } = useMessenger();

async function upload(files: File[]) {
  const configYaml = await files[0].text();

  try {
    uploadConfigRaw(configYaml);
  } catch (error) {
    alertError(error as AxiosError<MinkResponse>);
  }
}
</script>

<template>
  <HelpBox>
    <i18n-t scope="global" keypath="config.custom.help">
      <template #sparv>
        <a :href="$t('sparv.url')">Sparv</a>
      </template>
      <template #topic>
        <a
          href="https://spraakbanken.gu.se/sparv/#/user-manual/corpus-configuration"
        >
          Corpus Configuration
        </a>
      </template>
    </i18n-t>
  </HelpBox>

  <div class="flex flex-wrap gap-4">
    <LayoutBox class="w-96 grow" :title="$t('show')">
      <TerminalOutput v-if="config">{{ config }}</TerminalOutput>
    </LayoutBox>

    <LayoutBox class="w-96 grow" :title="$t('upload')">
      <HelpBox>{{ $t("config.custom.upload.help") }}</HelpBox>
      <FileUpload :file-handler="upload" accept=".yaml,.yml" />
    </LayoutBox>
  </div>
</template>
