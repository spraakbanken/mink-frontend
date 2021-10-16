import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

export default createStore({
  plugins: [new VuexPersistence().plugin],
  state() {
    return {
      auth: null,
      corpora: {},
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
      // Add id as a key, empty object as value (if not already present)
      corpora.forEach(
        (corpusId) => (state.corpora[corpusId] = state.corpora[corpusId] || {})
      );
    },
    addCorpus(state, corpusId) {
      state.corpora[corpusId] = state.corpora[corpusId] || {};
    },
    setSources(state, { corpusId, sources }) {
      state.corpora[corpusId].sources = sources;
    },
    setConfigSummary(state, { corpusId, summary }) {
      state.corpora[corpusId].configSummary = summary;
    },
    setStatus(state, { corpusId, status }) {
      state.corpora[corpusId].status = status;
    },
    setExports(state, { corpusId, exports }) {
      state.corpora[corpusId].exports = exports;
    },
    removeCorpus(state, corpusId) {
      delete state.corpora[corpusId];
    },
  },
});
