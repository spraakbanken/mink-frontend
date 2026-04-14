<script setup lang="ts">
import { useRouter } from "vue-router";
import { PhPlusCircle, PhUsers } from "@phosphor-icons/vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import useLocale from "@/i18n/locale.composable";
import PendingContent from "@/spin/PendingContent.vue";
import useAdmin from "@/user/admin.composable";
import { useAuth } from "@/auth/auth.composable";
import PageTitle from "@/components/PageTitle.vue";
import HelpBox from "@/components/HelpBox.vue";
import { useResourceStore } from "@/store/resource.store";
import useSpin from "@/spin/spin.composable";
import useCreateCorpus from "@/corpus/createCorpus.composable";
import FileUpload from "@/components/FileUpload.vue";
import UploadSizeLimits from "@/sources/UploadSizeLimits.vue";
import { isCorpus, type Resource } from "@/store/resource.types";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import RouteButton from "@/components/RouteButton.vue";
import useMessenger from "@/message/messenger.composable";
import SortableTable from "@/components/SortableTable.vue";
import { SOURCE_FORMATS } from "@/file";

const router = useRouter();
const resourceStore = useResourceStore();
const { adminMode, checkAdminMode } = useAdmin();
const { canUserAdmin, isCurrentUser } = useAuth();
const { createFromUpload } = useCreateCorpus();
const { spin } = useSpin();
const { alertError } = useMessenger();
const { t, locale } = useI18n();
const { th } = useLocale();

const { loadResources } = resourceStore;
const { hasResources, resources } = storeToRefs(resourceStore);

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

const accept = computed(() => Object.values(SOURCE_FORMATS).flat());

async function fileHandler(files: File[]) {
  // TODO Detect what resource type to create
  await spin(createFromUpload(files), "create").catch(alertError);
}

const getType = (resource: Resource) =>
  "type" in resource ? resource.type : "resource";
</script>

<template>
  <div v-if="!adminMode">
    <PageTitle>{{ $t("library") }}</PageTitle>

    <div class="flex flex-col xl:flex-row xl:items-start gap-4">
      <LayoutBox :title="$t('resources')" class="flex-1">
        <PendingContent on="resources">
          <SortableTable
            :columns="[
              {
                title: $t('name'),
                comparator: (a, b) =>
                  (th(a.name) || a.id).localeCompare(
                    th(b.name) || b.id,
                    locale,
                  ),
              },
              {
                title: $t('type'),
                comparator: (a, b) =>
                  t(getType(a)).localeCompare(t(getType(b)), locale),
              },
              { title: $t('status') },
            ]"
            :rows="resourcesList"
            :get-row-key="(resource) => resource.id"
            :default-sort="{ title: $t('name'), reverse: false }"
            class="w-full my-4 striped"
          >
            <template #tr="{ row: resource }">
              <router-link
                custom
                v-slot="{ navigate }"
                :to="`/library/${getType(resource)}/${resource.id}`"
              >
                <tr @click="navigate" class="cursor-pointer">
                  <td class="py-2!">
                    <router-link
                      :to="`/library/${getType(resource)}/${resource.id}`"
                    >
                      {{ th(resource.name) || resource.id }}
                    </router-link>
                  </td>
                  <td>{{ $t(getType(resource)) }}</td>
                  <td>
                    <CorpusStateMessage
                      v-if="isCorpus(resource)"
                      :id="resource.id"
                    />

                    <!-- Shared icon if other owner -->
                    <PhUsers
                      v-if="!isCurrentUser(resource.owner)"
                      class="inline mx-1"
                    />
                  </td>
                </tr>
              </router-link>
            </template>
          </SortableTable>

          <HelpBox v-if="hasResources">
            {{ $t("library.help.resources") }}
          </HelpBox>
          <HelpBox v-else>{{ $t("library.help.resources.none") }}</HelpBox>
        </PendingContent>
      </LayoutBox>

      <LayoutBox :title="$t('resource_new')" class="flex-1">
        <div class="flex gap-3 items-center my-4">
          <div class="grow">
            <div class="font-semibold">{{ $t("corpus") }}</div>
            {{ $t("corpus.help") }}
          </div>
          <RouteButton
            to="/library/corpus/new"
            :class="{ 'button-primary': !hasResources }"
          >
            <PhPlusCircle weight="bold" class="inline mb-1 mr-1" />
            {{ $t("corpus.new") }}
          </RouteButton>
        </div>

        <div class="flex gap-3 items-center my-4">
          <div class="grow">
            <div class="font-semibold">{{ $t("lexicon") }}</div>
            {{ $t("lexicon.help") }}
          </div>
          <RouteButton
            to="/library/lexicon/new"
            :class="{ 'button-primary': !hasResources }"
          >
            <PhPlusCircle weight="bold" class="inline mb-1 mr-1" />
            {{ $t("lexicon.new") }}
          </RouteButton>
        </div>

        <div class="flex gap-3 items-center my-4">
          <div class="grow">
            <div class="font-semibold">{{ $t("metadata") }}</div>
            {{ $t("metadata.help") }}
          </div>
          <RouteButton
            to="/library/metadata/new"
            :class="{ 'button-primary': !hasResources }"
          >
            <PhPlusCircle weight="bold" class="inline mb-1 mr-1" />
            {{ $t("metadata.new") }}
          </RouteButton>
        </div>

        <PendingContent on="create" blocking>
          <FileUpload
            :file-handler
            :primary="!hasResources"
            :accept
            multiple
            show-progress
          >
            <UploadSizeLimits />
          </FileUpload>
        </PendingContent>
      </LayoutBox>
    </div>
  </div>
</template>
