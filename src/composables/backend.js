import { useI18n } from "vue-i18n";
import { api } from "@/assets/api";
import useSpin from "@/assets/spin";

/** Wrap API endpoints with Spin and fixing some return values. */
export default function useMinkBackend() {
  const { spin } = useSpin();
  const { t } = useI18n();

  const loadCorpora = () =>
    spin(api.listCorpora(), t("corpus.list.loading"), "corpora");

  const createCorpus = () =>
    spin(api.createCorpus(), t("corpus.creating"), "create");

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
    loadCorpora,
    createCorpus,
    loadConfig,
    saveConfig,
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
