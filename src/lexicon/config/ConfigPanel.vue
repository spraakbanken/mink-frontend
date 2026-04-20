<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { computed } from "vue";
import { parseConfig } from "./lexiconConfig";
import useLocale from "@/i18n/locale.composable";
import PendingContent from "@/spin/PendingContent.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import { useConfigStore } from "@/store/config.store";

const props = defineProps<{
  id: string;
}>();

const { loadConfig } = useConfigStore();
const { th } = useLocale();

const config = computedAsync(() => loadConfig("lexicon", props.id));

const configOptions = computed(() =>
  config.value != null ? parseConfig(config.value) : undefined,
);
</script>

<template>
  <PendingContent :on="`${id}/config`">
    <table class="w-full">
      <tbody>
        <tr>
          <th>{{ $t("name") }}</th>
          <td>
            {{ th(configOptions?.name) || "—" }}
          </td>
        </tr>
        <tr>
          <th>{{ $t("description") }}</th>
          <td>
            {{ th(configOptions?.description) || "—" }}
          </td>
        </tr>
        <tr>
          <th>{{ $t("identifier") }}</th>
          <td>
            <TerminalOutput class="inline leading-loose">
              {{ id }}
            </TerminalOutput>
          </td>
        </tr>
      </tbody>
    </table>
  </PendingContent>
</template>
