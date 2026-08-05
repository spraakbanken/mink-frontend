<script lang="ts" setup>
import SharingViewTemplate from "@/auth/SharingViewTemplate.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";

const id = useResourceIdParam();
</script>

<template>
  <SharingViewTemplate type="corpus" :id />
</template>
