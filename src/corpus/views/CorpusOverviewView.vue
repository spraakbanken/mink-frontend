<script setup lang="ts">
import { PhPencilSimple } from "@phosphor-icons/vue";
import { ref } from "vue";
import { useCorpus } from "../corpus.composable";
import ConfigPanel from "../ConfigPanel.vue";
import AnalysisPanel from "../AnalysisPanel.vue";
import ExplorePanel from "../ExplorePanel.vue";
import CorpusStateHelp from "../CorpusStateHelp.vue";
import SourcesPanel from "@/sources/SourcesPanel.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import SharingPanel from "@/auth/SharingPanel.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import JobStatusPanel from "@/job/JobStatusPanel.vue";
import { useUserStore } from "@/store/user.store";
import { useAppConfig } from "@/app/useAppConfig";
import TabsBar from "@/components/TabsBar.vue";
import TabsContent from "@/components/TabsContent.vue";

const id = useResourceIdParam();
const { appConfig, exploreTools } = useAppConfig();
const { isConfigValid, updateSourceFormat } = useCorpus(id);
const { canWrite } = useUserStore();

const tabSelected = ref("overview");
</script>

<template>
  <div>
    <TabsBar
      :tabs="[
        { key: 'overview', label: $t('overview') },
        { key: 'sources', label: $t('sources') },
        { key: 'config', label: $t('configuration') },
        { key: 'analysis', label: $t('analysis') },
        ...(exploreTools
          ? [{ key: 'explore', label: $t('exports.tools') }]
          : []),
      ]"
      v-model="tabSelected"
    />

    <TabsContent v-if="tabSelected == 'overview'" :title="$t('overview')">
      <CorpusStateHelp :id class="mb-4" />
      <div class="flex flex-wrap gap-2">
        <LayoutBox :title="$t('job.status')" class="w-96 grow">
          <JobStatusPanel :id />
        </LayoutBox>

        <LayoutBox
          v-if="appConfig.sharing"
          :title="$t('sharing')"
          class="w-96 grow"
        >
          <SharingPanel resource-type="corpus" :id />
        </LayoutBox>
      </div>
    </TabsContent>

    <TabsContent v-if="tabSelected == 'sources'" :title="$t('sources')">
      <SourcesPanel type="corpus" :id @upload="updateSourceFormat" />
    </TabsContent>

    <TabsContent v-if="tabSelected == 'config'" :title="$t('configuration')">
      <LayoutBox :title="$t('configuration')">
        <ConfigPanel :id />
        <template #controls>
          <router-link
            :to="`/library/corpus/${id}/config`"
            class="flex items-baseline"
            :class="{ 'link-primary': !isConfigValid }"
          >
            <template v-if="canWrite('corpus', id)">
              <PhPencilSimple weight="bold" class="self-center mr-1" />
              {{ $t("edit") }}
            </template>
            <template v-else>
              {{ $t("show_more") }}
            </template>
          </router-link>
        </template>
      </LayoutBox>
    </TabsContent>

    <TabsContent v-if="tabSelected == 'analysis'" :title="$t('analysis')">
      <AnalysisPanel :id />
    </TabsContent>

    <TabsContent v-if="tabSelected == 'explore'" :title="$t('exports.tools')">
      <ExplorePanel :id />
    </TabsContent>
  </div>
</template>
