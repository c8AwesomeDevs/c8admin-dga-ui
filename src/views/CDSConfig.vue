<template>
  <div>
    <loading-overlay :visible="page_load" />
    <div v-if="adh_config.length != 0" class="pa-3">
      <v-card>
        <v-toolbar dark dense color="red">
          CDS Configurations
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-row dense>
              <v-col v-for="(field, index) in adhFields" :key="index" cols="12" sm="6">
                <!-- Access the first object of the array -->
                <v-text-field v-model="adh_config[0][field.key]" color="red" readonly :label="field.label"
                  outlined></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
    <v-container v-if="adh_config.length == 0" style="position: relative;">
      <v-btn v-if="!loading" :disabled="adh_loading" class="white--text" block color="red darken-3" @click="addConfig">
        <v-icon>mdi-database-settings</v-icon>
        {{ adh_loading ? "Generating..." : "Generate ADH Configurations" }}
      </v-btn>
      <v-btn  v-if="loading"  :disabled="loading" class="white--text" block>
        Loading...
      </v-btn>
    </v-container>
    

    <v-dialog v-model="updateAdhDialog" persistent max-width="500px">
      <v-card>
        <v-card-actions>
          <v-card-title>Update ADH Configurations</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="closeUpdateAdhDialog" text>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="12">
              <v-text-field v-model="updatedAdhconfig.tenants" color="red darken-2" label="Tenants" dense outlined
                hide-details></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field v-model="updatedAdhconfig.namespace" color="red darken-2" label="Namespace" dense outlined
                hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn :disabled="adh_loading" depressed color="blue" text append-icon="mdi-content-save-plus-outline"
            elevation="3" small @click="updateConfig">
            {{ adh_loading ? "Updating..." : "Update" }}
            <v-icon v-if="!adh_loading" right dark>mdi-content-save-plus-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="validation_dialog" max-width="450" min-width="400">
      <template>
        <v-card>
          <div>
            <span>
              <v-icon color="orange" class="icon ml-3 mt-3">mdi-alert-circle-outline</v-icon>
              <span class="demo-check">
                {{ dialogMessage }}
              </span>
            </span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn dark small color="red" text @click="validation_dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog v-model="success_dialog" max-width="450" min-width="400">
      <template>
        <v-card>
          <div>
            <span>
              <v-icon color="green" class="icon ml-3 mt-3">mdi-check-circle-outline</v-icon>
              <span class="demo-check">
                {{ dialogMessage }}
              </span>
            </span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn dark small color="red" text @click="success_dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<style scoped>
.demo-check {
  font-size: 13px;
  white-space: pre;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1em;
  margin-right: 1em;
}
</style>

<script>
import axios from "axios";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { refreshGoogleToken } from '@/utils/authUtils';
import { msalInstance } from "vue-msal-browser";
import { jwtDecode } from 'jwt-decode';

