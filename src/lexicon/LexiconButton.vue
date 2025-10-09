<script setup lang="ts">
import { computed } from "vue";
import PadButton from "@/components/PadButton.vue";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";

const props = defineProps<{
  id: string;
}>();

const { th } = useLocale();
const resourceStore = useResourceStore();

const lexicon = computed(() => resourceStore.lexicons[props.id]);
</script>

<template>
  <PadButton class="flex" :to="`/library/corpus/${id}`">
    <strong>{{ th(lexicon?.name) || id }}</strong>
  </PadButton>
</template>
