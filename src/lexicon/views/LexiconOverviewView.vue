<script setup lang="ts">
import { PhTrash } from "@phosphor-icons/vue";
import { useUserStore } from "@/store/user.store";
import LayoutBox from "@/components/LayoutBox.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import SharingPanel from "@/auth/SharingPanel.vue";
import JobStatusPanel from "@/job/JobStatusPanel.vue";
import RouteButton from "@/components/RouteButton.vue";
import { useAppConfig } from "@/app/useAppConfig.ts";

const { appConfig } = useAppConfig();
const id = useResourceIdParam();
const { canAdmin } = useUserStore();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="grid lg:grid-cols-2 gap-2">
      <LayoutBox :title="$t('checklist')">
        <LexiconChecklist :id />
      </LayoutBox>

      <LayoutBox :title="$t('job.process')">
        <JobStatusPanel :id />
      </LayoutBox>

      <LayoutBox v-if="appConfig.sharing" :title="$t('sharing')">
        <SharingPanel resource-type="lexicon" :id />
      </LayoutBox>
    </div>

    <div class="flex justify-center items-baseline gap-4">
      <RouteButton
        :disabled="!canAdmin('lexicon', id)"
        :to="`/library/lexicon/${id}/delete`"
        class="button-danger"
      >
        <PhTrash weight="fill" class="inline mb-1 mr-1" />
        {{ $t("delete") }}
      </RouteButton>
    </div>
  </div>
</template>
