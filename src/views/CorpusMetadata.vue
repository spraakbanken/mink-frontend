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
            <th class="lg:w-1/6">{{ $t("identifier") }}</th>
            <td>
              <code>{{ corpusId }}</code>
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("description") }}</th>
            <td><ValuesByKey :values="config.description" /></td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("fileFormat") }}</th>
            <td>
              {{ $t(config.format) }} (<code>.{{ config.format }}</code
              >)
            </td>
          </tr>
          <tr v-if="config.textAnnotation">
            <th class="lg:w-1/6">{{ $t("text_annotation") }}</th>
            <td>
              <code>{{ config.textAnnotation }}</code>
            </td>
          </tr>
        </tbody>
      </table>

      <router-link :to="`/corpus/${corpusId}/config`">
        <ActionButton class="bg-blue-100 border-blue-200 mr-4">
          {{ $t("edit") }}
        </ActionButton>
      </router-link>

      <ActionButton @click="deleteCorpus" class="bg-red-200 border-red-300">
        {{ $t("deleteCorpus") }}
      </ActionButton>
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

const router = useRouter();
const store = useStore();
const { spin } = useSpin();
const { corpusId } = useCorpusIdParam();
const { config, loadConfig } = useConfig();

loadConfig();

async function deleteCorpus() {
  const token = `corpus/${corpusId.value}`;
  store.commit("removeCorpus", corpusId.value);
  router.push("/");
  await spin(removeCorpus(corpusId.value), "Raderar korpus", token);
}
</script>

<style></style>
