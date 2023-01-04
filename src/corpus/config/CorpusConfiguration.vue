<template>
  <div v-if="config">
    <Section :title="$t('metadata')">
      <table class="w-full my-4 striped">
        <thead></thead>
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("name") }}</th>
            <td>
              <TaggedInput tag="swe">
                <input v-model="name.swe" class="border w-72 p-1" />
              </TaggedInput>
              <TaggedInput tag="eng">
                <input v-model="name.eng" class="border w-72 p-1" />
              </TaggedInput>
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("description") }}</th>
            <td>
              <TaggedInput tag="swe">
                <textarea
                  v-model="description.swe"
                  class="border w-full p-1 h-20"
                />
              </TaggedInput>
              <TaggedInput tag="eng">
                <textarea
                  v-model="description.eng"
                  class="border w-full p-1 h-20"
                />
              </TaggedInput>
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("identifier") }}</th>
            <td>
              <TerminalOutput class="inline leading-loose">
                {{ corpusId }}
              </TerminalOutput>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
    <Section :title="$t('configuration')">
      <table class="w-full my-4 striped">
        <thead></thead>
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("fileFormat") }}</th>
            <td>
              <select id="format" v-model="format" class="border w-72 p-1">
                <option v-for="ext in FORMATS_EXT" :value="ext">
                  {{ $t(ext) }} (.{{ ext }})
                </option>
              </select>
            </td>
          </tr>
          <tr v-if="format === 'xml'">
            <th class="lg:w-1/6">
              <label for="textAnnotation">{{ $t("text_annotation") }}</label>
            </th>
            <td>
              <input
                id="textAnnotation"
                v-model="textAnnotation"
                :required="format === 'xml'"
                class="border w-72 p-1"
              />
              <div class="text-sm py-1">
                {{ $t("text_annotation_help") }}
              </div>
            </td>
          </tr>
          <tr v-if="format != 'xml'">
            <th class="lg:w-1/6">
              {{ $t("segmenter_sentence") }}
            </th>
            <td>
              <label class="mr-4">
                <input
                  id="sentenceSegmenter"
                  v-model="sentenceSegmenter"
                  type="radio"
                  value=""
                />
                {{ $t("none") }}
              </label>
              <label v-for="segmenter in SEGMENTERS" class="mr-4">
                <input
                  id="sentenceSegmenter"
                  v-model="sentenceSegmenter"
                  type="radio"
                  :value="segmenter"
                />
                {{ $t(`segmenter_${segmenter}`) }}
              </label>
              <div class="text-sm py-1">
                {{ $t("segmenter_sentence_help") }}
              </div>
            </td>
          </tr>
          <tr>
            <th>
              {{ $t("timespan") }}
            </th>
            <td>
              {{ $t("timespan_from") }}:
              <input v-model="datetimeFrom" type="date" class="mr-4" />
              {{ $t("timespan_to") }}:
              <input v-model="datetimeTo" type="date" />
              <div class="text-sm py-1">
                {{ $t("timespan_help") }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
    <Section>
      <div class="flex justify-center">
        <PendingContent :on="`corpus/${corpusId}/config`">
          <ActionButton variant="primary" @click="save">
            <icon :icon="['far', 'floppy-disk']" class="mr-1" />
            {{ $t("save") }}
          </ActionButton>

          <router-link :to="`/corpus/${corpusId}/delete`">
            <ActionButton variant="danger" class="ml-4">
              <icon :icon="['far', 'trash-can']" class="mr-1" />
              {{ $t("corpus.delete") }}
            </ActionButton>
          </router-link>
        </PendingContent>
      </div>
    </Section>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import ActionButton from "@/components/ActionButton.vue";
import Section from "@/components/Section.vue";
import PendingContent from "@/spin/PendingContent.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useConfig from "./config.composable";
import { FORMATS_EXT, SEGMENTERS } from "@/api/corpusConfig";
import TaggedInput from "./TaggedInput.vue";
import useMessenger from "@/message/messenger.composable";

const router = useRouter();
const corpusId = useCorpusIdParam();
const { config, uploadConfig } = useConfig(corpusId);
const { alert } = useMessenger();

const name = ref({ ...config.value?.name });
const description = ref({ ...config.value?.description });
const format = ref(config.value?.format);
const textAnnotation = ref(config.value?.textAnnotation);
const sentenceSegmenter = ref(config.value?.sentenceSegmenter || "");
const datetimeFrom = ref(config.value?.datetimeFrom);
const datetimeTo = ref(config.value?.datetimeTo);

async function save() {
  const corpusIdFixed = corpusId;
  const configNew = {
    name: name.value,
    description: description.value,
    format: format.value,
    textAnnotation: textAnnotation.value,
    sentenceSegmenter: sentenceSegmenter.value,
    datetimeFrom: datetimeFrom.value,
    datetimeTo: datetimeTo.value,
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
