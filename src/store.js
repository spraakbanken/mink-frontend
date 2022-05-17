import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

export default createStore({
  plugins: [new VuexPersistence().plugin],
  state() {
    return {
      auth: null, // or {username, password}
      corpora: {
        // [corpusId]: {source, config, status, exports}
      },
      pending: [], txtshow: null,
    };
  },
  mutations: {
    login(state, { username, password }) {
      state.auth = { username, password };
    },
    logout(state) {
      state.auth = null;
    },
    setPending(state, token) {
      if (!state.pending.includes(token)) {
        state.pending.push(token);
      }
    },
    clearPending(state, token) {
      if (state.pending.includes(token)) {
        state.pending.splice(state.pending.indexOf(token), 1);
      }
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
    setConfig(state, { corpusId, config }) {
      state.corpora[corpusId].config = config;
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
    showText(state, { content }) {
      state.txtshow = { content };
    },
    removeText(state) {
      state.txtshow = null;
    },
  },
});
