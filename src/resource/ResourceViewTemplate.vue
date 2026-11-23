<script setup lang="ts" generic="T extends ResourceType">
/** Template for the parent view of routes for a given resource */
import { computed } from "vue";
import PageTitle from "@/components/PageTitle.vue";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";
import useAlert from "@/alert/alert.composable";
import useNotFound from "@/components/notfound.composable";
import type { ResourceType } from "@/api/api.types";
import type { Resource } from "@/store/resource.types";
import type { Tab } from "@/components/RouteTabs.vue";
import RouteTabs from "@/components/RouteTabs.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import usePageTitle from "@/page/title.composable";

const props = defineProps<{
  type: T;
  id: string;
  tabs?: Tab[];
}>();

const { resources, loadResource } = useResourceStore();
const { th } = useLocale();
const { showAlert } = useAlert();
const { handle404 } = useNotFound();
const { title } = usePageTitle();

const resource = computed(() => resources[props.id] as Resource<T> | undefined);

// Load resource if needed
if (!resource.value) loadResource(props.id).catch(handle404).catch(showAlert);
</script>

<template>
  <PageTitle :subtitle="type">
    <router-link
      v-if="$route.path != `/library/${type}/${id}`"
      :to="`/library/${type}/${id}`"
      class="text-inherit no-underline hover:underline"
    >
      {{ th(resource?.name) || id }}
    </router-link>
    <template v-else>
      {{ th(resource?.name) || id }}
    </template>
  </PageTitle>

  <template v-if="resource && tabs">
    <RouteTabs :routes="tabs" />

    <LayoutBox :aria-label="title">
      <router-view />
    </LayoutBox>
  </template>

  <router-view v-else-if="resource" />
</template>
