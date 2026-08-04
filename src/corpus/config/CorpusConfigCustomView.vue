<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import HelpBox from "@/components/HelpBox.vue";
import { useApi } from "@/api/useApi";
import ResourceConfigCustom from "@/resource/ResourceConfigCustom.vue";

const id = useResourceIdParam();
const api = useApi();

const schema = computedAsync(() => api.sparvSchema());
</script>

<template>
  <ResourceConfigCustom type="corpus" :id :schema>
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
  </ResourceConfigCustom>
</template>
