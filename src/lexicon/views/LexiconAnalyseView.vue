<script setup lang="ts">
import { computed, ref } from "vue";
import { PhGearFine } from "@phosphor-icons/vue";
import { useLexicon } from "../lexicon.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useUserStore } from "@/store/user.store";
import useMessenger from "@/alert/alert.composable";
import useSources from "@/resource/sources.composable";
import useResource from "@/resource/resource.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import HelpBox from "@/components/HelpBox.vue";

const id = useResourceIdParam();
const { job, isRunning, runJob } = useResource(id);
const { exports } = useLexicon(id);
const { sources } = useSources("lexicon", id);
const { canWrite } = useUserStore();
const { showAlert } = useMessenger();

const isPending = ref(false);

const canRun = computed(
  () =>
    canWrite("lexicon", id) &&
    sources.value.length &&
    !isPending.value &&
    !isRunning.value,
);

async function doRunJob() {
  isPending.value = true;
  await runJob().catch(showAlert);
  isPending.value = false;
}
</script>

<template>
  <div class="grid lg:grid-cols-2 gap-2">
    <PendingContent :on="`${id}/job/run`">
      <LayoutBox :title="$t('lexicon.karp_pipeline.run')">
        <div class="flex gap-3 items-center">
          <div class="grow grid gap-2">
            {{ $t("lexicon.karp_pipeline.help") }}

            <!-- Warnings -->
            <HelpBox v-if="exports?.length">
              <i18n-t keypath="job.rerun.overwrite" scope="global">
                <template #exports_link>
                  <router-link :to="`/library/lexicon/${id}/exports`">
                    {{ $t("job.rerun.overwrite.exports") }}
                  </router-link>
                </template>
              </i18n-t>
            </HelpBox>

            <HelpBox
              v-if="
                job?.status.karpred == 'done' || job?.status.karps == 'done'
              "
              important
            >
              <i18n-t keypath="job.rerun.tools_outdated" scope="global">
                <template #reinstall_link>
                  <router-link :to="`/library/lexicon/${id}/explore`">
                    {{ $t("job.rerun.tools_outdated.reinstall") }}
                  </router-link>
                </template>
              </i18n-t>
            </HelpBox>
          </div>

          <ActionButton
            :disabled="!canRun"
            class="ms-auto"
            :class="{
              'button-primary': canRun && job?.status.karp_pipeline != 'done',
            }"
            @click="canRun ? doRunJob() : null"
          >
            <PhGearFine weight="bold" class="inline mb-1 mr-1" />
            {{ $t("lexicon.karp_pipeline.run") }}
          </ActionButton>
        </div>
      </LayoutBox>
    </PendingContent>
  </div>
</template>
