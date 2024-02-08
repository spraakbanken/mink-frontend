<script setup lang="ts">
import useLocale from "@/i18n/locale.composable";
import PadButton from "@/components/PadButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import CorpusButton from "./CorpusButton.vue";
import { useAuth } from "@/auth/auth.composable";
import SourceUpload from "@/corpus/sources/SourceUpload.vue";
import PageTitle from "@/components/PageTitle.vue";
import HelpBox from "@/components/HelpBox.vue";
import useCorpora from "@/corpora/corpora.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useSpin from "@/spin/spin.composable";
import useCreateCorpus from "@/corpus/createCorpus.composable";
import RouteButton from "@/components/RouteButton.vue";

const corpusStore = useCorpusStore();
const { requireAuthentication, isAuthenticated } = useAuth();
const { loadCorpora } = useCorpora();
const { createFromUpload } = useCreateCorpus();
const { spin } = useSpin();
const { th } = useLocale();

requireAuthentication(loadCorpora);

async function createCorpusFromFiles(files: FileList) {
  await spin(createFromUpload(files), null, "create");
}
</script>

<template>
  <PageTitle>{{ $t("library") }}</PageTitle>
  <LayoutSection v-if="isAuthenticated" :title="$t('corpuses')">
    <HelpBox>
      <p>
        {{
          corpusStore.hasCorpora
            ? $t("library.help.corpora")
            : $t("library.help.corpora.none")
        }}
      </p>
    </HelpBox>

    <PendingContent on="corpora" class="flex flex-wrap -mx-2">
      <CorpusButton
        v-for="(corpus, corpusId) of corpusStore.corpora"
        :id="corpusId"
        :key="corpusId"
      />

      <PadButton to="/corpus/new">
        <icon :icon="['far', 'square-plus']" size="2xl" class="mb-2" />
        {{ $t("new_corpus") }}
      </PadButton>
    </PendingContent>
  </LayoutSection>

  <LayoutSection :title="$t('metadata')">
    <div class="flex flex-wrap gap-2">
      <template v-for="(metadata, id) of corpusStore.metadatas" :key="id">
        <RouteButton :to="`/resource/${id}`">
          {{ th(metadata.name) || id }}
        </RouteButton>
      </template>
    </div>
  </LayoutSection>

  <LayoutSection v-if="isAuthenticated" :title="$t('new_corpus')">
    <PendingContent on="create" blocking>
      <SourceUpload
        :file-handler="createCorpusFromFiles"
        :primary="!corpusStore.hasCorpora"
      />
    </PendingContent>
  </LayoutSection>
</template>
