<script setup lang="ts">
import type { AxiosError } from "axios";
import { PhWarning } from "@phosphor-icons/vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import useConfig from "@/corpus/config/config.composable";
import { useAuth } from "@/auth/auth.composable";
import FileUpload from "@/components/FileUpload.vue";
import HelpBox from "@/components/HelpBox.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import type { MinkResponse } from "@/api/api.types";
import useMessenger from "@/message/messenger.composable";
import SyntaxHighlight from "@/components/SyntaxHighlight.vue";
import PendingContent from "@/spin/PendingContent.vue";

const corpusId = useCorpusIdParam();
const { config, uploadConfigRaw } = useConfig(corpusId);
const { alertError } = useMessenger();
const { requireAuthentication } = useAuth();

requireAuthentication();

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
      <PendingContent :on="`corpus/${corpusId}/config`">
        <SyntaxHighlight v-if="config" language="yaml" :code="config" />
      </PendingContent>
    </LayoutBox>

    <LayoutBox class="w-96 grow" :title="$t('upload')">
      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.caution") }}
      </HelpBox>
      <HelpBox important>
        <PhWarning class="inline mb-1 mr-1" />
        {{ $t("config.custom.upload.overwrite") }}
      </HelpBox>
      <PendingContent :on="`corpus/${corpusId}/config`" blocking>
        <FileUpload :file-handler="upload" accept=".yaml,.yml" />
      </PendingContent>
    </LayoutBox>
  </div>
</template>
