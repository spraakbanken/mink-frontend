<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <table v-if="config" class="w-full my-4">
      <tbody>
        <tr>
          <th>{{ $t("name") }}</th>
          <td><ValuesByKey :values="config.name" /></td>
        </tr>
        <tr>
          <th>{{ $t("description") }}</th>
          <td><ValuesByKey :values="config.description" /></td>
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
import ValuesByKey from "@/components/ValuesByKey.vue";

const { corpusId } = useCorpusIdParam();
const { config, loadConfig } = useConfig();

loadConfig();
</script>

<style></style>
