<template>
  <div v-if="config">
    <Section :title="$t('metadata')">
      <table class="w-full my-4">
        <thead></thead>
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("name") }}</th>
            <td>
              <ValuesByKey :values="name">
                <template v-slot:swe>
                  <input v-model="name.swe" class="border w-72 p-1" />
                </template>
                <template v-slot:eng>
                  <input v-model="name.eng" class="border w-72 p-1" />
                </template>
              </ValuesByKey>
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("description") }}</th>
            <td>
              <ValuesByKey :values="description">
                <template v-slot:swe>
                  <textarea
                    v-model="description.swe"
                    class="border w-full p-1 h-20"
                  />
                </template>
                <template v-slot:eng>
                  <textarea
                    v-model="description.eng"
                    class="border w-full p-1 h-20"
                  />
                </template>
              </ValuesByKey>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
    <Section :title="$t('configuration')">
      <table class="w-full my-4">
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
          <tr v-show="format === 'xml'">
            <th class="lg:w-1/6">
              <label for="textAnnotation">{{ $t("text_annotation") }}:</label>
            </th>
            <td class="">
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
        </tbody>
      </table>
    </Section>
    <Section>
      <div class="flex justify-around">
        <PendingContent :on="`corpus/${corpusId}/config`">
          <ActionButton class="mr-2 bg-blue-100 border-blue-200" @click="save">
            {{ $t("saveConfig") }}
          </ActionButton>
        </PendingContent>
      </div>
    </Section>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { putConfig } from "@/assets/api";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import PendingContent from "@/components/PendingContent.vue";
import { useStore } from "vuex";
import useConfig from "@/composables/config";
import { useRouter } from "vue-router";
import ValuesByKey from "@/components/ValuesByKey.vue";
import { FORMATS_EXT, makeConfig } from "@/assets/corpusConfig";

const router = useRouter();
const store = useStore();
const { spin } = useSpin();
const { corpusId } = useCorpusIdParam();
const { config, loadConfig } = useConfig();
const name = ref(config.value?.name);
const description = ref(config.value?.description);
const format = ref(config.value?.format);
const textAnnotation = ref("");

if (!config.value) {
  loadConfig();
}

async function save() {
  const configNew = {
    name: name.value,
    description: description.value,
    format: format.value,
    textAnnotation: textAnnotation.value,
  };
  const configYaml = makeConfig(corpusId.value, configNew);
  await spin(
    putConfig(corpusId.value, configYaml),
    "Sparar konfiguration",
    `corpus/${corpusId.value}/config`
  );
  store.commit("setConfig", { corpusId: corpusId.value, config: configNew });
  router.push(`/corpus/${corpusId.value}`);
}
</script>

<style></style>
