<script setup lang="ts">
import useLocale from "@/i18n/locale.composable";
import PadButton from "@/components/PadButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useResources from "./resources.composable";
import CorpusButton from "./CorpusButton.vue";
import { useAuth } from "@/auth/auth.composable";
import SourceUpload from "@/corpus/sources/SourceUpload.vue";
import PageTitle from "@/components/PageTitle.vue";
import HelpBox from "@/components/HelpBox.vue";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import useCreateCorpus from "@/corpus/createCorpus.composable";

const resourceStore = useResourceStore();
const { requireAuthentication, isAuthenticated, canUserAdmin } = useAuth();
const { loadResources } = useResources();
const { createFromUpload } = useCreateCorpus();
const { spin } = useSpin();
const { th } = useLocale();

requireAuthentication(loadResources);

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
          resourceStore.hasCorpora
            ? $t("library.help.corpora")
            : $t("library.help.corpora.none")
        }}
      </p>
    </HelpBox>

    <PendingContent on="corpora" class="my-4 flex flex-wrap gap-4">
      <CorpusButton
        v-for="(corpus, corpusId) of resourceStore.corpora"
        :id="corpusId"
        :key="corpusId"
      />

      <PadButton to="/library/corpus/new">
        <icon :icon="['far', 'square-plus']" size="2xl" class="mb-2" />
        {{ $t("new_corpus") }}
      </PadButton>
    </PendingContent>
  </LayoutSection>

  <LayoutSection v-if="canUserAdmin" :title="$t('metadata')">
    <HelpBox>
      <p>{{ $t("library.help.metadata") }}</p>
    </HelpBox>

    <div class="my-4 flex flex-wrap gap-4">
      <template v-for="(metadata, id) of resourceStore.metadatas" :key="id">
        <PadButton :to="`/library/metadata/${id}`">
          <strong>{{ th(metadata.name) || id }}</strong>
          {{ metadata.publicId }}
        </PadButton>
      </template>

      <PadButton to="/library/metadata/new">
        <icon :icon="['far', 'square-plus']" size="2xl" class="mb-2" />
        {{ $t("metadata.new") }}
      </PadButton>
    </div>
  </LayoutSection>

  <LayoutSection v-if="isAuthenticated" :title="$t('new_corpus')">
    <PendingContent on="create" blocking>
      <SourceUpload
        :file-handler="createCorpusFromFiles"
        :primary="!resourceStore.hasCorpora"
      />
    </PendingContent>
  </LayoutSection>
</template>
