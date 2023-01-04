<template>
  <PendingContent :on="`corpus/${corpusId}/config`">
    <table v-if="config" class="w-full">
      <tbody>
        <tr>
          <th>{{ $t("description") }}</th>
          <td>
            {{ th(config.description) || "—" }}
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
import useConfig from "./config.composable";
import useCorpusIdParam from "@/corpus/corpusIdParam.composable";
import PendingContent from "@/spin/PendingContent.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useLocale from "@/i18n/locale.composable";

const corpusId = useCorpusIdParam();
const { config } = useConfig(corpusId);
const { th } = useLocale();
</script>

<style></style>
