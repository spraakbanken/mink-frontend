<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { PhGearFine } from "@phosphor-icons/vue";
import { useAppConfig } from "@/app/useAppConfig";
import ActionButton from "@/components/ActionButton.vue";
import { useDemoStore } from "@/tools/demo/demo.store";

const { appConfig } = useAppConfig();
const router = useRouter();
const demoStore = useDemoStore();

const demoSettings = appConfig.tools?.demo;
const source = ref((demoSettings?.sample || "").trim());

/** Store the input and use it in the Demo view */
function run() {
  demoStore.source = source.value;
  router.push("/tools/demo");
}
</script>

<template>
  <div v-if="demoSettings">
    <h4>{{ $t("demo.preview") }}</h4>
    <div class="flex items-center gap-4">
      <textarea v-model="source" rows="4" class="grow" />

      <ActionButton class="button-primary" @click="run()">
        <PhGearFine weight="bold" class="inline mb-1 mr-1" />
        {{ $t("corpus.sparv.run") }}
      </ActionButton>
    </div>
  </div>
</template>
