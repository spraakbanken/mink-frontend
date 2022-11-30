<template>
  <Section v-if="hasCorpora" :title="$t('corpuses')">
    <PendingContent
      v-if="isAuthenticated"
      on="corpora"
      class="flex flex-wrap -mx-2"
    >
      <router-link
        v-for="(corpus, corpusId) of corpora"
        :key="corpusId"
        v-slot="{ navigate }"
        :to="`/corpus/${corpusId}`"
        custom
      >
        <CorpusButton :id="corpusId" @click="navigate" />
      </router-link>
      <router-link v-slot="{ navigate }" to="/corpus" custom>
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
      :variant="hasCorpora ? null : 'primary'"
    />
    <Help>
      <p>{{ t("home.help.upload") }}</p>
    </Help>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import PadButton from "@/components/PadButton.vue";
import Section from "@/components/Section.vue";
import PendingContent from "@/spin/PendingContent.vue";
import CorpusButton from "./CorpusButton.vue";
import { useJwt } from "@/auth/jwt.composable";
import SourceUpload from "@/corpus/sources/SourceUpload.vue";
import Help from "@/components/Help.vue";
import useCorpora from "@/corpora/corpora.composable";

const { t } = useI18n();
const store = useStore();
const { requireAuthentication, isAuthenticated } = useJwt();
const { loadCorpora, createFromUpload } = useCorpora();

const corpora = computed(() => store.state.corpora);
const hasCorpora = computed(() => !!Object.keys(store.state.corpora).length);

requireAuthentication().then((ok) => ok && loadCorpora());

async function createCorpusFromFiles(files) {
  createFromUpload(files);
}
</script>
