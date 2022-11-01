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
        <PadButton variant="primary" @click="navigate">
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
      <p>To start processing your text files, drop them in the area above.</p>
    </Help>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { api } from "@/assets/api";
import useSpin from "@/assets/spin";
import PadButton from "@/components/layout/PadButton.vue";
import Section from "@/components/layout/Section.vue";
import PendingContent from "@/components/PendingContent.vue";
import CorpusButton from "@/components/CorpusButton.vue";
import { useI18n } from "vue-i18n";
import { useJwt } from "@/composables/jwt";
import SourceUpload from "@/components/SourceUpload.vue";
import Help from "@/components/Help.vue";
import useSources from "@/composables/sources";
import { useRouter } from "vue-router";

const store = useStore();
const { spin } = useSpin();
const { t } = useI18n();
const { requireAuthentication, isAuthenticated } = useJwt();
const { upload } = useSources();
const router = useRouter();
const { refreshJwt } = useJwt();

const corpora = computed(() => store.state.corpora);
const hasCorpora = computed(() => !!Object.keys(store.state.corpora).length);

requireAuthentication().then(() => {
  spin(api.listCorpora(), t("corpus.list.loading"), "corpora").then(
    (corporaFetched) => {
      store.commit("setCorpora", corporaFetched);
    }
  );
});

async function createCorpusFromFiles(files) {
  const corpusId = await api.createCorpus();
  await refreshJwt();
  await upload(files, corpusId);
  router.push(`/corpus/${corpusId}`);
}
</script>