export default {
  name: 'ADHConfig',

  beforeRouteEnter(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ""}`;
    next();
  },
  beforeRouteUpdate(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ""}`;
    next();
  },
  components: {
    LoadingOverlay,
  },
  data() {
    return {
      page_load: true,
      new_adh: {},
      adh_loading: false,
      loading: false,
      updateAdhDialog: false,
      user: {},
      adh_config: [],
      newAdhconfig: {},
      updatedAdhconfig: {},
      validation_dialog: false,
      success_dialog: false,
      dialogMessage: '',
      tokenRefreshInterval: null,
      adhFields: [
        { key: 'stream_id', label: 'Stream' },
        { key: 'name', label: 'Name' },
        { key: 'descriptions', label: 'Descriptions' },
        { key: 'type', label: 'Type' }
      ]
    };
  },

  async mounted() {
    this.loading = true;
    await this.initializeADHconfig();
    // this.startTokenRefreshChecker();
  },
  beforeDestroy() {
    clearInterval(this.tokenRefreshInterval);
  },
  methods: {
    initializeADHconfig() {
      const storage = this.getStorage();
      if (!storage) return;

      const tokenExp = JSON.parse(localStorage.getItem("token_expiry"));

      if (storage.user.account_type === 'microsoft') {
        this.handleMicrosoftToken(storage, tokenExp);
      } else if (storage.user.account_type === 'google') {
        this.handleGoogleToken(storage, tokenExp);
      }
    },

    handleMicrosoftToken(storage, tokenExp) {
      if (this.isTokenValid(tokenExp.tokenExpiry)) {
        this.makeAuthenticatedRequest(storage.token);
      } else {
        this.refreshTokenAndMakeRequest('microsoft');
      }
    },

    handleGoogleToken(storage, tokenExp) {
      if (this.isTokenValid(tokenExp.tokenExpiry)) {
        this.makeAuthenticatedRequest(storage.token);
      } else {
        this.refreshTokenAndMakeRequest('google');
      }
    },
    isTokenValid(expiry) {
      return new Date(expiry) > new Date();
    },
    created() {
      this.$store.commit("setTitle", "CDS Configuration");
    },
    mounted() {
      this.initializeADHconfig();
      // this.startTokenRefreshChecker();
    },

    refreshTokenAndMakeRequest(accountType) {
      if (accountType === 'google') {
        this.refreshGoogleToken()
          .then(() => {
            const storage = this.getStorage();
            if (storage && storage.token) {
              this.makeAuthenticatedRequest(storage.token);
            } else {
              // this.showUnauthorizedDialog();
            }
          })
          .catch((error) => {
            console.error('Error refreshing tokens:', error);
            // this.showUnauthorizedDialog();
          });
      } else if (accountType === 'microsoft') {
        this.refreshMicrosoftToken()
          .then(() => {
            const storage = this.getStorage();
            if (storage && storage.token) {
              this.makeAuthenticatedRequest(storage.token);
            } else {
              // this.showUnauthorizedDialog();
            }
          })
          .catch((error) => {
            console.error('Error refreshing tokens:', error);
            // this.showUnauthorizedDialog();
          });
      }
    },

    refreshGoogleToken() {
      const google_refresh_token = JSON.parse(localStorage.getItem("google_refresh_token"));
      return refreshGoogleToken(google_refresh_token)
        .then(({ id_token }) => {
          this.updateTokenStorage(id_token);
        })
        .catch((error) => {
          console.error('Error refreshing Google token:', error);
        });
    },

    refreshMicrosoftToken() {
      return new Promise((resolve, reject) => {
        try {
          const account = msalInstance.getAllAccounts()[0];
          msalInstance.acquireTokenSilent({
            scopes: ["user.read", "offline_access"],
            account
          }).then(response => {
            this.updateTokenStorage(response.accessToken, response.expiresOn);
            console.log("Token refreshed successfully!");
            resolve();
          }).catch(error => {
            console.error('Error acquiring tokens:', error);
            msalInstance.loginRedirect({ scopes: ["user.read", "offline_access"] });
            reject(error);
          });
        } catch (error) {
          console.error('Error handling Microsoft token refresh:', error);
          reject(error);
        }
      });
    },

    async makeAuthenticatedRequest(token) {
      this.loading = true;
      await axios({
        url: process.env.VUE_APP_BASEURL + '/adh-config',
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          this.adh_config = response.data;
          this.loading = false;
        })
        .catch(err => {
          // this.showUnauthorizedDialog();
        });

      this.page_load = false;
    },


    showUnauthorizedDialog() {
      this.validation_dialog = true;
      this.dialogMessage = 'Unauthorized';
    },
    showSuccessDialog() {
      this.success_dialog = true;
      this.dialogMessage = 'Generated successfully!';
    },

    startTokenRefreshChecker() {
      this.tokenRefreshInterval = setInterval(() => {
        const storage = this.getStorage();
        const tokenExp = JSON.parse(localStorage.getItem("token_expiry"));
        if (storage && tokenExp) {
          if (!this.isTokenValid(tokenExp.tokenExpiry)) {
            this.refreshTokenAndMakeRequest(storage.user.account_type);
          }
        }
      }, this.refreshInterval);
    },

    getStorage() {
      return JSON.parse(localStorage.getItem("user"));
    },

    updateTokenStorage(token, expiry) {
      let user = this.getStorage();
      user.token = token;
      localStorage.setItem("user", JSON.stringify(user));

      const decodedToken = jwtDecode(token);
      const tokenExpiry = expiry ? expiry.toISOString() : new Date(decodedToken.exp * 1000).toISOString();
      localStorage.setItem("token_expiry", JSON.stringify({ tokenExpiry }));
    },

    addConfig() {
      this.startTokenRefreshChecker();
      this.adh_loading = true;
      this.user = this.getStorage().user;
      this.newAdhconfig.company_id = this.user.company.id;
      this.newAdhconfig.stream_id = this.user.company.company_name + "_DGA";
      axios({
        url: process.env.VUE_APP_BASEURL + '/adh-config/save',
        method: "POST",
        data: this.newAdhconfig,
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          this.adh_loading = false;
          this.adh_config = [res.data.new_adh];
          this.showSuccessDialog();
        })
        .catch((err) => {
          alert(err.response);
          this.adh_loading = false;
        });
    },

    openUpdateAdhDialog() {
      this.updatedAdhconfig = { ...this.adh_config[0] };
      this.updateAdhDialog = true;
    },

    closeUpdateAdhDialog() {
      this.updateAdhDialog = false;
    },

    async updateConfig() {
      this.startTokenRefreshChecker();
      this.adh_loading = true;
      try {
        const response = await axios({
          url: process.env.VUE_APP_BASEURL + '/adh-config/update/' + this.updatedAdhconfig.id,
          method: "PUT",
          data: this.updatedAdhconfig,
          headers: {
            Authorization: "Bearer " + this.getStorage().token,
          },
        });
        this.adh_loading = false;
        this.updateAdhDialog = false;
        this.adh_config = [response.data];
        console.log(this.adh_config);
      } catch (err) {
        alert(err.response.message);
        console.log(err.response);
        this.adh_loading = false;
        this.updateAdhDialog = false;
      }
    }
  }
};
</script>