<template>
  <Section v-if="isAuthenticated" :title="$t('corpuses')">
    <HelpBox>
      <p>
        {{
          corpusStore.hasCorpora
            ? $t("dashboard.help.corpora")
            : $t("dashboard.help.corpora.none")
        }}
      </p>
    </HelpBox>

    <PendingContent on="corpora" class="flex flex-wrap -mx-2">
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
import HelpBox from "@/components/HelpBox.vue";
import useCorpora from "@/corpora/corpora.composable";
import { useCorpusStore } from "@/store/corpus.store";
import useSpin from "@/spin/spin.composable";

const corpusStore = useCorpusStore();
const { requireAuthentication, isAuthenticated } = useAuth();
const { loadCorpora, createFromUpload } = useCorpora();
const { spin } = useSpin();

requireAuthentication(loadCorpora);

async function createCorpusFromFiles(files) {
  await spin(createFromUpload(files), null, "create");
}
</script>
