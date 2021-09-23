import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

export default createStore({
  plugins: [new VuexPersistence().plugin],
  state() {
    return {
      auth: null,
      corpora: [],
      sources: {},
    };
  },
  mutations: {
    login(state, { username, password }) {
      state.auth = { username, password };
    },
    logout(state) {
      state.auth = null;
    },
    setCorpora(state, corpora) {
      state.corpora = corpora;
    },
    setSources(state, { corpusId, sources }) {
      state.sources[corpusId] = sources;
    },
    removeCorpus(state, corpusId) {
      state.corpora = state.corpora.filter((id) => id != corpusId);
      delete state.sources[corpusId];
    },
  },
});
