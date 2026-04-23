<script setup lang="ts">
import { useRouter } from "vue-router";
import { PhPlusCircle } from "@phosphor-icons/vue";
import { storeToRefs } from "pinia";
import CorpusButton from "@/library/CorpusButton.vue";
import useLocale from "@/i18n/locale.composable";
import PadButton from "@/components/PadButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useAdmin from "@/user/admin.composable";
import { useAuth } from "@/auth/auth.composable";
import PageTitle from "@/components/PageTitle.vue";
import HelpBox from "@/components/HelpBox.vue";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import useCreateCorpus from "@/corpus/createCorpus.composable";
import FileUpload from "@/components/FileUpload.vue";
import UploadSizeLimits from "@/corpus/sources/UploadSizeLimits.vue";
import useMessenger from "@/message/messenger.composable";
import { useMetadataStore } from "@/store/metadata.store";
import { useCorpusStore } from "@/store/corpus.store";
import { SOURCE_FORMATS } from "@/file";

const router = useRouter();
const { loadResources } = useResourceStore();
const { corpora, hasCorpora } = storeToRefs(useCorpusStore());
const { metadatas } = storeToRefs(useMetadataStore());
const { adminMode, checkAdminMode } = useAdmin();
const { canUserAdmin } = useAuth();
const { createFromUpload } = useCreateCorpus();
const { spin } = useSpin();
const { alertError } = useMessenger();
const { th } = useLocale();

// Only load full resource list if not admin
(async () => {
  if (canUserAdmin.value) {
    // Make sure user is not in admin mode before proceeding to load all full resources
    const adminMode = await checkAdminMode();
    if (adminMode) {
      router.push("/admin/resources");
      return;
    }
  }

  loadResources().catch(alertError);
})();

async function fileHandler(files: File[]) {
  await spin(createFromUpload(files), "create").catch(alertError);
}
</script>

<template>
  <div v-if="!adminMode">
    <PageTitle>{{ $t("library") }}</PageTitle>
    <LayoutSection :title="$t('corpora')">
      <HelpBox>
        <p>
          {{
            hasCorpora
              ? $t("library.help.corpora")
              : $t("library.help.corpora.none")
          }}
        </p>
      </HelpBox>

      <PendingContent on="resources" class="my-4 flex flex-wrap gap-4">
        <CorpusButton v-for="(corpus, id) of corpora" :key="id" :id />

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
          :primary="!hasCorpora"
          :accept="Object.values(SOURCE_FORMATS).flat()"
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
        <template v-for="(metadata, id) of metadatas" :key="id">
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
