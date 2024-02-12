<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import usePageTitle from "./title.composable";

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

const crumbs = computed(() =>
  getInits(route.path)
    .map((path) => {
      const route = resolve(path);
      return { path, title: getTitle(route), name: route.name };
    })
    .filter((crumb) => crumb.name != "notfound" && crumb.title),
);
</script>

<template>
  <div v-if="crumbs.length > 1" class="container opacity-70">
    <template v-for="(crumb, i) in crumbs" :key="i">
      <template v-if="i"> &raquo; </template>
      <router-link :to="crumb.path" class="text-inherit hover:underline">
        {{ crumb.title }}
      </router-link>
    </template>
  </div>
</template>
