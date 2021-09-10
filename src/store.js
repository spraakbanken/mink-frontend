import { createStore } from "vuex";

export default createStore({
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
