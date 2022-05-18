<template>
  <PendingContent :on="`corpus/${corpusId}/exports`">
    <Section title="result">
      <div v-if="result.length === 0">
        Waiting for the annotation to complete.
      </div>
      <div v-else>
        <table class="w-full mt-4">
          <thead>
            <tr>
              <!--<th v-for="(value, source) in result[0]" :key="source">{{ source ? source : 'Download' }}</th>-->
              <th>{{ $t("fileName") }}</th>
              <th>{{ $t("fileType") }}</th>
              <th>{{ $t("lastModify") }}</th>
              <th>{{ $t("fileSize") }}</th>
              <th>{{ $t("xml") }} {{ $t("file") }}</th>
              <th>{{ $t("txt") }} {{ $t("file") }}</th>
            </tr>
          </thead>
          <tbody class="border-b-0">
            <tr v-for="source in result" :key="source">
              <td>
                {{ source.name.replace("_export.xml", "") }}
              </td>
              <td>
                {{ source.type }}
              </td>
              <td>
                {{
                  source.last_modified.split("T")[0] +
                  " " +
                  source.last_modified.split("T")[1].split("+")[0]
                }}
              </td>
              <td>{{ (source.size / 1000).toFixed(1) }} {{ "KB" }}</td>
              <td>
                <ActionButton
                  class="mute slim hover:bg-green-200"
                  @click="downloadSingleFileXML(source.name)"
                >
                  <img src="@/assets/xml-file.svg" class="h-7 opacity-75" />
                </ActionButton>
              </td>
              <td>
                <ActionButton
                  class="mute slim hover:bg-green-200"
                  @click="downloadSingleFileTxt(source.name)"
                >
                  <img src="@/assets/download.svg" class="h-7 opacity-75" />
                </ActionButton>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <ActionButton
          v-if="exports && exports.length"
          class="mr-2 bg-green-200 border-green-300"
          @click="download1"
        >
          <div class="flex">
            {{ $t("download") }} {{ $t("corpus") }}
            <img src="@/assets/zip.svg" class="h-5 opacity-75 pl-2" />
          </div>
        </ActionButton>
      </div>
    </Section>
  </PendingContent>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "@/components/layout/ActionButton.vue";
import { onMounted } from "@vue/runtime-core";
import PendingContent from "@/components/PendingContent.vue";
import Section from "@/components/layout/Section.vue";
import useExports from "@/composables/exports";

const store = useStore();
const { corpusId } = useCorpusIdParam();
const result = computed(() => store.state.corpora[corpusId.value]?.exports);
const {
  loadExports,
  exports,
  downloadResult,
  downloadFileXML,
  downloadFileTxt,
} = useExports();

onMounted(() => loadExports());

async function downloadSingleFileXML(fileName) {
  downloadFileXML(fileName);
}

async function downloadSingleFileTxt(fileName) {
  downloadFileTxt(fileName.replace("_export.xml", ".txt"));
}

async function download1() {
  downloadResult();
}
</script>

<style></style>
