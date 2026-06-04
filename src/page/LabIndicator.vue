<script lang="ts" setup>
import { PhFlask } from "@phosphor-icons/vue";
import { computed } from "vue";
import { useAppConfig } from "@/app/useAppConfig";

const { appConfig, minkUrl } = useAppConfig();

/** Whether configured main URL is different from current */
const isMain = computed(
  () => !appConfig.minkUrl || appConfig.minkUrl == minkUrl,
);
</script>

<template>
  <div
    class="w-sm self-end-safe bg-amber-100 border-2 border-amber-300 dark:bg-zinc-900 dark:border-0 dark:text-amber-400 p-1 rounded-sm cursor-help flex items-center gap-3"
  >
    <PhFlask weight="bold" class="shrink-0 text-2xl text-amber-400" />

    <div>
      <h3>{{ $t("lab.title") }}</h3>

      <p class="my-0">
        {{ $t("lab.description") }}
        <a v-if="!isMain" :href="appConfig.minkUrl">
          {{ $t("lab.goto_mink") }}
        </a>
      </p>
    </div>
  </div>
</template>
