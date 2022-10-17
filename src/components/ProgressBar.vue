<template>
  <div class="inline-block bg-slate-700 rounded h-6 relative overflow-hidden">
    <div
      class="bg-orange-400 h-6 absolute"
      :style="{ width: percent + '%' }"
    ></div>
    <div class="text-white text-center relative z-10">
      {{ percentStr }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";

const props = defineProps({
  percent: Number,
  validator: (x) => x >= 0 && x <= 100,
});

const { locale } = useI18n();
const percentStr = computed(() =>
  Intl.NumberFormat(locale, { style: "percent" }).format(props.percent / 100)
);
</script>

<style></style>
