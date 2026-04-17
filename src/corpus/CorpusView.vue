<script setup lang="ts">
import { ref } from "vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import PageTitle from "@/components/PageTitle.vue";
import useLocale from "@/i18n/locale.composable";
import { useResourceStore } from "@/store/resource.store";
import { type Corpus } from "@/store/resource.types";
import useMessenger from "@/message/messenger.composable";
import useNotFound from "@/components/notfound.composable";

const id = useResourceIdParam();
const { loadTypedResource } = useResourceStore();
const { th } = useLocale();
const { alertError } = useMessenger();
const { handle404 } = useNotFound();

const corpus = ref<Corpus>();

loadTypedResource("corpus", id)
  .then((resource) => (corpus.value = resource))
  .catch(handle404)
  .catch(alertError);
</script>

<template>
  <PageTitle subtitle="corpus">
    <router-link
      v-if="$route.path != `/library/corpus/${id}`"
      :to="`/library/corpus/${id}`"
      class="text-inherit no-underline hover:underline"
    >
      {{ th(corpus?.name) || id }}
    </router-link>
    <template v-else>
      {{ th(corpus?.name) || id }}
    </template>
  </PageTitle>
  <router-view v-if="corpus" />
</template>
