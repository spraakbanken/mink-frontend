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
    <ul class="flex flex-wrap">
      <router-link
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        custom
        v-slot="{ isActive, href, navigate }"
      >
        <li>
          <a
            :href
            @click="navigate"
            class="inline-block p-2 text-lg font-medium no-underline border-primary-600"
            :class="{ 'text-primary-600 border-b-2': isActive }"
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
