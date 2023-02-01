<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import usePageTitle from "./title.composable";

const route = useRoute();
const { resolve } = useRouter();
const { getTitle } = usePageTitle();
const { t, locale } = useI18n();
const crumbs = ref([]);

function getInits(path) {
  const inits = [];
  for (const seg of path.split("/").filter(Boolean)) {
    const prevInit = inits[inits.length - 1] || "";
    inits.push(prevInit + "/" + seg);
  }
  return inits;
}

function updateCrumbs() {
  const homeCrumb = { path: "/", title: t("home") };
  crumbs.value = getInits(route.path)
    .map((path) => {
      const route = resolve(path);
      return { path, title: getTitle(route), name: route.name };
    })
    .filter((crumb) => crumb.name != "notfound" && crumb.title);
  crumbs.value.unshift(homeCrumb);
}

watch(
  () => route.path,
  () => updateCrumbs()
);

watch(locale, () => updateCrumbs());
</script>

<template>
  <div class="container opacity-70">
    <template v-for="(crumb, i) in crumbs" :key="i">
      <template v-if="i"> &gt; </template>
      <router-link :to="crumb.path" class="text-inherit hover:underline">
        {{ crumb.title }}
      </router-link>
    </template>
  </div>
</template>
