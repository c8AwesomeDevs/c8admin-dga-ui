<template>
    <div class="pa-3">
      <loading-overlay :visible="page_load" />
      <v-card>
        <v-sheet class="py-6 px-4" dark color="red darken-2" style="color: white;">
          <div class="d-flex align-center">
            <span class="text-h6">All Users</span>
          </div>
        </v-sheet>
  
        <v-card-text>
            <div class="d-flex flex-grow-1 mb-4" style="gap: 10px;">
                <v-select
                    v-model="selectSearch"
                    :items="searchOptions"
                    dense
                    outlined
                    hide-details
                    label="Search by"
                    style="max-width: 150px;"
                ></v-select>

                <v-text-field
                    v-model="tableSearch"
                    label="Search for"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    clearable
                    hide-details
                    single-line
                    dense
                    class="mx-2"
                ></v-text-field>
                </div>
          <v-data-table
            :headers="headers"
            :items="filteredUsers"
            item-value="id"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="font-sm">{{ item.company_id || "-" }}</td>
                <td class="font-sm">{{ item.name || "-" }}</td>
                <td class="font-sm">{{ item.email || "-" }}</td>
                <td class="font-sm">{{ item.phone_number || "-" }}</td>
                <td class="font-sm">{{ item.account_type || "-" }}</td>
                <td class="font-sm" :style="{
                  color: item.account_status === 'declined' ? 'red' :
                        item.account_status === 'active' ? 'green' :
                        item.account_status === 'disabled' ? 'red' :
                        item.account_status === 'enable' ? 'green' :
                        item.account_status === 'inactive' ? 'gray' :
                        'inherit'
                }">
                  {{ item.account_status || "-" }}
                </td>
                <td class="font-sm">
                  <span v-if="item.is_new === 'Yes'">Yes</span>
                  <span v-else>No</span>
                </td>
                <td class="font-sm">{{ item.role?.name || 'Not Assigned' }}</td>
                <td class="font-sm">
                <v-btn icon small @click="openStatusDialog(item)">
                  <v-icon small>mdi-account-alert</v-icon>
                </v-btn>
              </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <!-- Status Change Dialog -->
        <v-dialog v-model="statusDialog" max-width="400">
          <v-card>
            <v-toolbar dark dense color="red">
                    <v-card-title>Change Account Status</v-card-title>

                    <v-spacer></v-spacer>

                    <v-btn @click="statusDialog = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
            <v-card-text>
              <v-radio-group v-model="selectedStatus">
                <v-radio label="Active" value="active" disabled></v-radio>
                <v-radio label="Inactive" value="inactive" disabled></v-radio>
                <v-radio label="Declined" value="declined"></v-radio>
                <v-radio label="Disabled" value="disabled"></v-radio>
                <v-radio label="Enable" value="enable"></v-radio>
              </v-radio-group>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="loading" color="info" apend-icon="mdi-content-save-plus-outline" elevation="3" @click="confirmDialog = true" small
                >{{ loading ? "Adding..." : "Save" }}<v-icon v-if="!loading" right dark>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="confirmDialog" max-width="400">
          <v-card>
            <v-card-title class="headline">
              Confirm Save
            </v-card-title>
            <v-card-text>
              Are you sure you want to change the status to <strong>{{ selectedStatus }}</strong>?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="confirmDialog = false">Cancel</v-btn>
              <v-btn color="primary" text @click="confirmSave">Yes, Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
          {{ snackbar.text }}
        </v-snackbar>
      </v-card>
    </div>
  </template>
  
  <script>
  import LoadingOverlay from "@/components/LoadingOverlay.vue";
  import { initializeUsers } from "@/utils/authUtils.js";
  import { startTokenRefreshChecker } from "@/utils/authUtils.js";
  import { beforeRouteEnter, beforeRouteUpdate } from "@/utils/routeUtils.js";
  import axios from "axios";

  export default {
    beforeRouteEnter, beforeRouteUpdate,
    name: "all-users",
    components: {
      LoadingOverlay,
    },
    data() {
      return {
        confirmDialog: false,
        page_load: true,
        companyName: '',
        users: [],
        tableSearch: '',
        selectSearch: 'Name',
        searchOptions: ['Name', 'Email', 'Phone No.', 'Account Type', 'Account Status', 'Is New', 'Account Type', 'Role'],
        fieldMap: {
          'Company ID' : 'company_id',
          'Name': 'name',
          'Email': 'email',
          'Phone No.': 'phone_number',
          'Account Type': 'account_type',
          'Account Status': 'account_status',
          'Is New': 'is_new',
          'Role': 'role.name',
        },
        headers: [
          { text: "Company ID", value: "company_id" },
          { text: "Name", value: "name" },
          { text: "Email", value: "email" },
          { text: "Phone No.", value: "phone_number" },
          { text: "Account Type", value: "account_type" },
          { text: "Account Status", value: "account_status" },
          { text: "Is New", value: "is_new" },
          { text: "Role", value: "role" },
          { text: "Actions", value: 'actions', sortable: false },
        ],
        statusDialog: false,
        selectedStatus: null,
        selectedUser: null,
        loading: false,
        snackbar: {
          show: false,
          text: '',
          color: 'success',
        },
      };
    },
    created() {
      this.$store.commit("setTitle", "All Users");
    },
    async mounted() {
      const token = await initializeUsers();
      await this.makeAuthenticatedRequest(token);
      this.page_load = false;
    },
    methods: {
      async makeAuthenticatedRequest(token) {
        if(token != null){
          await this.fetchAllUsers(); 
        }else{
          console.log("Unauthorized");
        }
      },

    //   goBack(){
    //     this.$router.push({ name: "Company" });
    //   },

        async fetchAllUsers() {
            try {
                const res = await axios.get(`${process.env.VUE_APP_BASEURL}/users-sysad`, {
                    headers: {
                        Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    },
                });

                this.users = res.data;

                for (let user of this.users) {
                    user.is_new = user.is_new == 1 ? "Yes" : "No";
                }

                this.companyName = "All Users"; // Or something like "System-wide"
            } catch (err) {
                console.error("Error fetching all users:", err);
            }
        },

        openStatusDialog(user) {
          this.selectedUser = user;
          this.selectedStatus = user.account_status;
          this.statusDialog = true;
        },
        async saveStatus() {
          startTokenRefreshChecker();
          this.loading = true;

          const payload = {
            status: this.selectedStatus,
          };

          try {
            const res = await axios({
              url: process.env.VUE_APP_BASEURL + `/users/${this.selectedUser.id}/status`,
              method: "PATCH",
              data: payload,
              headers: {
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
              },
            });

            if (res.status === 200) {
                await this.fetchAllUsers();
              this.snackbar.text = res.data.message || "Status updated successfully.";
              this.snackbar.color = "success";
              this.snackbar.show = true;  
            }
            
            this.statusDialog = false;
          } catch (err) {
            console.error("Error saving status:", err);

            this.snackbar.text =
              (err.response && err.response.data && err.response.data.message) ||
              "Something went wrong. Please try again.";
            this.snackbar.color = "error";
            this.snackbar.show = true;
          } finally {
            this.loading = false;
          }
        },

        confirmSave() {
          this.confirmDialog = false;
          this.saveStatus();
        },
    },
    computed: {
        filteredUsers() {
            if (!this.tableSearch) return this.users;

            const field = this.fieldMap[this.selectSearch];
            return this.users.filter(user => {
            // Nested field support (e.g. role.name)
            const value = field.split('.').reduce((obj, key) => obj?.[key], user);
            return value?.toString().toLowerCase().includes(this.tableSearch.toLowerCase());
            });
        },
    }
  };
  </script>
  