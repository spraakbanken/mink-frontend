<script setup lang="ts">
import { useRouter } from "vue-router";
import { PhPlusCircle } from "@phosphor-icons/vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";
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
import { FORMATS_EXT } from "@/api/corpusConfig";
import UploadSizeLimits from "@/corpus/sources/UploadSizeLimits.vue";
import { isCorpus, type Resource } from "@/store/resource.types";
import CorpusStateMessage from "@/corpus/CorpusStateMessage.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import RouteButton from "@/components/RouteButton.vue";

const router = useRouter();
const resourceStore = useResourceStore();
const { adminMode, checkAdminMode } = useAdmin();
const { canUserAdmin } = useAuth();
const { createFromUpload } = useCreateCorpus();
const { spin } = useSpin();
const { th } = useLocale();

const { hasResources, resources } = storeToRefs(resourceStore);

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

  resourceStore.loadResources();
})();

const accept = computed(() => FORMATS_EXT.map((ext) => `.${ext}`).join());

async function fileHandler(files: File[]) {
  await spin(createFromUpload(files), "create");
}

const getType = (resource: object | Resource) =>
  "type" in resource ? resource.type : "resource";
</script>

<template>
  <div v-if="!adminMode">
    <PageTitle>{{ $t("library") }}</PageTitle>

    <div class="flex dflex-col flex-wrap 2xl:flex-nowrap items-start gap-4">
      <LayoutBox :title="$t('resources')" class="min-w-2xl grow">
        <table v-if="hasResources" class="w-full my-4">
          <thead class="bg-zinc-200">
            <tr>
              <th class="p-2">{{ $t("name") }}</th>
              <th>{{ $t("type") }}</th>
              <th>{{ $t("status") }}</th>
            </tr>
          </thead>
          <tbody>
            <router-link
              v-for="(resource, id) in resources"
              :key="id"
              custom
              v-slot="{ navigate }"
              :to="`/library/${getType(resource)}/${id}`"
            >
              <tr
                @click="navigate"
                class="cursor-pointer border border-zinc-200"
              >
                <td class="p-2">
                  <router-link :to="`/library/${getType(resource)}/${id}`">
                    {{ ("type" in resource && th(resource.name)) || id }}
                  </router-link>
                </td>
                <td>{{ $t(getType(resource)) }}</td>
                <td>
                  <CorpusStateMessage
                    v-if="isCorpus(resource)"
                    :corpus-id="id"
                  />
                </td>
              </tr>
            </router-link>
          </tbody>
        </table>

        <HelpBox v-if="hasResources">
          {{ $t("library.help.resources") }}
        </HelpBox>
        <HelpBox v-else important>{{
          $t("library.help.resources.none")
        }}</HelpBox>
      </LayoutBox>

      <LayoutBox :title="$t('resource_new')" class="min-w-md grow">
        <div class="my-4">
          <RouteButton
            to="/library/resource/new"
            :class="{ 'button-primary': !hasResources }"
          >
            <PhPlusCircle weight="bold" class="inline mb-1 mr-1" />
            {{ $t("resource_new") }}
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
