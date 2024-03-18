<script setup lang="ts">
import { computed } from "vue";
import useSources from "@/corpus/sources/sources.composable";
import SourceUpload from "@/corpus/sources/SourceUpload.vue";
import useMinkBackendInfo from "@/api/backendInfo.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import { useCorpusState } from "@/corpus/corpusState.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { sources, deleteSource } = useSources(corpusId);
const { isEmpty } = useCorpusState(corpusId);
const { info } = useMinkBackendInfo();
const { filesize } = useLocale();

const totalSize = computed(() =>
  sources.value.reduce((sum, source) => sum + Number(source.size), 0),
);
</script>

<template>
  <div class="flex flex-wrap gap-x-8">
    <span>{{ $t("files", sources.length) }}, {{ filesize(totalSize) }}</span>
    <span v-if="info">
      {{ $t("source.limit.corpus.recommended") }}:
      {{ filesize(info.recommended_file_size.min_file_length.value) }}
    </span>
    <span v-if="info">
      {{ $t("source.limit.corpus.max") }}:
      {{ filesize(info.file_size_limits.max_corpus_length.value) }}
    </span>
  </div>
  <PendingContent :on="`corpus/${corpusId}/sources`">
    <table v-if="sources.length" class="w-full mt-4 striped">
      <thead>
        <tr>
          <th class="w-full">{{ $t("fileName") }}</th>
          <th class="text-right">{{ $t("fileSize") }}</th>
          <th />
        </tr>
      </thead>
      <tbody class="border-b-0">
        <tr v-for="source in sources" :key="source.path">
          <td>
            <router-link
              :to="`/library/corpus/${corpusId}/sources/${source.name}`"
            >
              {{ source.name }}
            </router-link>
          </td>
          <td class="text-right whitespace-nowrap">
            {{ filesize(source.size) }}
          </td>
          <td class="text-right">
            <ActionButton
              class="button-danger button-mute button-slim"
              @click="deleteSource(source)"
            >
              <icon :icon="['far', 'trash-can']" />
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </table>
  </PendingContent>

  <PendingContent :on="`corpus/${corpusId}/sources`" blocking>
    <SourceUpload :primary="isEmpty" />
  </PendingContent>
</template>
