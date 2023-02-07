<template>
  <PageTitle>{{ $t("new_corpus") }}</PageTitle>
  <Section>
    <Help>{{ $t("corpus.create.help") }}</Help>

    <PendingContent on="create">
      <FormKit
        id="create-corpus"
        v-slot="{ value }"
        type="form"
        :submit-label="$t('create')"
        :submit-attrs="{
          inputClass: 'mink-button mink-primary',
        }"
        @submit="submit"
      >
        <FormKit
          :label="$t('name')"
          type="text"
          validation="required:trim"
          name="name"
          input-class="w-72"
          :placeholder="$t('metadata.name.placeholder')"
          :help="$t('metadata.name.help')"
        />

        <FormKit
          :label="$t('description')"
          type="textarea"
          name="description"
          :placeholder="$t('metadata.description.placeholder')"
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

        <FormKit
          v-if="value.format === 'xml'"
          name="textAnnotation"
          :label="$t('text_annotation')"
          validation="required:trim"
          input-class="w-72"
          :help="$t('text_annotation_help')"
        />
      </FormKit>
    </PendingContent>
  </Section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import PageTitle from "@/components/PageTitle.vue";
import Section from "@/components/Section.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { FORMATS_EXT } from "@/api/corpusConfig";
import { useAuth } from "@/auth/auth.composable";
import useCorpora from "./corpora.composable";
import Help from "@/components/Help.vue";

const { requireAuthentication } = useAuth();
const { createFromConfig } = useCorpora();
const { t } = useI18n();

const formatOptions = computed(() =>
  FORMATS_EXT.reduce(
    (options, ext) => ({
      ...options,
      [ext]: `${t(ext)} (.${ext})`,
    }),
    {}
  )
);

requireAuthentication();

async function submit(fields) {
  await createFromConfig(
    fields.name,
    fields.description,
    fields.format,
    fields.textAnnotation
  );
}
</script>
