<script lang="ts" setup>
import { FormKit, submitForm } from "@formkit/vue";
import { computed, onMounted, ref, watch } from "vue";
import { useCounter, useInterval, useUrlSearchParams } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { PhGearFine } from "@phosphor-icons/vue";
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
import useSpin from "@/spin/spin.composable";
import PendingContent from "@/spin/PendingContent.vue";
import MinkCodemirror from "@/components/MinkCodemirror.vue";
import useAlert from "@/alert/alert.composable";
import ActionButton from "@/components/ActionButton.vue";

type Form = {
  source: string;
};

const { loadDefaultAnnotations } = useSparv();
const api = useApi();
const params = useUrlSearchParams();
const { showAlert } = useAlert();
const { spin } = useSpin();
const { t } = useI18n();

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
  const { input_text, config } = id.value
    ? await api.demoCorpusInputGet(id.value)
    : {};

  // Fall back to defaults
  input.value = input_text || sample;
  configYaml.value = config || (await makeDefaultConfig());

  if (id.value && !input_text) {
    showAlert(t("demo.invalid_id", { id: id.value }));
    // The id is invalid, so reset it
    id.value = undefined;
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
  input.value = fields.source;
  run();
}

/** Run analysis on the input */
async function run() {
  const configYamlValue = configYaml.value || (await makeDefaultConfig());
  const data = await spin(
    api.demoCorpusRun(input.value!, configYamlValue),
    "demo/job",
  );
  id.value = data.resource.id;
  job.value = data.job;
}

async function abort() {
  await spin(api.demoCorpusJobAbort(id.value!), "demo/job");
}

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

    <!-- Source text form -->
    <LayoutBox :title="$t('demo.source')">
      <FormKitWrapper :key="counter.get()">
        <FormKit id="demo-input" type="form" :actions="false" @submit="submit">
          <FormKit
            name="source"
            :help="$t('demo.source.help')"
            type="textarea"
            :value="input"
            input-class="w-full h-60"
          >
          </FormKit>
        </FormKit>
      </FormKitWrapper>
    </LayoutBox>

    <!-- Job status -->
    <div class="grid lg:grid-cols-2 gap-4 my-4">
      <LayoutBox :title="$t('analysis')">
        <div class="flex gap-3 items-center">
          <div class="grow">
            <i18n-t keypath="analysis.help" scope="global">
              <template #sparv>
                <a :href="$t('sparv.url')">Sparv</a>
              </template>
            </i18n-t>
          </div>

          <ActionButton
            :disabled="isRunning"
            class="button-primary"
            @click="submitForm('demo-input')"
          >
            <PhGearFine weight="bold" class="inline mb-1 mr-1" />
            {{ $t("corpus.sparv.run") }}
          </ActionButton>
        </div>
      </LayoutBox>

      <LayoutBox
        :title="$t('job.status')"
        class="bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
      >
        <PendingContent on="demo/job">
          <JobStatusPanelContent :job @abort="abort()" />
        </PendingContent>
      </LayoutBox>
    </div>

    <!-- Result -->
    <PendingContent on="demo/export">
      <LayoutBox class="my-4" :title="$t('result')">
        <MinkCodemirror
          v-if="output"
          :model-value="output"
          disabled
          language="xml"
        />
        <HelpBox v-else>{{ $t("demo.result.empty") }}</HelpBox>
      </LayoutBox>
    </PendingContent>
  </div>
</template>
