<script setup lang="ts">
import { useSparv } from "../sparv.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import HelpBox from "@/components/HelpBox.vue";
import ConfigCustomViewTemplate from "@/resource/ConfigCustomViewTemplate.vue";

const id = useResourceIdParam();
const { schema } = useSparv();
</script>

<template>
  <ConfigCustomViewTemplate type="corpus" :id :schema>
    <template #head>
      <HelpBox>
        <i18n-t scope="global" keypath="config.custom.help">
          <template #sparv>
            <a :href="$t('sparv.url')">Sparv</a>
          </template>
          <template #topic>
            <a
              href="https://spraakbanken.gu.se/sparv/user-manual/corpus-configuration/"
              target="_blank"
              >Corpus Configuration</a
            >
          </template>
        </i18n-t>
      </HelpBox>
    </template>
  </ConfigCustomViewTemplate>
</template>
