<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  on: {
    type: String,
  },
});
const store = useStore();
const pending = computed(() => store.state.pending);
const isPending = computed(() => pending.value.includes(props.on));
</script>

<template>
  <div :class="{ 'animate-pulse': isPending }">
    <slot />
  </div>
</template>
