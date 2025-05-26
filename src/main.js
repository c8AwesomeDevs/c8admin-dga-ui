import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { default as msalPlugin } from "vue-msal-browser";
const msalConfig = {
  auth: {
    clientId: "f585ce38-5e47-475a-b71c-45ce41ed6e7b",
    authority: "https://login.microsoftonline.com/common",
    // redirectUri: "http://localhost:8080",
    redirectUri: "https://c8vortexui.azurewebsites.net",
    scopes: ["User.Read", "offline_access"],
  },

  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

Vue.use(msalPlugin, msalConfig);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  vuetify,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
