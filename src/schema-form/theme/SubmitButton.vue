<script setup lang="ts">
import { type SubmitButtonProps } from "@rjsf/utils";
import ActionButton from "@/components/ActionButton.vue";

defineProps<SubmitButtonProps>();
</script>

<template>
  <ActionButton v-bind="$props" class="button-primary">
    {{ $t("save") }}
  </ActionButton>
</template>
