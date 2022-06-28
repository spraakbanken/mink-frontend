<template>
  <PageTitle>{{ $t("new_corpus") }}</PageTitle>
  <Section>
    <PendingContent on="create">
      <table class="w-full my-4">
        <tbody>
          <tr>
            <th class="lg:w-1/6">
              <label for="name">{{ $t("name") }}</label>
            </th>
            <td>
              <input id="name" v-model="name" class="border w-72 p-1" />
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">
              <label for="description">{{ $t("description") }}</label>
            </th>
            <td>
              <textarea
                v-model="description"
                class="block border w-full p-1 h-20"
              />
            </td>
          </tr>
          <tr>
            <th class="lg:w-1/6">
              <label for="fileFormat">{{ $t("fileFormat") }}</label>
            </th>
            <td>
              <select
                id="fileFormat"
                v-model="fileFormat"
                class="border w-72 p-1"
              >
                <option v-for="ext in FORMATS_EXT" :value="ext">
                  {{ $t(ext) }} (.{{ ext }})
                </option>
              </select>
            </td>
          </tr>
          <tr v-show="fileFormat === 'xml'">
            <th class="lg:w-1/6">
              <label for="textAnnotation">{{ $t("text_annotation") }}:</label>
            </th>
            <td>
              <input
                id="textAnnotation"
                v-model="textAnnotation"
                :required="fileFormat === 'xml'"
                class="border w-72 p-1"
              />
              <div class="text-sm py-1">
                {{ $t("text_annotation_help") }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center">
        <ActionButton variant="primary" @click="submit">
          <icon :icon="['far', 'floppy-disk']" class="mr-1" />
          {{ $t("save") }}
        </ActionButton>
      </div>
    </PendingContent>
  </Section>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { api } from "@/assets/api";
import { useRouter } from "vue-router";
import useSpin from "@/assets/spin";
import PageTitle from "@/components/PageTitle.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import Section from "@/components/layout/Section.vue";
import { useStore } from "vuex";
import PendingContent from "@/components/PendingContent.vue";
import { FORMATS_EXT, makeConfig } from "@/assets/corpusConfig";
import { checkLogin } from "@/auth";
import { useJwt } from "@/composables/jwt";
import { sleep } from "@/util";
import { useI18n } from "vue-i18n";

const router = useRouter();
const store = useStore();
const { spin } = useSpin();
const { refreshJwt } = useJwt();
const { t } = useI18n();

const name = ref("");
const description = ref("");
const fileFormat = ref("txt");
const textAnnotation = ref("");
const message = ref(null);

async function submit() {
  const langify = (str) => ({ swe: str, eng: str });
  const config = {
    name: langify(name.value),
    description: langify(description.value),
    format: fileFormat.value,
    textAnnotation: textAnnotation.value,
  };

  try {
    const corpusId = await spin(
      api.createCorpus(),
      t("corpus.creating"),
      "create"
    );
    store.commit("addCorpus", corpusId);

    // Update JWT
    await refreshJwt();

    // Wait until JWT is updated to include the new corpus...
    await sleep(2000);
    const jwt = await checkLogin();
    store.commit("setJwt", jwt);
    // Wait until the watcher in App.vue has configured Axios requests...
    await sleep(100);

    const configYaml = makeConfig(corpusId, config);
    await spin(
      api.putConfig(corpusId, configYaml),
      "Konfigurerar korpus",
      `corpus/${corpusId}/config`
    );
    store.commit("setConfig", { corpusId, config });
    router.push(`/corpus/${corpusId}`);
  } catch (reason) {
    message.value = reason.response ? reason.response.data.message : reason;
  }
}
</script>

<style scoped>
th,
td {
  @apply align-baseline;
}
</style>
