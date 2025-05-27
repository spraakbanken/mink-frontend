<script setup lang="ts">
import { useRouter } from "vue-router";
import { PhPlusCircle } from "@phosphor-icons/vue";
import { computed } from "vue";
import { watchImmediate } from "@vueuse/core";
import CorpusButton from "@/library/CorpusButton.vue";
import useLocale from "@/i18n/locale.composable";
import PadButton from "@/components/PadButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useAdmin from "@/user/admin.composable";
import PageTitle from "@/components/PageTitle.vue";
import HelpBox from "@/components/HelpBox.vue";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import useCreateCorpus from "@/corpus/createCorpus.composable";
import FileUpload from "@/components/FileUpload.vue";
import { FORMATS_EXT } from "@/api/corpusConfig";
import UploadSizeLimits from "@/corpus/sources/UploadSizeLimits.vue";
import { useCorpusStore } from "@/store/corpus.store";

const router = useRouter();
const resourceStore = useResourceStore();
const corpusStore = useCorpusStore();
const { adminMode } = useAdmin();
const { createFromUpload } = useCreateCorpus();
const { spin } = useSpin();
const { th } = useLocale();

// Skip loadResources if admin, as it gets very slow when listing all resources!
// When `checkAdminMode()` is done, `adminMode` will go from undefined to true or false.
watchImmediate(adminMode, () => {
  if (adminMode.value) router.push("/admin/resources");
  else if (adminMode.value === false) {
    // `loadResourceIds` has less information, but it is faster and will update UI sooner.
    resourceStore.loadResourceIds();
    resourceStore.loadResources();
  }
});

const accept = computed(() => FORMATS_EXT.map((ext) => `.${ext}`).join());

async function fileHandler(files: File[]) {
  await spin(createFromUpload(files), "create");
}
</script>

<template>
  <div v-if="!adminMode">
    <PageTitle>{{ $t("library") }}</PageTitle>
    <LayoutSection :title="$t('corpuses')">
      <HelpBox>
        <p>
          {{
            corpusStore.hasCorpora
              ? $t("library.help.corpora")
              : $t("library.help.corpora.none")
          }}
        </p>
      </HelpBox>

      <PendingContent on="corpora" class="my-4 flex flex-wrap gap-4">
        <CorpusButton
          v-for="(corpus, corpusId) of corpusStore.corpora"
          :id="corpusId"
          :key="corpusId"
        />

        <PadButton to="/library/corpus/new">
          <PhPlusCircle size="2em" class="mb-2" />
          {{ $t("new_corpus") }}
        </PadButton>
      </PendingContent>
    </LayoutSection>

    <LayoutSection :title="$t('new_corpus')">
      <PendingContent on="create" blocking>
        <FileUpload
          :file-handler
          :primary="!corpusStore.hasCorpora"
          :accept
          multiple
          show-progress
        >
          <UploadSizeLimits />
        </FileUpload>
      </PendingContent>
    </LayoutSection>

    <LayoutSection :title="$t('metadata')">
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
          <PhPlusCircle size="2em" class="mb-2" />
          {{ $t("metadata.new") }}
        </PadButton>
      </div>
    </LayoutSection>
  </div>
</template>
