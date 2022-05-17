<template>
  <Section title="configuration">
    <table class="w-full my-4">
      <thead></thead>
      <tbody>
        <tr>
          <th class="text-right">
            <label for="format">Format:</label>
          </th>
          <td>
            <select id="format" v-model="format">
              <option>txt</option>
              <option>xml</option>
            </select>
          </td>
        </tr>
        <tr>
          <th />
          <td class="py-4">
            <PendingContent :on="`corpus/${corpusId}/config`">
              <ActionButton
                @click="save"
                class="mr-2 bg-blue-100 border-blue-200"
              >
                {{ $t("saveConfig") }}
              </ActionButton>
            </PendingContent>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
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

const store = useStore();
const { spin } = useSpin();
const { corpusId } = useCorpusIdParam();
const format = ref("txt");
const configS = "Temp string"

async function save() {
  store.commit("setConfig", { corpusId: corpusId.value, config: configS})
  await spin(
    putConfig(corpusId.value, { format: format.value }),
    "Sparar konfiguration",
    `corpus/${corpusId.value}/config`
  );
  // TODO Set the config in store.
}
</script>

<style></style>
