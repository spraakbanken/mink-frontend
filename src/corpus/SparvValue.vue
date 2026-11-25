<script lang="ts" setup>
const props = defineProps<{
  type: string;
  value: string;
}>();

let main = props.value;

const [, mainNew, score] = props.value.match("(.*):([-0-9.e]+)$") || [];
if (score) main = mainNew;

const parts = main.split("+");
</script>

<template>
  <div>
    <template v-for="(part, i) in parts" :key="i">
      <template v-if="i > 0">+</template>
      <span>{{ part }}</span>
    </template>
    <template v-if="score">
      <span class="opacity-70">({{ score }})</span>
    </template>
  </div>
</template>
