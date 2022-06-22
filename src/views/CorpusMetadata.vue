<template>
  <PendingContent :on="`corpus/${corpusId}`">
    <Section :title="$t('metadata')">
      <table v-if="config" class="table-fixed w-full my-4">
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("name") }}</th>
            <td><ValuesByKey :values="config.name" /></td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("description") }}</th>
            <td><ValuesByKey :values="config.description" /></td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("identifier") }}</th>
            <td>
              <code>{{ corpusId }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
    <Section :title="$t('configuration')">
      <table v-if="config" class="table-fixed w-full my-4">
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("fileFormat") }}</th>
            <td>
              <span v-if="config.format">
                {{ $t(config.format) }}
                (<code>.{{ config.format }}</code
                >)
              </span>
            </td>
          </tr>
          <tr v-if="config.textAnnotation">
            <th class="lg:w-1/6">{{ $t("text_annotation") }}</th>
            <td>
              <code>{{ config.textAnnotation }}</code>
            </td>
          </tr>
          <tr v-if="config.format != 'xml'">
            <th class="lg:w-1/6">{{ $t("segmenter_sentence") }}</th>
            <td>
              {{
                config.sentenceSegmenter
                  ? $t(`segmenter_${config.sentenceSegmenter}`)
                  : $t("none")
              }}
            </td>
          </tr>
          <tr>
            <th>{{ $t("timespan") }}</th>
            <td>
              <span v-if="config.datetimeFrom || config.datetimeTo">
                {{ config.datetimeFrom }} – {{ config.datetimeTo }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-center">
        <router-link :to="`/corpus/${corpusId}/config`">
          <ActionButton variant="primary" class="mr-4">
            {{ $t("edit") }}
          </ActionButton>
        </router-link>
        <ActionButton variant="danger" @click="deleteCorpus">
          {{ $t("deleteCorpus") }}
        </ActionButton>
      </div>
    </Section>
  </PendingContent>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { removeCorpus } from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import PendingContent from "@/components/PendingContent.vue";
import useConfig from "@/composables/config";
import ValuesByKey from "@/components/ValuesByKey.vue";
import { useI18n } from "vue-i18n";

const router = useRouter();
const store = useStore();
const { spin } = useSpin();
const { corpusId } = useCorpusIdParam();
const { config, loadConfig } = useConfig();
const { t } = useI18n();

loadConfig();

async function deleteCorpus() {
  const token = `corpus/${corpusId.value}`;
  store.commit("removeCorpus", corpusId.value);
  await spin(removeCorpus(corpusId.value), t("corpus.deleting"), token);
  router.push("/");
}
</script>

<style></style>
