<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  percent: number;
}>();

const { locale } = useI18n();
const percentStr = computed(() =>
  Intl.NumberFormat(locale.value, { style: "percent" }).format(
    props.percent / 100,
  ),
);
</script>

<template>
  <div
    class="inline-block bg-slate-500 rounded-sm h-6 relative text-center overflow-hidden"
  >
    <div
      class="bg-sborange-600 h-6 absolute"
      :style="{ width: percent + '%' }"
    ></div>
    <div class="font-semibold text-white relative z-10">
      <span class="bg-zinc-700/40 rounded-sm px-1">
        {{ percentStr }}
      </span>
    </div>
  </div>
</template>
