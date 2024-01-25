<script setup lang="ts">
import useMessenger, { type MessageLevel } from "./messenger.composable";

const props = defineProps<{
  message: string;
  level: MessageLevel;
}>();

const { alert } = useMessenger();

alert(props.message, props.level);
</script>

<template>
  <!-- Template has no effect, but Vue will warn in console if omitted. -->
  <div class="message-alert"></div>
</template>
