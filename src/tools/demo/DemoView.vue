<script lang="ts" setup>
import { FormKit, submitForm } from "@formkit/vue";
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useCounter, useInterval, useUrlSearchParams } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { PhGearFine } from "@phosphor-icons/vue";
import { useDemoStore } from "./demo.store";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import HelpBox from "@/components/HelpBox.vue";
import PageTitle from "@/components/PageTitle.vue";
import {
  type ConfigOptions,
  emptyConfig,
  makeConfig,
  parseConfig,
} from "@/api/corpusConfig";
import { useApi } from "@/api/useApi";
import type { DemoCorpusOutputData, JobInfo } from "@/api/api.types";
import { toLangKey, useSparv } from "@/corpus/sparv.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import { useJobStatus } from "@/job/jobStatus.composable";
import JobStatusPanelContent from "@/job/JobStatusPanelContent.vue";
import useSpin from "@/spin/spin.composable";
import PendingContent from "@/spin/PendingContent.vue";
import useAlert from "@/alert/alert.composable";
import ActionButton from "@/components/ActionButton.vue";
import { useAppConfig } from "@/app/useAppConfig";
import AnalysisSelector from "@/corpus/AnalysisSelector.vue";
import MaxHeight from "@/components/MaxHeight.vue";
import TabsBar from "@/components/TabsBar.vue";
import TabsContent from "@/components/TabsContent.vue";
import TextFileBox from "@/components/TextFileBox.vue";

type Form = {
  source: string;
};

const { appConfig } = useAppConfig();
const { defaultConfig, findAnalyses, languageOptions } = useSparv();
const api = useApi();
const params = useUrlSearchParams();
const demoStore = useDemoStore();
const { showAlert } = useAlert();
const { isPending, spin } = useSpin();
const { t } = useI18n();

const CsvExportDisplay = defineAsyncComponent(
  () => import("@/corpus/CsvExportDisplay.vue"),
);

const demoSettings = appConfig.tools!.demo!;
const sample = (demoSettings.sample || "").trim();

/** Counter to trigger form re-render */
const counter = useCounter();

/** Corpus id, synced to URL param */
const id = computed({
  get: () => params.id as string | undefined,
  set: (value) => (value ? (params.id = value) : delete params.id),
});

/** Source text model */
const source = ref("");

const analysesSelected = ref<string[]>([]);

/** Resulting exported files */
const outputs = ref<DemoCorpusOutputData["outputs"]>();

/** Corpus config */
const configOptions = ref<ConfigOptions>(emptyConfig());

/** Langkey model (a `<language>-<variety>` string) connected to the config object */
const langkey = computed({
  get: () => {
    const { language, variety } = configOptions.value;
    return language ? toLangKey(language, variety) : undefined;
  },
  set: (value) => {
    const [language, variety] = value?.split("-") || [];
    configOptions.value = { ...configOptions.value, language, variety };
  },
});

const job = ref<JobInfo<"corpus">>();

const { currentStatus, isRunning } = useJobStatus(job);

const resultTab = ref<string>("table");

/** A ticker for status polling */
const ticker = useInterval(2000);

// Initiate or restore state
onMounted(async () => {
  const data = await loadInput();
  source.value = data.input;

  // Parse config
  try {
    const config = parseConfig(data.config);
    await setConfig(config);
  } catch (error) {
    console.error("Error parsing config", error);
    const config = await defaultConfig();
    await setConfig(config);
  }

  // FormKit elements will not react on value change from outside, so force the form to re-render
  counter.inc();

  // Get job status
  if (id.value) {
    job.value = await api.demoCorpusStatusGet(id.value);
  }

  // If the store has source input, use that and run analysis immediately
  if (demoStore.source) {
    source.value = demoStore.source;
    demoStore.source = "";
    run();
  }
});

/** Load initial input data, if identified and found, otherwise defaults */
async function loadInput() {
  // Id provided, check for input stored on server
  if (id.value) {
    const data = await api.demoCorpusInputGet(id.value);
    if (data) {
      return { input: data.input_text, config: data.config };
    } else {
      // No data, alert and reset id
      showAlert(t("demo.invalid_id", { id: id.value }));
      id.value = undefined;
    }
  }

  // Couldn't load previous input, use defaults
  const { config } = await api.demoCorpusDefaultConfigGet();
  return { input: sample, config };
}

/** Load given config object into the component's state */
async function setConfig(config: ConfigOptions) {
  configOptions.value = config;

  // Fall back to default language
  configOptions.value.language ||= appConfig.defaultLanguage;

  // Get selected analyses
  const analyses = await findAnalyses(configOptions.value);
  analysesSelected.value = analyses.map((a) => a.id);
}

async function resetConfig() {
  const config = await defaultConfig();
  await setConfig(config);
}

