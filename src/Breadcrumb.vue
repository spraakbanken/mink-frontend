<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import usePageTitle from "./title.composable";

const route = useRoute();
const { resolve } = useRouter();
const { getTitle } = usePageTitle();
const crumbs = ref([]);

function getInits(path) {
  const inits = [];
  for (const seg of path.split("/").filter(Boolean)) {
    const prevInit = inits[inits.length - 1] || "";
    inits.push(prevInit + "/" + seg);
  }
  return inits;
}

watch(
  () => route.path,
  () => {
    crumbs.value = getInits(route.path)
      .map((path) => {
        const route = resolve(path);
        console.log(route);
        return {
          path,
          title: getTitle(route),
          name: route.name,
        };
      })
      .filter((crumb) => crumb.name != "notfound" && crumb.title);
    console.log(crumbs.value);
  }
);
</script>

<template>
  <div class="container">
    <router-link to="/">
      {{ $t("home") }}
    </router-link>
    <template v-for="(crumb, i) in crumbs" :key="i">
      &gt;
      <router-link :to="crumb.path">
        {{ crumb.title }}
      </router-link>
    </template>
  </div>
</template>
