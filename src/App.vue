<script setup>
import { computed, ref } from "@vue/reactivity";
import { initialize } from "./assets/api";
import store from "./store";
import { listen } from "@/assets/spin";
import Spinner from "@/components/Spinner.vue";

const auth = computed(() => store.state.auth);
const spinning = ref(null);

listen((messages) => (spinning.value = messages));

// Initialize API client.
if (auth.value) {
  initialize(auth.value.username, auth.value.password);
}
</script>

<template>
  <header class="p-2 flex justify-between items-center flex-wrap">
    <div class="text-4xl">
      <router-link to="/" class="text-current">Min språkbank</router-link>
    </div>
    <div class="h-12 flex items-center">
      <div
        v-if="spinning"
        class="messages mx-2 self-start h-full overflow-auto text-right text-xs"
      >
        <div v-for="message in spinning" :key="message">{{ message }}</div>
      </div>
      <div class="mx-2" v-if="spinning">
        <Spinner />
      </div>
      <div class="mx-2 w-56">
        <a href="https://spraakbanken.gu.se/">
          <img src="@/assets/sbx1r.svg" />
        </a>
      </div>
    </div>
  </header>
  <div class="p-2">
    <router-view />
  </div>
</template>

<style scoped>
.messages {
  scrollbar-width: none;
}
.messages::-webkit-scrollbar {
  width: 0;
}
</style>
