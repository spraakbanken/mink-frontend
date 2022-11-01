<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <table v-if="config" class="w-full">
      <tbody>
        <tr>
          <th>{{ $t("description") }}</th>
          <td>
            {{ th(config.description) }}
          </td>
        </tr>
        <tr>
          <th>{{ $t("identifier") }}</th>
          <td>
            <TerminalOutput class="inline leading-loose">
              {{ corpusId }}
            </TerminalOutput>
          </td>
        </tr>
      </tbody>
    </table>
  </PendingContent>
</template>

<script setup>
import useConfig from "@/composables/config";
import useCorpusIdParam from "@/composables/corpusIdParam";
import PendingContent from "./PendingContent.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useTh from "@/composables/th";

const { corpusId } = useCorpusIdParam();
const { config, loadConfig } = useConfig();
const { th } = useTh();

loadConfig();
</script>

<style></style>
