import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useJwt } from "./jwt";
import { emptyConfig } from "@/assets/corpusConfig";
import useConfig from "./config";
import useSources from "./sources";
import useMessenger from "./messenger";
import useMinkBackend from "./backend";
import useCorpus from "./corpus";

/** Let corpus list be refreshed initially, but skip subsequent load calls. */
let isCorporaFresh = false;

export default function useCorpora() {
  const store = useStore();
  const router = useRouter();
  const { refreshJwt } = useJwt();
  const { deleteCorpus } = useCorpus();
  const { uploadConfig } = useConfig();
  const { uploadSources } = useSources();
  const { alert } = useMessenger();
  const mink = useMinkBackend();

  async function loadCorpora(force = false) {
    if (isCorporaFresh && !force) return;
    const corpora = await mink.loadCorpora();
    store.commit("setCorpora", corpora);
    isCorporaFresh = true;
  }

  async function createCorpus() {
    const corpusId = await mink.createCorpus();
    // Have the new corpus included in further API calls.
    await refreshJwt();
    return corpusId;
  }

  async function createFromUpload(files) {
    const corpusId = await createCorpus();
    await Promise.all([
      uploadSources(files, corpusId),
      uploadConfig(emptyConfig(), corpusId),
    ]);
    store.commit("addCorpus", corpusId);
    router.push(`/corpus/${corpusId}`);
    return corpusId;
  }

  async function createFromConfig(name, description, format, textAnnotation) {
    const config = {
      name: { swe: name, eng: name },
      description: { swe: description, eng: description },
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
      await deleteCorpus(corpusId);
    }
  }

  return {
    loadCorpora,
    createFromUpload,
    createFromConfig,
  };
}
