<template>
  <PageTitle>{{ $t("library") }}</PageTitle>
  <Section v-if="isAuthenticated" :title="$t('corpuses')">
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
  </Section>
  <Section v-if="isAuthenticated" :title="$t('new_corpus')">
    <PendingContent on="create">
      <SourceUpload
        :file-handler="createCorpusFromFiles"
        :variant="corpusStore.hasCorpora ? null : 'primary'"
      />
    </PendingContent>
  </Section>
</template>

<script setup>
import PadButton from "@/components/PadButton.vue";
import Section from "@/components/Section.vue";
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

const corpusStore = useCorpusStore();
const { requireAuthentication, isAuthenticated } = useAuth();
const { loadCorpora } = useCorpora();
const { createFromUpload } = useCreateCorpus();
const { spin } = useSpin();

requireAuthentication(loadCorpora);

async function createCorpusFromFiles(files) {
  await spin(createFromUpload(files), null, "create");
}
</script>
