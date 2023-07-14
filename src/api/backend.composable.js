import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "./api";
import useSpin from "@/spin/spin.composable";

const info = reactive({});
api.getInfo().then((values) => Object.assign(info, values));

/** Wraps API endpoints with Spin. */
export default function useMinkBackend() {
  const { spin } = useSpin();
  const { t } = useI18n();

  const loadCorpora = () =>
    spin(api.listCorpora(), t("corpus.list.loading"), "corpora");

  const createCorpus = () =>
    spin(api.createCorpus(), t("corpus.creating"), "create");

  const deleteCorpus = (corpusId) =>
    spin(
      api.removeCorpus(corpusId),
      t("corpus.deleting"),
      `corpus/${corpusId}`
    );

  const loadConfig = (corpusId) =>
    spin(
      api.downloadConfig(corpusId),
      t("config.loading"),
      `corpus/${corpusId}/config`
    );

  const saveConfig = (corpusId, configYaml) =>
    spin(
      api.uploadConfig(corpusId, configYaml),
      t("corpus.configuring"),
      `corpus/${corpusId}/config`
    );

  const loadSources = (corpusId) =>
    spin(
      api.listSources(corpusId),
      t("source.list.loading"),
      `corpus/${corpusId}/sources`
    );

  const downloadSource = (corpusId, filename) =>
    spin(
      api.downloadSourceFile(corpusId, filename),
      t("source.downloading"),
      `corpus/${corpusId}/sources/${filename}`
    );

  const downloadPlaintext = (corpusId, filename) =>
    spin(
      api.downloadSourceText(corpusId, filename),
      t("source.downloading_plain"),
      `corpus/${corpusId}/sources/${filename}`
    );

  const uploadSources = (corpusId, files) =>
    spin(
      api.uploadSources(corpusId, files),
      t("source.uploading", files.length),
      `corpus/${corpusId}/sources`
    );

  const deleteSource = (corpusId, filename) =>
    spin(
      api.removeSource(corpusId, filename),
      t("source.deleting"),
      `corpus/${corpusId}/sources`
    );

  const loadJob = (corpusId) =>
    spin(api.checkStatus(corpusId), t("job.loading"), `corpus/${corpusId}/job`);

  const runJob = (corpusId) =>
    spin(api.runSparv(corpusId), t("job.starting"), `corpus/${corpusId}/job`);

  const install = (corpusId) =>
    spin(
      api.installCorpus(corpusId),
      t("job.installing"),
      `corpus/${corpusId}/job`
    );

  const abortJob = (corpusId) =>
    spin(api.abortJob(corpusId), t("job.aborting"), `corpus/${corpusId}/job`);

  const loadExports = (corpusId) =>
    spin(
      api.listExports(corpusId),
      t("exports.loading"),
      `corpus/${corpusId}/exports`
    );

  const downloadExports = (corpusId) =>
    spin(
      api.downloadExports(corpusId),
      t("exports.downloading"),
      `corpus/${corpusId}/exports`
    );

  const downloadExportFiles = (corpusId, filename) =>
    spin(
      api.downloadExportFile(corpusId, filename),
      t("exports.downloading"),
      `corpus/${corpusId}/exports`
    );

  const enableAdminMode = () =>
    spin(api.adminModeOn(), "Enabling admin mode", "admin-mode");

  const disableAdminMode = () =>
    spin(api.adminModeOff(), "Disabling admin mode", "admin-mode");

  return {
    info,
    loadCorpora,
    createCorpus,
    deleteCorpus,
    loadConfig,
    saveConfig,
    loadSources,
    downloadSource,
    downloadPlaintext,
    uploadSources,
    deleteSource,
    loadJob,
    runJob,
    install,
    abortJob,
    loadExports,
    downloadExports,
    downloadExportFiles,
    enableAdminMode,
    disableAdminMode,
  };
}
