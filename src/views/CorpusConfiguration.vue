<template>
  <div v-if="config">
    <Section :title="$t('metadata')">
      <table class="w-full my-4">
        <thead></thead>
        <tbody>
          <tr>
            <th class="lg:w-1/6">{{ $t("name") }}</th>
            <td>
              <input v-model="name" />
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">{{ $t("description") }}</th>
            <td><input v-model="description" /></td>
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
              <select id="format" v-model="format">
                <option>txt</option>
                <option>xml</option>
              </select>
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
import useTh from "@/composables/th";
import { parseConfig } from "@/assets/corpusConfig";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const { spin } = useSpin();
const { corpusId } = useCorpusIdParam();
const { config, loadConfig } = useConfig();
const { th } = useTh();
const name = ref(th(config.value.name));
const description = ref(th(config.value.description));
const format = ref(config.value.format);

if (!config.value) {
  loadConfig();
}

async function save() {
  const configNew = {
    name: name.value,
    description: description.value,
    format: format.value,
  };
  await spin(
    putConfig(corpusId.value, configNew),
    "Sparar konfiguration",
    `corpus/${corpusId.value}/config`
  );
  store.commit("setConfig", { corpusId: corpusId.value, config: configNew });
  router.push(`/corpus/${corpusId.value}`);
}
</script>

<style></style>
