<template>
  <PendingContent :on="`corpus/${corpusId}`">
    <Section v-if="config" title="metadata">
      <table class="table-fixed w-full my-4">
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("name") }}</th>
            <td>
              {{ th(config.name) }}
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("identifier") }}</th>
            <td>
              {{ corpusId }}
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("description") }}</th>
            <td>{{ th(config.description) }}</td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("fileFormat") }}</th>
            <td>{{ config.format }}</td>
          </tr>
        </tbody>
      </table>
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
import useTh from "@/composables/th";
import useConfig from "@/composables/config";

const router = useRouter();
const store = useStore();
const { spin } = useSpin();
const { corpusId } = useCorpusIdParam();
const { config, loadConfig } = useConfig();
const { th } = useTh();

loadConfig();

async function deleteCorpus() {
  const token = `corpus/${corpusId.value}`;
  store.commit("removeCorpus", corpusId.value);
  router.push("/");
  await spin(removeCorpus(corpusId.value), "Raderar korpus", token);
}
</script>

<style></style>
