<template>
  <PendingContent :on="`corpus/${corpusId}/sources`">
    <Filedrop @drop="uploadDrop">
      <table v-if="sources.length" class="w-full mt-4">
        <thead>
          <tr>
            <th>{{ $t("fileName") }}</th>
            <th>{{ $t("fileType") }}</th>
            <th>{{ $t("lastModify") }}</th>
            <th>{{ $t("fileSize") }}</th>
            <th>{{ $t("deleteFile") }}</th>
          </tr>
        </thead>
        <tbody class="border-b-0">
          <tr v-for="source in sources" :key="source">
            <td>
              <router-link :to="`/corpus/${corpusId}/sources/${source.name}`">
                <a @click="changeShowText(source.name)">{{ source.name }}</a>
              </router-link>
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
              <!--class="text-right"-->
              <ActionButton
                class="mute slim hover:bg-red-200"
                @click="remove(source)"
              >
                <img src="@/assets/trash-can.svg" class="h-7 opacity-75" />
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-blue-50 border-blue-100 border-dashed border-4">
        <label class="absolute uppercase opacity-75 text-sm font-bold p-1">
          {{ $t("addFile") }}
        </label>
        <div class="p-8 flex justify-center items-center">
          {{ $t("dragANDdrop") }}:
          <input type="file" class="ml-2" @change="uploadSingle" />
        </div>
      </div>
    </Filedrop>
  </PendingContent>
</template>

<script setup>
import useSources from "@/composables/sources";
import useCorpusIdParam from "@/composables/corpusIdParam";
import ActionButton from "./layout/ActionButton.vue";
import Filedrop from "./Filedrop.vue";
import { onMounted } from "@vue/runtime-core";
import PendingContent from "./PendingContent.vue";
import { useStore } from "vuex";
import useExports from "@/composables/exports";

const { sources, loadSources, remove, upload } = useSources();
const { corpusId } = useCorpusIdParam();
const store = useStore();
const { contentViewX } = useExports();

onMounted(() => {
  loadSources();
});

function uploadDrop(files) {
  upload(files);
}

function uploadSingle(event) {
  upload(event.target.files);
}

function changeShowText(fileName) {
  store.commit("removeText");
  contentViewX(fileName);
}
</script>

<style></style>
