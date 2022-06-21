import { omit } from "lodash";
import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

export default createStore({
  plugins: [
    // Sync store with localstorage.
    new VuexPersistence({
      // The JWT should be fetched anew on page reload.
      reducer: (state) => omit(state, ["jwt"]),
    }).plugin,
  ],
  state() {
    return {
      jwt: null, // or a string
      locale: "en",
      corpora: {
        // [corpusId]: {source, config, status, exports}
      },
      pending: [],
    };
  },
  mutations: {
    setJwt(state, jwt) {
      state.jwt = jwt;
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
    setLocale(state, locale) {
      state.locale = locale;
    },
    setCorpora(state, corpora) {
      // Add id as a key, empty object as value (if not already present)
      corpora.forEach(
        (corpusId) => (state.corpora[corpusId] = state.corpora[corpusId] || {})
      );
      Object.keys(state.corpora).forEach(
        (corpusId) =>
          corpora.includes(corpusId) || delete state.corpora[corpusId]
      );
    },
    addCorpus(state, corpusId) {
      state.corpora[corpusId] = state.corpora[corpusId] || {};
    },
    setSources(state, { corpusId, sources }) {
      this.commit("addCorpus", corpusId);
      state.corpora[corpusId].sources = sources;
    },
    setConfig(state, { corpusId, config }) {
      this.commit("addCorpus", corpusId);
      state.corpora[corpusId].config = config;
    },
    setStatus(state, { corpusId, status }) {
      this.commit("addCorpus", corpusId);
      state.corpora[corpusId].status = status;
    },
    setExports(state, { corpusId, exports }) {
      this.commit("addCorpus", corpusId);
      state.corpora[corpusId].exports = exports;
    },
    removeCorpus(state, corpusId) {
      delete state.corpora[corpusId];
    },
  },
});
