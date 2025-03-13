<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import usePageTitle from "@/page/title.composable";

const route = useRoute();
const { resolve } = useRouter();
const { getTitle } = usePageTitle();

/** Get a list of parent paths of the specified path, e.g. ["/", "/foo", "/foo/bar"] */
function getInits(path: string): string[] {
  const inits = [];
  for (const seg of path.split("/").filter(Boolean)) {
    const prevInit: string = inits[inits.length - 1] || "";
    inits.push(prevInit + "/" + seg);
  }
  return ["/", ...inits];
}

const crumbs = ref<{ path: string; title: string }[]>([]);

watch(
  () => route.path,
  async () => {
    crumbs.value = [];
    for (const path of getInits(route.path)) {
      const route = resolve(path);
      const title = await getTitle(route);
      if (title && route.name != "notfound") {
        crumbs.value.push({ path, title });
      }
    }
  },
);
</script>

<template>
  <div v-if="crumbs.length > 1" class="container opacity-70">
    <template v-for="(crumb, i) in crumbs" :key="i">
      <template v-if="i"> &raquo; </template>
      <router-link
        :to="crumb.path"
        class="text-inherit no-underline hover:underline font-normal"
      >
        {{ crumb.title }}
      </router-link>
    </template>
  </div>
</template>
