<template>
  <div class="my-4 flex">
    <component
      :is="isRouteTexts ? 'div' : 'router-link'"
      :to="isRouteTexts || `/corpus/${corpusId}`"
      class="flex-1 text-sm p-2 rounded-xl border"
      :class="
        isRouteTexts
          ? 'bg-gray-100 border-transparent'
          : 'bg-white hover:bg-gray-100 border-gray-200 shadow-sm text-current'
      "
    >
      <h4 class="uppercase text-gray-600 text-base">Texter</h4>
      <div>6 MB</div>
      <div>20 dokument</div>
    </component>
    <div class="mx-2 text-4xl self-center">〉</div>
    <component
      :is="isRouteConfig ? 'div' : 'router-link'"
      :to="isRouteConfig || `/corpus/${corpusId}/config`"
      class="flex-1 text-sm p-2 rounded-xl border"
      :class="
        isRouteConfig
          ? 'bg-gray-100 border-transparent'
          : 'bg-white hover:bg-gray-100 border-gray-200 shadow-sm text-current'
      "
    >
      <h4 class="uppercase text-gray-600 text-base">Konfiguration</h4>
      <div>Saldo, namntaggning, CONLL-output</div>
    </component>
    <div class="mx-2 text-4xl self-center">〉</div>
    <div class="flex-1 text-sm p-2">
      <h4 class="uppercase text-gray-600 text-base">Analys</h4>
      <div class="flex justify-center items-center">
        <ActionButton class="bg-blue-100 border-blue-200">Kör</ActionButton>
      </div>
    </div>
    <div class="mx-2 text-4xl self-center">〉</div>
    <div class="flex-1 text-sm p-2">
      <h4 class="uppercase text-gray-600 text-base">Export</h4>
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useRoute } from "vue-router";
import ActionButton from "./layout/ActionButton.vue";

const route = useRoute();

const corpusId = computed(() => route.params.corpusId);
const currentPath = route.matched.pop()?.path;
const isRouteTexts = currentPath == "/corpus/:corpusId";
const isRouteConfig = currentPath == "/corpus/:corpusId/config";

const buttonMaybe = (isButton, to) =>
  isButton
    ? {
        name: "router-link",
        component: {
          to,
          attrs: {
            class: "bg-white border hover:bg-gray-100 shadow-sm text-current",
          },
        },
      }
    : {
        template: '<div class="bg-gray-100"><slot /></div>',
      };
</script>

<style></style>
