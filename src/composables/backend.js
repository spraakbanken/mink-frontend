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

  const enableAdminMode = () =>
    spin(api.adminModeOn(), "Enabling admin mode", "admin-mode");

  const disableAdminMode = () =>
    spin(api.adminModeOff(), "Disabling admin mode", "admin-mode");

  return {
    loadCorpora,
    createCorpus,
    loadConfig,
    saveConfig,
    enableAdminMode,
    disableAdminMode,
  };
}
