<script setup lang="ts">
import { useRouter } from "vue-router";
import useConfig from "@/corpus/config/config.composable";
import PendingContent from "@/spin/PendingContent.vue";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import LayoutSection from "@/components/LayoutSection.vue";
import useMessenger from "@/message/messenger.composable";
import HelpBox from "@/components/HelpBox.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import type { ByLang } from "@/util.types";
import { emptyConfig } from "@/api/corpusConfig";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { config, uploadConfig } = useConfig(corpusId);
const { alertError } = useMessenger();

type Form = {
  name: ByLang;
  description: ByLang;
};

async function submit(fields: Form) {
  // If there is no previous config file, start from a minimal one.
  const configOld = config.value || emptyConfig();
  // Merge new form values with existing config.
  const configNew = {
    ...configOld,
    name: fields.name,
    description: fields.description,
  };
  await uploadConfig(configNew)
    .then(() => router.push(`/library/corpus/${corpusId}`))
    .catch(alertError);
}
</script>

<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <FormKit
      id="corpus-config"
      type="form"
      :submit-label="$t('save')"
      :submit-attrs="{
        inputClass: 'mink-button button-primary',
      }"
      @submit="submit"
    >
      <LayoutSection :title="$t('metadata')">
        <HelpBox>
          <p>{{ $t("config.metadata.help") }}</p>
        </HelpBox>

        <div class="grid md:grid-cols-2 gap-4">
          <LayoutBox
            v-for="(lang2, lang3) of { swe: 'sv', eng: 'en' }"
            :key="lang3"
            :title="$t(lang2)"
          >
            <FormKit type="group" name="name">
              <FormKit
                :name="lang3"
                :label="$t('name')"
                :value="config?.name?.[lang3]"
                :help="$t('metadata.name.help')"
                type="text"
                input-class="w-72"
                validation="required:trim"
              />
            </FormKit>

            <FormKit type="group" name="description">
              <FormKit
                :name="lang3"
                :label="$t('description')"
                :value="config?.description?.[lang3]"
                :help="$t('metadata.description.help')"
                type="textarea"
                input-class="w-full h-20"
              />
            </FormKit>
          </LayoutBox>
        </div>

        <FormKit
          :label="$t('identifier')"
          type="text"
          name="identifier"
          disabled
          :value="corpusId"
          :help="$t('metadata.identifier.help')"
          input-class="font-mono bg-stone-600 text-lime-50 text-xs p-2 rounded"
        />
      </LayoutSection>
    </FormKit>
  </PendingContent>
</template>
