<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import { computed, onMounted, ref, watch } from "vue";
import { useCounter, useInterval, useUrlSearchParams } from "@vueuse/core";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import HelpBox from "@/components/HelpBox.vue";
import PageTitle from "@/components/PageTitle.vue";
import { emptyConfig, makeConfig } from "@/api/corpusConfig";
import { useApi } from "@/api/useApi";
import type { JobInfo } from "@/api/api.types";
import { useSparv } from "@/corpus/sparv.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import { useJobStatus } from "@/job/jobStatus.composable";
import JobStatusPanelContent from "@/job/JobStatusPanelContent.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import useSpin from "@/spin/spin.composable";
import PendingContent from "@/spin/PendingContent.vue";
import MinkCodemirror from "@/components/MinkCodemirror.vue";

type Form = {
  source: string;
};

const { loadDefaultAnnotations } = useSparv();
const api = useApi();
const params = useUrlSearchParams();
const { spin } = useSpin();

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

/** Counter to trigger form re-render */
const counter = useCounter();

/** Corpus id, synced to URL param */
const id = computed({
  get: () => params.id as string | undefined,
  set: (value) => (value ? (params.id = value) : delete params.id),
});

/** Source text model */
const input = ref<string>();

/** Resulting exported XML */
const output = ref<string>();

/** Generated config YAML */
const configYaml = ref<string>();

const job = ref<JobInfo<"corpus">>();

const { currentStatus, isRunning } = useJobStatus(job);

/** A ticker for status polling */
const ticker = useInterval(2000);

// Initiate or restore state
onMounted(async () => {
  // If a previous id is given, try to load stored input from server
  const inputData = id.value
    ? await api.demoCorpusInputGet(id.value)
    : undefined;

  if (inputData) {
    input.value = inputData.input_text;
    configYaml.value = inputData.config;
  } else {
    // Otherwise load default input and config
    input.value = sample;
    configYaml.value = await makeDefaultConfig();
  }

  // FormKit elements will not react on value change from outside, so force the form to re-render
  counter.inc();

  // Get job status
  if (id.value) {
    job.value = await api.demoCorpusStatusGet(id.value);
  }
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
  const data = await spin(
    api.demoCorpusRun(fields.source, configYamlValue),
    "demo/job",
  );
  id.value = data.resource.id;
  job.value = data.job;
}

async function abort() {}

// Check status intermittently if active
watch(ticker, async () => {
  if (id.value && isRunning.value) {
    job.value = await api.demoCorpusStatusGet(id.value);
  }
});

// Load result when done; reset result when starting new analysis
watch(currentStatus, async () => {
  if (id.value && currentStatus.value == "done") {
    output.value = await spin(api.demoCorpusOutputGet(id.value), "demo/export");
  } else {
    output.value = undefined;
  }
});
</script>

<template>
  <div>
    <PageTitle>{{ $t("demo") }}</PageTitle>

    <!-- Help text -->
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

    <!-- Source text form with Analyse button -->
    <FormKitWrapper :key="counter.get()">
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
          :value="input"
          input-class="w-full h-60"
          @update="input = $event"
        />
      </FormKit>
    </FormKitWrapper>

    <!-- Job status -->
    <PendingContent on="demo/job">
      <LayoutBox
        v-if="id && job?.progress"
        :title="$t('job.status')"
        class="max-w-2xl my-4 mx-auto bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
      >
        <JobStatusPanelContent :id :job @abort="abort()" />
      </LayoutBox>
    </PendingContent>

    <!-- Result -->
    <PendingContent on="demo/export">
      <LayoutSection
        v-if="currentStatus == 'done'"
        :title="$t('result')"
        class="my-4"
      >
        <div class="my-4">
          <MinkCodemirror
            v-if="output"
            :model-value="output"
            disabled
            language="xml"
          />
        </div>
      </LayoutSection>
    </PendingContent>
  </div>
</template>
