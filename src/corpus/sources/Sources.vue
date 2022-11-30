<template>
  <PendingContent :on="`corpus/${corpusId}/sources`">
    <SourceUpload :variant="isEmpty ? 'primary' : null">
      <table v-if="sources.length" class="w-full mt-4 striped">
        <thead>
          <tr>
            <th class="w-full">{{ $t("fileName") }}</th>
            <th class="text-right">{{ $t("fileSize") }}</th>
            <th />
          </tr>
        </thead>
        <tbody class="border-b-0">
          <tr v-for="source in sources" :key="source">
            <td>
              <router-link :to="`/corpus/${corpusId}/sources/${source.name}`">
                {{ source.name }}
              </router-link>
            </td>
            <td class="text-right whitespace-nowrap">
              {{ (source.size / 1000).toFixed(1) }} KB
            </td>
            <td class="text-right">
              <ActionButton
                variant="danger"
                class="mute slim"
                @click="deleteSource(source)"
              >
                <icon :icon="['far', 'trash-can']" />
              </ActionButton>
            </td>
          </tr>
        </tbody>
      </table>
    </SourceUpload>
  </PendingContent>
</template>

<script setup>
import useSources from "./sources.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import SourceUpload from "./SourceUpload.vue";

const corpusId = useCorpusIdParam();
const { sources, deleteSource } = useSources(corpusId);
const { isEmpty } = useCorpusState(corpusId);
</script>

<style></style>
