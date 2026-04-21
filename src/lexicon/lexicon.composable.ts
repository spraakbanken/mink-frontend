import { computedAsync } from "@vueuse/core";
import { useMatomo } from "vue3-matomo";
import { useResourceStore } from "@/store/resource.store";
import { useExportStore } from "@/store/export.store";
import useSpin from "@/spin/spin.composable";
import api from "@/api/api";

export function useLexicon(id: string) {
  const { loadResource, loadTypedResource } = useResourceStore();
  const { loadExports } = useExportStore();
  const { spin } = useSpin();
  const matomo = useMatomo();

  const lexicon = computedAsync(() => loadTypedResource("lexicon", id));

  const exports = computedAsync(() => loadExports("lexicon", id), undefined, {
    lazy: true,
  });

  async function installKarps() {
    matomo.value?.trackEvent("Job", "Install", "lexicon karps");
    const resource = await loadResource(id);
    const info = await spin(
      api.install("lexicon", id, "karps"),
      `${id}/job/install/karps`,
    );
    resource.job = info.job;
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

  return {
    lexicon,
    exports,
    installKarps,
    uninstallKarps,
  };
}
