<script setup lang="ts">
import { computed, ref } from "vue";
import { PhDownloadSimple, PhGearFine, PhInfo } from "@phosphor-icons/vue";
import { useLexicon } from "./lexicon.composable";
import ActionButton from "@/components/ActionButton.vue";
import PendingContent from "@/spin/PendingContent.vue";
import { useAuth } from "@/auth/auth.composable";
import useMessenger from "@/message/messenger.composable";
import useSources from "@/resource/sources.composable";
import useResource from "@/resource/resource.composable";

const props = defineProps<{
  id: string;
}>();

const { job, isRunning, runJob } = useResource(props.id);
const { exports } = useLexicon(props.id);
const { sources } = useSources("lexicon", props.id);
const { canWrite } = useAuth();
const { alertError } = useMessenger();

const isPending = ref(false);

const canRun = computed(
  () =>
    canWrite("lexicon", props.id) &&
    sources.value.length &&
    !isPending.value &&
    !isRunning.value,
);

async function doRunJob() {
  isPending.value = true;
  await runJob().catch(alertError);
  isPending.value = false;
}
</script>

<template>
  <div>
    <PendingContent
      :on="`${id}/job/run`"
      class="flex flex-col gap-3 items-stretch"
    >
      <div class="flex gap-3 items-center">
        <div>
          <div class="font-semibold">{{ $t("lexicon.karp_pipeline.run") }}</div>
          {{ $t("lexicon.karp_pipeline.help") }}
        </div>

        <ActionButton
          :disabled="!canRun"
          class="ms-auto"
          :class="{ 'button-primary': canRun && !exports?.length }"
          @click="canRun ? doRunJob() : null"
        >
          <PhGearFine weight="bold" class="inline mb-1 mr-1" />
          {{
            !exports?.length
              ? $t("lexicon.karp_pipeline.run")
              : $t("lexicon.karp_pipeline.rerun")
          }}
        </ActionButton>
      </div>

      <div>
        <div v-if="!isRunning && exports?.length" class="text-sm">
          <PhInfo class="inline mb-0.5 mr-1" />
          {{ $t("job.rerun.overwrite") }}
        </div>

        <div v-if="!isRunning && job?.status.karps == 'done'" class="text-sm">
          <PhInfo class="inline mb-0.5 mr-1" />
          {{ $t("job.rerun.tools_outdated") }}
        </div>
      </div>
    </PendingContent>

    <PendingContent :on="`${id}/exports/list`" class="mt-4">
      <h3 class="text-lg uppercase">{{ $t("download") }}</h3>
      <p>{{ $t("exports.download.help") }}</p>

      <table v-if="exports?.length">
        <tbody>
          <tr>
            <th>{{ $t("file.archive") }}</th>
            <td>
              <PendingContent :on="`${id}/exports/download`">
                TODO
                <!-- <ActionButton
                  :class="{ 'button-primary': !isRunning }"
                  @click="downloadResult().catch(alertError)"
                >
                  <PhDownloadSimple weight="bold" class="inline mb-0.5 mr-1" />
                  {{ getDownloadFilename() }}
                </ActionButton> -->
              </PendingContent>
            </td>
          </tr>
          <tr>
            <th>{{ $t("file.singles") }}</th>
            <td>
              <router-link :to="`/library/lexicon/${id}/exports`">
                {{ $t("show") }}…
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="opacity-70 italic">
        {{ $t("exports.download.placeholder") }}
      </p>
    </PendingContent>
  </div>
</template>
