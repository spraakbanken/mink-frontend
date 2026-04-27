<script setup lang="ts" generic="T extends ResourceType">
/** Template for the parent view of routes for a given resource */
import { ref } from "vue";
import PageTitle from "@/components/PageTitle.vue";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";
import useAlert from "@/alert/alert.composable";
import useNotFound from "@/components/notfound.composable";
import type { ResourceType } from "@/api/api.types";
import type { Resource } from "@/store/resource.types";

const props = defineProps<{
  type: T;
  id: string;
}>();

const { loadTypedResource } = useResourceStore();
const { th } = useLocale();
const { showAlert } = useAlert();
const { handle404 } = useNotFound();

const resource = ref<Resource<T>>();

loadTypedResource(props.type, props.id)
  .then((data) => (resource.value = data))
  .catch(handle404)
  .catch(showAlert);
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
  <router-view v-if="resource" />
</template>
