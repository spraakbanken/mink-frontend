import { computedAsync } from "@vueuse/core";
import { useMatomo } from "vue3-matomo";
import { computed, watch } from "vue";
import { parseConfig, type LexiconConfigOptions } from "./lexiconConfig";
import { useResourceStore } from "@/store/resource.store";
import { useExportStore } from "@/store/export.store";
import useSpin from "@/spin/spin.composable";
import { useApi } from "@/api/useApi";
import { useConfigStore } from "@/store/config.store";
import useLocale from "@/i18n/locale.composable";

export function useLexicon(id: string) {
  const api = useApi();
  const { loadResource, loadTypedResource } = useResourceStore();
  const { loadConfig } = useConfigStore();
  const { loadExports } = useExportStore();
  const { spin } = useSpin();
  const { locale3 } = useLocale();
  const matomo = useMatomo();

  const lexicon = computedAsync(() => loadTypedResource("lexicon", id));

  const config = computedAsync(() => loadConfig("lexicon", id), undefined, {
    lazy: true,
  });

  const exports = computedAsync(() => loadExports("lexicon", id), undefined, {
    lazy: true,
  });

  /** Parsed config; `undefined` if no config, `null` if parsing fails */
  const configOptions = computed<LexiconConfigOptions | null | undefined>(
    () => {
      if (!config.value) return undefined;
      try {
        return parseConfig(config.value || "", locale3.value);
      } catch (error) {
        console.error(`Error parsing config for "${id}":`, error);
      }
      return null;
    },
  );

  const analysisStatus = computed(
    () => lexicon.value?.job?.status.karp_pipeline,
  );

  async function installKarpred() {
    matomo.value?.trackEvent("Job", "Install", "lexicon karpred");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("lexicon", id, "karpred"),
      `${id}/job/install/karpred`,
    );
    resource.job = info.job;
  }

  async function installKarps() {
    matomo.value?.trackEvent("Job", "Install", "lexicon karps");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("lexicon", id, "karps"),
      `${id}/job/install/karps`,
    );
    resource.job = info.job;
  }

  async function uninstallKarpred() {
    matomo.value?.trackEvent("Job", "Uninstall", "lexicon karpred");
    await spin(
      api.uninstall("lexicon", id, "karpred"),
      `${id}/job/install/karpred`,
    );
    // Get updated job info
    await loadResource(id, true, `${id}/job/install/karpred`);
  }

  async function uninstallKarps() {
    matomo.value?.trackEvent("Job", "Uninstall", "lexicon karps");
    await spin(
      api.uninstall("lexicon", id, "karps"),
      `${id}/job/install/karps`,
    );
    // Get updated job info
    await loadResource(id, true, `${id}/job/install/karps`);
  }
  // Refresh exports when analysis is done
  watch(analysisStatus, (current, old) => {
    if (current == "done" && old && old != "done")
      loadExports("lexicon", id, true);
  });

  return {
    lexicon,
    config,
    configOptions,
    exports,
    installKarpred,
    installKarps,
    uninstallKarpred,
    uninstallKarps,
  };
}
