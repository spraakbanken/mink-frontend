<script setup lang="ts">
import {
  PhCircleNotch,
  PhWarning,
  PhWarningOctagon,
} from "@phosphor-icons/vue";

export type Tab = {
  path: string;
  label: string;
  loading?: boolean;
  error?: boolean;
  warning?: boolean;
};

defineProps<{
  routes: Tab[];
}>();
</script>

<template>
  <nav>
    <ul class="flex flex-wrap border-b border-zinc-300 dark:border-zinc-700">
      <router-link
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        custom
        v-slot="{ isActive, href, navigate }"
      >
        <li
          class="-mb-0.5 border border-b-0 text-lg"
          :class="
            isActive
              ? 'rounded-t-sm bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 overflow-hidden'
              : 'border-transparent'
          "
        >
          <a
            :href
            @click="navigate"
            class="inline-block p-2 px-3 font-medium underline-offset-4 decoration-2"
            :class="isActive ? '' : 'no-underline hover:underline'"
          >
            {{ route.label }}

            <PhCircleNotch
              v-if="route.loading"
              class="inline ml-0.5 mb-1 animate-spin text-lime-600"
            />
            <PhWarningOctagon
              v-else-if="route.error"
              class="inline ml-0.5 mb-1 text-red-600 dark:text-red-400"
            />
            <PhWarning
              v-else-if="route.warning"
              class="inline ml-0.5 mb-1 text-yellow-500"
            />
          </a>
        </li>
      </router-link>
    </ul>
  </nav>
</template>
