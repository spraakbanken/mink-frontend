<script lang="ts" setup>
import { PhFlask } from "@phosphor-icons/vue";
import { useAppConfig } from "@/app/useAppConfig";
import { getBaseUrl } from "@/util";

const { minkUrl } = useAppConfig();
</script>

<template>
  <div
    class="w-sm self-end-safe bg-amber-100 border-2 border-amber-300 dark:bg-zinc-900 dark:border-0 dark:text-amber-400 p-1 rounded-sm cursor-help flex items-center gap-3"
  >
    <PhFlask weight="bold" class="shrink-0 text-2xl text-amber-400" />

    <div>
      <h4>{{ $t("lab.title") }}</h4>

      <p class="my-0">
        {{ $t("lab.description") }}
        <a v-if="minkUrl != getBaseUrl()" :href="minkUrl">
          {{ $t("lab.goto_mink") }}
        </a>
      </p>
    </div>
  </div>
</template>
