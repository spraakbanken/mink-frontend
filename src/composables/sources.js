import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";
import { api } from "@/assets/api";
import { useI18n } from "vue-i18n";

export default function useSources(corpusIdArg) {
  const store = useStore();
  const { spin } = useSpin();
  const { corpusId: corpusIdParam } = useCorpusIdParam();
  const corpusId = corpusIdArg ? computed(() => corpusIdArg) : corpusIdParam;
  const { t } = useI18n();

  const sources = computed(
    () => store.state.corpora[corpusId.value]?.sources || []
  );
  const token = computed(() => `corpus/${corpusId.value}/sources`);

  function loadSources() {
    const corpusIdFixed = corpusId.value;
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
      api.removeSource(corpusId.value, source.name),
      t("source.deleting"),
      token.value
    );
    loadSources();
  }

  async function upload(files) {
    const message = t("source.uploading", files.length);
    return spin(
      api.uploadSources(corpusId.value, files).then(() => loadSources()),
      message,
      token.value
    );
  }

  async function downloadSource(source) {
    return spin(
      api.downloadSourceFile(corpusId.value, source.name),
      t("source.downloading"),
      token.value
    );
  }

  async function downloadPlaintext(source) {
    return spin(
      api.downloadSourceText(corpusId.value, source.name),
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
