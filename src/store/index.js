import Vue from 'vue'
//import { set } from 'vue/types/umd';
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: "",
    
    token: null,
    token_expiry: null,

    user: null,
    user_level: null,
    user_role: null,
  },
  mutations: {
    setTitle(state, newPath){
      state.title = newPath;
    },
    setUser(state, user){
      state.user = user;
      if(user && user.role && user.role.name){
        const [level, role] = user.role.name.split(" ");
        state.user_level = level;
        state.user_role = role;
      }
    },
    setToken(state, token){
      state.token = token;
    },
    setTokenExpiry(state, token_expiry){
      state.token_expiry = token_expiry;
    }
  },
  actions: {
    syncUserFromStorage({ commit }){
      const storedUser =  JSON.parse(localStorage.getItem("user"))?.user;
      const storedToken = JSON.parse(localStorage.getItem("user"))?.token;
      const storedTokenExpiry = JSON.parse(localStorage.getItem("user"))?.token_expiry;

      if (storedUser) commit("setUser", storedUser);
      if (storedToken) commit("setToken", storedToken);
      if (storedTokenExpiry) commit("setTokenExpiry", storedTokenExpiry);
    }
  },
  getters: {
    user: state => state.user,
    user_level: state => state.user_level,
    user_role: state => state.user_role,

    token: state => state.token,
    token_expiry: state => state.token_expiry,

  },
  modules: {
  }
})
