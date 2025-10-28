<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { FormKit } from "@formkit/vue";
import { PhLightbulbFilament } from "@phosphor-icons/vue";
import PageTitle from "@/components/PageTitle.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import useSpin from "@/spin/spin.composable";
import PendingContent from "@/spin/PendingContent.vue";
import { FORMATS_EXT, type FileFormat } from "@/api/corpusConfig";
import useCreateCorpus from "@/corpus/createCorpus.composable";
import HelpBox from "@/components/HelpBox.vue";
import FormKitWrapper from "@/components/FormKitWrapper.vue";

const { createFromConfig } = useCreateCorpus();
const { t } = useI18n();
const { spin } = useSpin();

type Form = {
  name?: string;
  description?: string;
  format: FileFormat;
  textAnnotation?: string;
};

const formatOptions = computed(() =>
  FORMATS_EXT.reduce(
    (options, ext) => ({
      ...options,
      [ext]: `${t(ext)} (.${ext})`,
    }),
    {},
  ),
);

async function submit(fields: Form) {
  const createPromise = createFromConfig(
    fields.name?.trim() || "",
    fields.description?.trim() || "",
    fields.format,
    fields.textAnnotation,
  );
  await spin(createPromise, "create");
}
</script>

<template>
  <PageTitle>{{ $t("new_corpus") }}</PageTitle>
  <LayoutSection>
    <HelpBox>{{ $t("corpus.create.help") }}</HelpBox>

    <PendingContent on="create">
      <FormKitWrapper>
        <FormKit
          id="create-corpus"
          v-slot="{ value }"
          type="form"
          :submit-label="$t('create')"
          :submit-attrs="{
            inputClass: 'mink-button button-primary',
          }"
          @submit="submit"
        >
          <FormKit
            :label="$t('name')"
            type="text"
            name="name"
            input-class="w-72"
            :help="$t('metadata.name.help')"
          />

          <FormKit
            :label="$t('description')"
            type="textarea"
            name="description"
            :help="$t('metadata.description.help')"
            input-class="block w-full h-20"
          />

          <FormKit
            name="format"
            :label="$t('fileFormat')"
            type="select"
            input-class="w-72"
            :help="$t('config.format.help')"
            :options="formatOptions"
            validate="required"
          />

          <HelpBox v-if="value!.format === 'pdf'" important>
            <PhLightbulbFilament weight="bold" class="inline mb-1 mr-1" />
            {{ $t("config.format.note.pdf") }}
          </HelpBox>

          <FormKit
            v-if="value!.format === 'xml'"
            name="textAnnotation"
            :label="$t('config.text_annotation')"
            validation="required:trim|matches:/^[^<>\s]*$/"
            input-class="w-40 font-mono"
            :help="$t('config.text_annotation.help')"
          >
            <template #prefix>&lt;</template>
            <template #suffix>&gt;</template>
          </FormKit>
        </FormKit>
      </FormKitWrapper>
    </PendingContent>
  </LayoutSection>
</template>