/** Handle submitting the form */
async function submit(fields: Form) {
  source.value = fields.source;
  run();
}

/** Run analysis on the input */
async function run() {
  const configYaml = makeConfig("demo", configOptions.value);
  // Reset job to react to response properly
  job.value = undefined;
  const data = await spin(
    api.demoCorpusRun(source.value, configYaml),
    "demo/job",
  );
  id.value = data.resource.id;
  job.value = data.job;
}

async function abort() {
  await spin(api.demoCorpusJobAbort(id.value!), "demo/job");
}

// Sync selected analyses to config object
watch(analysesSelected, async (ids) => {
  // Don't use entire configOptions, skip `annotations` here
  const { language, variety } = configOptions.value;
  // Get the annotation strings of each analysis
  const annotations = (await findAnalyses({ language, variety }))
    .filter((a) => ids.includes(a.id))
    .flatMap((a) => a.annotations);
  configOptions.value = { ...configOptions.value, annotations };
});

// Check status intermittently if active
watch(ticker, async () => {
  if (id.value && isRunning.value) {
    job.value = await api.demoCorpusStatusGet(id.value);
  }
});

// Load result when done; reset result when starting new analysis
watch(currentStatus, async () => {
  if (id.value && currentStatus.value == "done") {
    outputs.value = await spin(
      api.demoCorpusOutputGet(id.value),
      "demo/export",
    );
  } else {
    outputs.value = undefined;
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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
      <FormKitWrapper :key="counter.get()">
        <!-- Source text -->
        <LayoutBox
          :title="$t('demo.source')"
          class="max-xl:col-span-full flex flex-col"
        >
          <FormKit
            id="demo-input"
            type="form"
            :actions="false"
            @submit="submit"
            form-class="grow flex flex-col"
          >
            <FormKit
              name="source"
              :help="$t('demo.source.help')"
              type="textarea"
              :value="source"
              rows="8"
              outer-class="contents"
              wrapper-class="contents"
              inner-class="contents"
              input-class="grow"
            >
            </FormKit>
          </FormKit>
        </LayoutBox>

        <!-- Settings -->
        <LayoutBox :title="$t('settings')" class="max-xl:col-span-full">
          <template #controls>
            <ActionButton @click="resetConfig()">
              {{ $t("demo.reset") }}
            </ActionButton>
          </template>

          <MaxHeight :max-height="400">
            <div class="md:flex gap-4 items-baseline">
              <FormKit
                name="language"
                :label="$t('config.language')"
                type="select"
                v-model="langkey"
                :options="languageOptions"
                outer-class="mt-0"
              />
            </div>

            <!-- Analyses -->
            <div v-if="langkey">
              <h4 class="inline text-lg font-medium">
                {{ $t("config.analyses") }}
              </h4>
              <AnalysisSelector :langkey v-model="analysesSelected" />
            </div>
          </MaxHeight>
        </LayoutBox>

        <!-- Analyse button -->
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
              :disabled="isPending('demo/job') || isRunning"
              class="button-primary"
              @click="submitForm('demo-input')"
            >
              <PhGearFine weight="bold" class="inline mb-1 mr-1" />
              {{ $t("corpus.sparv.run") }}
            </ActionButton>
          </div>
        </LayoutBox>

        <!-- Job status -->
        <LayoutBox
          :title="$t('job.status')"
          class="bg-zinc-700 text-zinc-300 dark:bg-zinc-600"
        >
          <PendingContent on="demo/job">
            <JobStatusPanelContent :job @abort="abort()" />
          </PendingContent>
        </LayoutBox>
      </FormKitWrapper>

      <!-- Result -->
      <PendingContent on="demo/export" class="col-span-full">
        <LayoutBox :title="$t('result')">
          <TabsBar
            :tabs="[
              { key: 'table', label: $t('demo.result.table') },
              { key: 'xml', label: 'XML' },
              { key: 'csv', label: 'CSV' },
            ]"
            v-model="resultTab"
          />

          <template v-if="outputs">
            <TabsContent
              v-if="resultTab == 'table'"
              :title="$t('demo.result.table')"
            >
              <CsvExportDisplay :csv="outputs.csv" />
            </TabsContent>

            <TabsContent v-if="resultTab == 'xml'" title="XML">
              <TextFileBox
                :load="async () => outputs?.xml"
                :filename="`${id}.xml`"
                language="xml"
              />
            </TabsContent>

            <TabsContent v-else-if="resultTab == 'csv'" title="CSV">
              <TextFileBox
                :load="async () => outputs?.csv"
                :filename="`${id}.csv`"
              />
            </TabsContent>
          </template>

          <HelpBox v-else>{{ $t("demo.result.empty") }}</HelpBox>
        </LayoutBox>
      </PendingContent>
    </div>
  </div>
</template>
