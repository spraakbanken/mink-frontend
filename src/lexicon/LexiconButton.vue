<script setup lang="ts">
import { useLexicon } from "./lexicon.composable";
import PadButton from "@/components/PadButton.vue";
import useLocale from "@/i18n/locale.composable";

const props = defineProps<{
  id: string;
}>();

const { th } = useLocale();

const { lexicon } = useLexicon(props.id);
</script>

<template>
  <PadButton class="flex" :to="`/library/corpus/${id}`">
    <strong>{{ th(lexicon?.name) || id }}</strong>
  </PadButton>
</template>
