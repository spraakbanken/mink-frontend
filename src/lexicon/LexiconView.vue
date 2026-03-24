<script setup lang="ts">
import { ref } from "vue";
import useNotFound from "@/components/notfound.composable";
import PageTitle from "@/components/PageTitle.vue";
import useLocale from "@/i18n/locale.composable";
import useMessenger from "@/message/messenger.composable";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import { isLexicon, type Lexicon } from "@/store/resource.types";
import { useResourceStore } from "@/store/resource.store";

const id = useResourceIdParam();
const { loadResource } = useResourceStore();
const { th } = useLocale();
const { alertError } = useMessenger();
const { handle404 } = useNotFound();

const lexicon = ref<Lexicon>();

loadResource(id)
  .then((resource) => {
    if (!isLexicon(resource)) throw new Error("Resource is not lexicon");
    lexicon.value = resource;
  })
  .catch(handle404)
  .catch(alertError);
</script>

<template>
  <PageTitle subtitle="lexicon">
    <router-link
      v-if="$route.path != `/library/lexicon/${id}`"
      :to="`/library/lexicon/${id}`"
      class="text-inherit no-underline hover:underline"
    >
      {{ th(lexicon?.name) || id }}
    </router-link>
    <template v-else>
      {{ th(lexicon?.name) || id }}
    </template>
  </PageTitle>
  <router-view v-if="lexicon" />
</template>
