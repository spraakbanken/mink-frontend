<template>
  <Section :title="$t('corpuses')">
    <Help>
      <p>
        {{
          corpusStore.hasCorpora
            ? $t("home.help.corpora")
            : $t("home.help.corpora.none")
        }}
      </p>
    </Help>

    <PendingContent
      v-if="isAuthenticated"
      on="corpora"
      class="flex flex-wrap -mx-2"
    >
      <router-link
        v-for="(corpus, corpusId) of corpusStore.corpora"
        :key="corpusId"
        v-slot="{ navigate }"
        :to="`/corpus/${corpusId}`"
        custom
      >
        <CorpusButton :id="corpusId" @click="navigate" />
      </router-link>
      <router-link v-slot="{ navigate }" to="/corpus/new" custom>
        <PadButton @click="navigate">
          <icon :icon="['far', 'square-plus']" size="2xl" class="mb-2" />
          {{ $t("new_corpus") }}
        </PadButton>
      </router-link>
    </PendingContent>
  </Section>
  <Section :title="$t('new_corpus')">
    <SourceUpload
      :file-handler="createCorpusFromFiles"
      :variant="corpusStore.hasCorpora ? null : 'primary'"
    />
  </Section>
</template>

<script setup>
import PadButton from "@/components/PadButton.vue";
import Section from "@/components/Section.vue";
import PendingContent from "@/spin/PendingContent.vue";
import CorpusButton from "./CorpusButton.vue";
import { useAuth } from "@/auth/auth.composable";
import SourceUpload from "@/corpus/sources/SourceUpload.vue";
import Help from "@/components/Help.vue";
import useCorpora from "@/corpora/corpora.composable";
import { useCorpusStore } from "@/store/corpus.store";

const corpusStore = useCorpusStore();
const { requireAuthentication, isAuthenticated } = useAuth();
const { loadCorpora, createFromUpload } = useCorpora();

requireAuthentication().then(() => loadCorpora());

async function createCorpusFromFiles(files) {
  await createFromUpload(files);
}
</script>
