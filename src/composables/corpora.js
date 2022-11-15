import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { api } from "@/assets/api";
import useSpin from "@/assets/spin";
import { useJwt } from "./jwt";
import { emptyConfig } from "@/assets/corpusConfig";
import useConfig from "./config";
import useSources from "./sources";
import useMessenger from "./messenger";

export default function useCorpora() {
  const store = useStore();
  const router = useRouter();
  const { t } = useI18n();
  const { spin } = useSpin();
  const { refreshJwt } = useJwt();
  const { uploadConfig } = useConfig();
  const { upload } = useSources();
  const { alert } = useMessenger();

  async function loadCorpora() {
    return spin(api.listCorpora(), t("corpus.list.loading"), "corpora").then(
      (corporaFetched) => store.commit("setCorpora", corporaFetched)
    );
  }

  async function createCorpus() {
    const corpusId = await spin(
      api.createCorpus(),
      t("corpus.creating"),
      "create"
    );
    // Have the new corpus included in further API calls.
    await refreshJwt();
    return corpusId;
  }

  async function createFromUpload(files) {
    const corpusId = await createCorpus();
    await Promise.all([
      upload(files, corpusId),
      uploadConfig(emptyConfig(), corpusId),
    ]);
    store.commit("addCorpus", corpusId);
    router.push(`/corpus/${corpusId}`);
    return corpusId;
  }

  async function createFromConfig(name, description, format, textAnnotation) {
    const langify = (str) => ({ swe: str, eng: str });
    const config = {
      name: langify(name),
      description: langify(description),
      format,
      textAnnotation,
    };

    const corpusId = await createCorpus();
    try {
      await uploadConfig(config, corpusId);
      store.commit("addCorpus", corpusId);
      router.push(`/corpus/${corpusId}`);
      return corpusId;
    } catch (e) {
      alert(e, "error");
      await api.removeCorpus(corpusId);
      store.commit("removeCorpus", corpusId);
      await refreshJwt();
    }
  }

  return {
    loadCorpora,
    createFromUpload,
    createFromConfig,
  };
}
