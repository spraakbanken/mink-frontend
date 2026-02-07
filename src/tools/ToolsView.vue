<script setup lang="ts">
import HelpBox from "@/components/HelpBox.vue";
import PageTitle from "@/components/PageTitle.vue";
</script>

<template>
  <PageTitle>{{ $t("tools") }}</PageTitle>

  <ul class="flex flex-col gap-4">
    <li>
      <HelpBox>
        <h3 class="text-2xl">
          <router-link to="/tools/metadata-editor">
            {{ $t("metadata_editor") }}
          </router-link>
        </h3>
        <p>
          {{ $t("metadata_editor.summary") }}
        </p>
      </HelpBox>
    </li>
  </ul>
</template>
