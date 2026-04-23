<script setup lang="ts">
import { useRouter } from "vue-router";
import { PhPlusCircle } from "@phosphor-icons/vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
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
import { SOURCE_FORMATS } from "@/file";
import UploadSizeLimits from "@/sources/UploadSizeLimits.vue";
import useMessenger from "@/message/messenger.composable";
import { isCorpus, isMetadata } from "@/store/resource.types";
import { getFilenameExtension } from "@/util";

const router = useRouter();
const resourceStore = useResourceStore();
const { adminMode, checkAdminMode } = useAdmin();
const { canUserAdmin } = useAuth();
const { createCorpusFromUpload } = useCreateCorpus();
const { spin } = useSpin();
const { alert, alertError } = useMessenger();
const { t } = useI18n();
const { th } = useLocale();

const { loadResources } = resourceStore;
const { resources } = storeToRefs(resourceStore);

/** Resource objects as a list with each id as a member */
const resourcesList = computed(() => {
  const entries = Object.entries(resources.value);
  return entries.map(([id, resource]) => ({ id, ...resource }));
});

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

const corpora = computed(() => resourcesList.value.filter(isCorpus));
const metadatas = computed(() => resourcesList.value.filter(isMetadata));

async function fileHandler(files: File[]) {
  // Silently abort if no files
  if (!files[0]) return;

  // Find file extension; assume all are same, otherwise the upload will fail with a message
  const ext = getFilenameExtension(files[0].name);

  // Create a resource matching the file type
  if (SOURCE_FORMATS.corpus.find((format) => format == ext)) {
    await spin(createCorpusFromUpload(files), "create").catch(alertError);
  } else {
    alert(t("upload.format_unknown", { ext }), "error");
  }
}
</script>

<template>
  <div v-if="!adminMode">
    <PageTitle>{{ $t("library") }}</PageTitle>
    <LayoutSection :title="$t('corpora')">
      <HelpBox>
        <p>
          {{
            corpora.length
              ? $t("library.help.corpora")
              : $t("library.help.corpora.none")
          }}
        </p>
      </HelpBox>

      <PendingContent on="resources" class="my-4 flex flex-wrap gap-4">
        <CorpusButton v-for="{ id } of corpora" :key="id" :id />

        <PadButton to="/library/corpus/new">
          <PhPlusCircle size="2em" class="mb-2" />
          {{ $t("corpus.new") }}
        </PadButton>
      </PendingContent>
    </LayoutSection>

    <LayoutSection :title="$t('corpus.new')">
      <PendingContent on="create" blocking>
        <FileUpload
          :file-handler
          :primary="!corpora.length"
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
        <template v-for="{ id, ...metadata } of metadatas" :key="id">
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
