<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import { onMounted, ref } from "vue";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import HelpBox from "@/components/HelpBox.vue";
import PageTitle from "@/components/PageTitle.vue";
import { emptyConfig, makeConfig } from "@/api/corpusConfig";
import { useApi } from "@/api/useApi";
import type { JobInfo } from "@/api/api.types";
import { useSparv } from "@/corpus/sparv.composable";
import ProgressBar from "@/components/ProgressBar.vue";
import ActionButton from "@/components/ActionButton.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import { useJobStatus } from "@/job/jobStatus.composable";
import JobStatusMessage from "@/job/JobStatusMessage.vue";

type Form = {
  source: string;
};

const { loadDefaultAnnotations } = useSparv();
const api = useApi();

const sampleRaw = `
Ikea (namnet är bildat av initialerna för Ingvar Kamprad Elmtaryd Agunnaryd) är ett multinationellt
möbelföretag som grundades 1943 av Ingvar Kamprad. Bolaget ägs av en stiftelse i Nederländerna som
i sin tur ägs av stiftelsen Interogo i Luxemburg, men kontrolleras alltjämt av familjen Kamprad.
Under verksamhetsåret 2012 omsatte Ikeakoncernen 241 miljarder kronor. 2008 hade koncernen omkring
135 000 anställda i 45 länder. Huvudkontoret för Sverige ligger i Helsingborg. I Helsingborg sitter
idag också många av de globala ledningsfunktionerna för hela koncernen (marknadsföring, juridik,
information med flera). Dessa kommer dock flytta ner till Malmö 1 september 2015, då ett nytt
kontor med plats för 800 anställda står klart i Vintrie park bredvid varuhuset på Svågertorp.`;
const sample = sampleRaw.replaceAll(/\n/g, " ").trim();

/** Corpus id, assigned when starting the job */
const id = ref<string>();

const configYaml = ref<string>();

const job = ref<JobInfo<"corpus">>();

const { currentStatus, isRunning } = useJobStatus(job);

// Initiate default config
onMounted(async () => {
  const defaultConfig = await makeDefaultConfig();
  if (!configYaml.value) configYaml.value = defaultConfig;
});

/** Build default config YAML */
async function makeDefaultConfig() {
  const annotations = await loadDefaultAnnotations();
  const config = {
    ...emptyConfig(),
    annotations,
  };
  return makeConfig("demo", config);
}

/** Handle submitting the form */
async function submit(fields: Form) {
  const configYamlValue = configYaml.value || (await makeDefaultConfig());
  const data = await api.demoCorpusRun(fields.source, configYamlValue);
  id.value = data.resource.id;
  job.value = data.job;
}

async function abort() {}
</script>

<template>
  <div>
    <PageTitle>{{ $t("demo") }}</PageTitle>

    <HelpBox>
      <p>
        <i18n-t keypath="demo.help" scope="global">
          <template #sparv>
            <a :href="$t('sparv.url')" target="_blank">Sparv</a>
          </template>
          <template #login>
            <router-link to="/login">{{ $t("login.lower") }}</router-link>
          </template>
        </i18n-t>
      </p>
    </HelpBox>

    <FormKitWrapper>
      <FormKit
        type="form"
        :submit-label="$t('corpus.sparv.run')"
        :submit-attrs="{
          inputClass: 'mink-button button-primary',
        }"
        @submit="submit"
      >
        <FormKit
          name="source"
          :label="$t('demo.source')"
          :help="$t('demo.source.help')"
          type="textarea"
          :value="sample"
          input-class="w-full h-60"
        />
      </FormKit>
    </FormKitWrapper>

    <LayoutBox
      v-if="job?.progress"
      :title="$t('job.status')"
      class="max-w-2xl mx-auto bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
    >
      <template #controls>
        <JobStatusMessage :status="currentStatus" />
        <ActionButton :disabled="!isRunning" @click="abort()">
          {{ $t("job.abort") }}
        </ActionButton>
      </template>

      <div class="flex flex-wrap justify-center items-center gap-4">
        <ProgressBar
          :percent="parseInt(job.progress)"
          :running="isRunning"
          class="grow"
        />
      </div>
    </LayoutBox>
  </div>
</template>
