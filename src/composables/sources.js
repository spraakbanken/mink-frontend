import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useSpin from "@/assets/spin";
import { api } from "@/assets/api";
import { useI18n } from "vue-i18n";

export default function useSources(corpusId) {
  const store = useStore();
  const { spin } = useSpin();
  const { t } = useI18n();

  const sources = computed(() => store.state.corpora[corpusId]?.sources || []);
  const token = computed(() => `corpus/${corpusId}/sources`);

  function loadSources(corpusIdArg) {
    const corpusIdFixed = corpusIdArg || corpusId;
    spin(
      api.listSources(corpusIdFixed),
      t("source.list.loading"),
      token.value
    ).then((sourcesFetched) =>
      store.commit("setSources", {
        corpusId: corpusIdFixed,
        sources: sourcesFetched,
      })
    );
  }

  async function remove(source) {
    await spin(
      api.removeSource(corpusId, source.name),
      t("source.deleting"),
      token.value
    );
    loadSources();
  }

  async function upload(files, corpusIdArg) {
    const corpusIdFixed = corpusIdArg || corpusId;
    const message = t("source.uploading", files.length);
    return spin(
      api
        .uploadSources(corpusIdFixed, files)
        .then(() => loadSources(corpusIdFixed)),
      message,
      token.value
    );
  }

  async function downloadSource(source) {
    return spin(
      api.downloadSourceFile(corpusId, source.name),
      t("source.downloading"),
      token.value
    );
  }

  async function downloadPlaintext(source) {
    return spin(
      api.downloadSourceText(corpusId, source.name),
      t("source.downloading_plain"),
      token.value
    );
  }

  return {
    sources,
    loadSources,
    remove,
    upload,
    downloadSource,
    downloadPlaintext,
  };
}
