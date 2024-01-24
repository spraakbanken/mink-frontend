<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  percent: number;
}>();

const { locale } = useI18n();
const percentStr = computed(() =>
  Intl.NumberFormat(locale.value, { style: "percent" }).format(
    props.percent / 100
  )
);
</script>

<template>
  <div class="inline-block bg-slate-500 rounded h-6 relative overflow-hidden">
    <div
      class="bg-sborange h-6 absolute"
      :style="{ width: percent + '%' }"
    ></div>
    <div class="text-white text-center relative z-10">
      {{ percentStr }}
    </div>
  </div>
</template>
