import { useI18n } from "vue-i18n";
import api from "@/api/api";
import useSpin from "@/spin/spin.composable";
import type { ProgressHandler } from "@/api/api.types";

/** Wraps API endpoints with Spin. */
export default function useMinkBackend() {
  const { spin } = useSpin();
  const { t } = useI18n();

  const loadCorpusIds = () =>
    spin(api.listCorpora(), t("corpus.list.loading"), "corpora");

  const createCorpus = () =>
    spin(api.createCorpus(), t("corpus.creating"), "create");

  const createMetadata = (publicId: string) =>
    spin(api.createMetadata(publicId), null, "create");

  const deleteCorpus = (corpusId: string) =>
    spin(
      api.removeCorpus(corpusId),
      t("corpus.deleting"),
      `corpus/${corpusId}`,
    );

  const deleteMetadata = (resourceId: string) =>
    spin(api.removeMetadata(resourceId), null, `resource/${resourceId}`);

  const loadConfig = (corpusId: string) =>
    spin(
      api.downloadConfig(corpusId),
      t("config.loading"),
      `corpus/${corpusId}/config`,
    );

  const saveConfig = (corpusId: string, configYaml: string) =>
    spin(
      api.uploadConfig(corpusId, configYaml),
      t("corpus.configuring"),
      `corpus/${corpusId}/config`,
    );

  const downloadSource = (corpusId: string, filename: string, binary = false) =>
    spin(
      api.downloadSources(corpusId, filename, binary),
      t("source.downloading"),
      `corpus/${corpusId}/sources/${filename}`,
    );

  const downloadPlaintext = (corpusId: string, filename: string) =>
    spin(
      api.downloadSourceText(corpusId, filename),
      t("source.downloading_plain"),
      `corpus/${corpusId}/sources/${filename}/plain`,
    );

  const uploadSources = (
    corpusId: string,
    files: FileList,
    onProgress?: ProgressHandler,
  ) =>
    spin(
      api.uploadSources(corpusId, files, onProgress),
      t("source.uploading", files.length),
      `corpus/${corpusId}/sources`,
    );

  const deleteSource = (corpusId: string, filename: string) =>
    spin(
      api.removeSource(corpusId, filename),
      t("source.deleting"),
      `corpus/${corpusId}/sources`,
    );

  const uploadMetadata = (resourceId: string, yaml: string) =>
    spin(
      api.uploadMetadataYaml(resourceId, yaml),
      null,
      `resource/${resourceId}/metadata`,
    );

  const downloadMetadata = (resourceId: string) =>
    spin(
      api.downloadMetaataYaml(resourceId),
      null,
      `resource/${resourceId}/metadata`,
    );

  const resourceInfoAll = () =>
    spin(api.resourceInfoAll(), t("resource.loading"), "corpora");

  const resourceInfoOne = (corpusId: string) =>
    spin(
      api.resourceInfoOne(corpusId),
      t("resource.loading"),
      `corpus/${corpusId}/job`,
    );

  const runJob = (corpusId: string) =>
    spin(api.runSparv(corpusId), t("job.starting"), `corpus/${corpusId}/job`);

  const installKorp = (corpusId: string) =>
    spin(
      api.installKorp(corpusId),
      t("job.installing"),
      `corpus/${corpusId}/job`,
    );

  const installStrix = (corpusId: string) =>
    spin(
      api.installStrix(corpusId),
      t("job.installing"),
      `corpus/${corpusId}/job`,
    );

  const abortJob = (corpusId: string) =>
    spin(api.abortJob(corpusId), t("job.aborting"), `corpus/${corpusId}/job`);

  const loadExports = (corpusId: string) =>
    spin(
      api.listExports(corpusId),
      t("exports.loading"),
      `corpus/${corpusId}/exports`,
    );

  const downloadExports = (corpusId: string) =>
    spin(
      api.downloadExports(corpusId),
      t("exports.downloading"),
      `corpus/${corpusId}/exports`,
    );

  const downloadExportFiles = (corpusId: string, filename: string) =>
    spin(
      api.downloadExportFile(corpusId, filename),
      t("exports.downloading"),
      `corpus/${corpusId}/exports`,
    );

  const checkAdminMode = () => spin(api.adminModeStatus(), null, "admin-mode");

  const enableAdminMode = () =>
    spin(api.adminModeOn(), "Enabling admin mode", "admin-mode");

  const disableAdminMode = () =>
    spin(api.adminModeOff(), "Disabling admin mode", "admin-mode");

  return {
    loadCorpusIds,
    createCorpus,
    createMetadata,
    deleteCorpus,
    deleteMetadata,
    loadConfig,
    saveConfig,
    downloadSource,
    downloadPlaintext,
    uploadSources,
    deleteSource,
    uploadMetadata,
    downloadMetadata,
    resourceInfoAll,
    resourceInfoOne,
    runJob,
    installKorp,
    installStrix,
    abortJob,
    loadExports,
    downloadExports,
    downloadExportFiles,
    checkAdminMode,
    enableAdminMode,
    disableAdminMode,
  };
}
