import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useSpin from "@/assets/spin";
import useCorpusIdParam from "./corpusIdParam";
import {
  getCorpus,
  putSources,
  removeSource,
  downloadSource as downloadSourceApi,
  downloadSourceText,
} from "@/assets/api";

export default function useSources() {
  const store = useStore();
  const { spin } = useSpin();
  const { corpusId } = useCorpusIdParam();
  const sources = computed(
    () => store.state.corpora[corpusId.value]?.sources || []
  );
  const token = computed(() => `corpus/${corpusId.value}/sources`);

  function loadSources() {
    spin(getCorpus(corpusId.value), "Hämtar textlista", token.value).then(
      (sourcesFetched) =>
        store.commit("setSources", {
          corpusId: corpusId.value,
          sources: sourcesFetched,
        })
    );
  }

  async function remove(source) {
    await spin(
      removeSource(corpusId.value, source.name),
      "Raderar textfil",
      token.value
    );
    loadSources();
  }

  async function upload(files) {
    const message =
      files.length > 1 ? "Laddar upp textfiler" : "Laddar upp textfil";
    await spin(putSources(corpusId.value, files), message, token.value);
    loadSources();
  }

  async function downloadSource(source) {
    return spin(
      downloadSourceApi(corpusId.value, source.name),
      "Laddar ner källtext",
      token.value
    );
  }

  async function downloadPlaintext(source) {
    return spin(
      downloadSourceText(corpusId.value, source.name),
      "Laddar ner extraherad text",
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
