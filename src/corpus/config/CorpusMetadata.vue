<template>
  <div v-if="config">
    <FormKit
      id="corpus-config"
      type="form"
      :submit-label="$t('save')"
      :submit-attrs="{
        inputClass: 'mink-button mink-primary',
      }"
      @submit="submit"
    >
      <Section :title="$t('metadata')">
        <Help>
          <p>{{ $t("config.metadata.help") }}</p>
        </Help>

        <div class="grid md:grid-cols-2 gap-x-4">
          <FormKit type="group" name="name">
            <TaggedInput v-for="lang in ['swe', 'eng']" :key="lang" :tag="lang">
              <FormKit
                :name="lang"
                :label="$t('name')"
                :value="config.name?.[lang]"
                :placeholder="$t('metadata.name.placeholder')"
                :help="$t('metadata.name.help')"
                type="text"
                input-class="w-72"
                validation="required:trim"
              />
            </TaggedInput>
          </FormKit>

          <FormKit type="group" name="description">
            <TaggedInput v-for="lang in ['swe', 'eng']" :key="lang" :tag="lang">
              <FormKit
                :name="lang"
                :label="$t('description')"
                :value="config.description?.[lang]"
                :placeholder="$t('metadata.description.placeholder')"
                :help="$t('metadata.description.help')"
                type="textarea"
                input-class="w-full h-20"
              />
            </TaggedInput>
          </FormKit>
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
      </Section>
    </FormKit>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import Section from "@/components/Section.vue";
import useConfig from "./config.composable";
import TaggedInput from "./TaggedInput.vue";
import useMessenger from "@/message/messenger.composable";
import Help from "@/components/Help.vue";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { config, uploadConfig } = useConfig(corpusId);
const { alert } = useMessenger();

async function submit(fields) {
  const corpusIdFixed = corpusId;
  const configNew = {
    ...config.value,
    name: fields.name,
    description: fields.description,
  };
  try {
    await uploadConfig(configNew, corpusIdFixed);
    router.push(`/corpus/${corpusIdFixed}`);
  } catch (e) {
    alert(e, "error");
  }
}
</script>

<style></style>
