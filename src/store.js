import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

export default createStore({
  plugins: [new VuexPersistence().plugin],
  state() {
    return {
      user: null,
    };
  },
  mutations: {
    setUser(state, username) {
      state.user = username;
    },
  },
});
