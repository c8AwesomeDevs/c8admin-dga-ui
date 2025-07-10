<template>
    <div>
        <div class="pa-3" height="100%">
            <loading-overlay :visible="page_load" />
            
            <v-card height="100%"> 
                <v-sheet class="py-6 px-4" dark color="red darken-2" style="color: white;">
                  <div class="d-flex align-center">
                    <v-btn icon small @click="goBack()" class="mr-2">
                      <v-icon medium>mdi-arrow-left</v-icon>
                    </v-btn>
                    <span class="text-h6">All <span style="color: lightgreen">{{ companyName }}</span> Branches</span>
                  </div>
                </v-sheet>

                <!-- big table -->
                <v-card-text>
                    <div class="d-flex flex-grow-1" style="gap: 10px;">
                        <v-select
                            class="search-filter mx-2"
                            v-model="searchField"
                            :items="searchOptions"
                            label="Search by"
                            dense
                            outlined
                            style="max-width: 150px;"
                        ></v-select>

                        <v-text-field
                            v-model="searchQuery"
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            clearable
                            hide-details
                            single-line
                            class="mx-2"
                            dense
                        ></v-text-field>
                    </div>
                    <v-data-table 
                        no-data-text="You have no assigned roles or assets."
                        :headers="headers" 
                        :items="filteredBranches" 
                        :search="search" 
                        item-key="branch_name" 
                    >
                        <template v-slot:item="{ item }">
                            <tr>
                                <td class="font-sm">
                                    {{ item.branch_name }}
                                </td>
                                <td class="font-sm">
                                    {{ item.description }}
                                </td>
                                <td class="font-sm">
                                    <v-chip
                                        block
                                        small
                                        class="data-chip"
                                        :color="item.subscription_type === 'advanced' ? 'green' : 'red'"
                                        v-if="item.subscription_type"
                                    >
                                    {{ item.subscription_type }}
                                    </v-chip>
                                </td>
                                <td class="font-sm">
                                    <span v-if="item.transformers_count != null">{{ item.transformers_count }} </span>
                                    <span v-else > 0 </span>
                                </td>
                                <td class="font-sm">
                                    <span v-if="item.site_assets != null">{{ item.site_assets }} </span>
                                    <span v-else > 0 </span>
                                </td>
                                <td class="font-sm">
                                    <span v-if="item.substation_assets != null">{{ item.substation_assets }} </span>
                                    <span v-else > 0 </span>
                                </td>
                                <td class="font-sm">
                                    {{ item.activation_date }}
                                </td>
                                <td class="font-sm">
                                    {{ item.expiration_date }}
                                </td>
                                <!-- <td class="font-sm">
                                    <span v-if="item.users_count != null">{{ item.users_count }}</span>
                                    <span v-else> 0 </span>
                                </td> -->
                                <td class="font-sm">
                                    <v-btn class="me-2" :to="{ path: '/dashboard/assets', query: { branch_id: item.id } }" icon depressed>
                                        <v-icon small>mdi-magnify</v-icon>
                                    </v-btn>
                                    <v-btn icon small @click="viewAudits(item)">
                                        <v-icon small>mdi-receipt-text-arrow-right</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </div>

        <!-- validation-->
        <v-dialog v-model="validation_dialog" max-width="350" min-width="300">
        <template>
            <v-card>
            <div>
                <span>
                <v-icon color="orange" class="icon ml-3 mt-3"> mdi-alert-circle-outline </v-icon>
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
        
        <v-snackbar v-model="success_dialog" light>
            <v-icon color="green">mdi-check</v-icon>
            {{ successMessage }}
        </v-snackbar>
    </div>
</template>

<style scoped>
    .dialog.centered-dialog,
    .v-dialog.centered-dialog
    {
        background: #282c2dad;
        box-shadow: none;
        border-radius: 6px;
        width: auto;
        color: whitesmoke;
    }

    .body-row {
        margin: 10px!important;
    }
    .data-chip {
        color: #FFFFFF!important;
    }
    .asset-card {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>

<script>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import axios from "axios";
import { hasPermission } from "@/utils/permissionUtils.js";
import { initializeUsers } from "@/utils/authUtils.js";
import { refreshGoogleToken } from '@/utils/authUtils';
import { subscriptionMixin } from "@/mixins/subscriptionMixin.js";
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is installed
import { object } from "@amcharts/amcharts4/core";
import { sub } from "date-fns";
import { json } from "d3";

export default {
    name: "Branches",
    mixins: [subscriptionMixin],
    components: {
        LoadingOverlay,
    },
    data() {
        return {
            page_load: true,
            companyName: '',
            titleName: "",

            //User data
            authUser: {},
            user_full_role: "",
            user_level: "",
            user_role: "",

            success_dialog: false,
            successMessage: "",

            validation_dialog: false,
            dialogMessage: "",

            expanded: [],
            valid: true,
            newBranch: {},

            //Validation Rules
            branchNameRules: [
                v => !!v || 'Branch Name is required',
            ],
            branchDescriptionRules: [
                v => !!v || 'Branch Description is required',
                v => (v && v.length <= 240) || 'Branch Description must be less than 10 characters',
            ],

            loading: null,

            //Search Data
            tab: "asset",
            search: "",
            searchQuery: "",        
            searchField: 'Name',
            searchOptions: [
                "Name",
                "Subscription Status", 
                "Activation Date",
                "End Date",
            ],

            //Dialog boxes
            addBranchDialog: false,
            updateBranchDialog: false,
            subscriptionDialog: false,
            branchProfileDialog: false,

            focusBranch: {},
            headers: [
                {
                    text: "Name",
                    align: "start",
                    sortable: true,
                    value: "branch_name",
                },
                {
                    text: "Description",
                    align: "start",
                    value: "description",
                },
                {
                    text: "Subscription Status",
                    align: "start",
                    value: "subscription_type",
                },
                {
                    text: "Total Transformers",
                    align: "start",
                    sortable: true,
                    value: "assets",
                },
                {
                    text: "Total Sites",
                    align: "start",
                    sortable: true,
                    value: "site_assets",
                },
                {
                    text: "Total Substations",
                    align: "start",
                    sortable: true,
                    value: "substation_assets",
                },
                {
                    text: "Activation Date",
                    align: "start",
                    sortable: true,
                    value: "activation_date",
                },
                {
                    text: "End Date",
                    align: "start",
                    sortable: true,
                    value: "expiration_date",
                },
                // {
                //     text: "Total Users",
                //     align: "start",
                //     sortable: true,
                //     value: "total_users",
                // },
                {
                    text: "Actions",
                    align: "start",
                }
            ],
            
            //API data
            //Will pull from Branches table in database
            branches: [],
            user: {},
            subscription: {}, //change it to null by default
            current_subscription_details: [],
        };
    },
    computed: {
        filteredBranches() {
            if (!this.searchQuery) return this.branches;

            // Map UI-friendly field names to database field names (including nested ones)
            const fieldMap = {
                "Name": "branch_name",
                "Subscription Status": "subscription_type",
                "Activation Date": "activation_date",
                "End Date": "expiration_date",
            };

            const actualField = fieldMap[this.searchField];

            return this.branches.filter((branch) => {
                if (!actualField) return false;

                // Handling nested properties (e.g., "subscription.activation_date")
                if (actualField.includes(".")) {
                    const keys = actualField.split("."); // Split "subscription.activation_date" → ["subscription", "activation_date"]
                    let value = branch;

                    for (const key of keys) {
                        value = value?.[key];
                        if (value === undefined) return false;
                    }

                    return value?.toString().toLowerCase().includes(this.searchQuery.toLowerCase());
                }

                return branch[actualField]?.toString().toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        },

    },
    async mounted() {
      const token = await initializeUsers();
      await this.makeAuthenticatedRequest(token);

      // If there's a company_id in the route (used by System Admin)
      const companyId = this.$route.params.id;
      if (companyId) {
          await this.getBranchesByCompanyId(companyId);
      } else {
          await this.getBranchesByCompanyId();
      }

      this.page_load = false;
    },
    created() {
        this.$store.commit("setTitle", "Branches");
    },
    methods: {
        checkPermission(level, role){
            return hasPermission(this.user_level, this.user_role, level, role);
        },

        async makeAuthenticatedRequest(token) {
          if (token != null) {
              this.authUser = JSON.parse(localStorage.getItem("user")).user;

              if(this.authUser.role){    
                  this.user_full_role = this.authUser.role.name;
                  const split_role = this.user_full_role.split(" ")
                  this.user_level = split_role[0];
                  this.user_role = split_role[1];
              }

              // Do not auto-fetch if System Admin route is active
              if (!this.$route.params.id) {
                  await this.getBranches();
              }
          } else {
              this.showUnauthorizedDialog();
          }
        },

        capitalize(s) {
            return String(s[0]).toUpperCase() + String(s).slice(1);
        },
        goToAssets() {
            this.$router.push("/dashboard/assets");
        },
        openAddBranchDialog() {
            this.addBranchDialog = true;
        },
        openBranchProfileDialog(item){
            this.branchProfileDialog = true;
            this.focusBranch = item;
            // console.log(item);
        },
        //Might need to optimize this openUpd and openSub
        openUpdBranchDialog(item){
            this.updateBranchDialog = true;
            this.titleName = item.branch_name;
            this.focusBranch = { ...item };
        },
        openSubscriptionDialog(item){
            this.subscriptionDialog = true;
            this.focusBranch = item;
        },

        async getBranchesByCompanyId(companyId) {
            try {
                const response = await axios({
                    url: `${process.env.VUE_APP_BASEURL}/branches/${companyId}`,
                    method: "GET",
                    headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
                });
                
                this.branches = response.data.branches.map(branch => ({
                    ...branch,
                    status: "ACTIVE", // you can still keep or dynamically compute this
                }));

                this.companyName = response.data.company_name;
            } catch (err) {
                this.showUnauthorizedDialog();
            }
        },

        showUnauthorizedDialog() {
            this.validation_dialog = true;
            this.dialogMessage = 'Unauthorized';
        },

        startTokenRefreshChecker() {
            this.tokenRefreshInterval = setInterval(() => {
                const storage = JSON.parse(localStorage.getItem("user"));
                const tokenExp = JSON.parse(localStorage.getItem("token_expiry"));

                if (storage && storage.user && tokenExp) {
                    if (!this.isTokenValid(tokenExp.tokenExpiry)) {
                        this.refreshTokenAndMakeRequest(storage.user.account_type);
                    }
                }

            }, this.refreshInterval);
        },

        goBack(){
          this.$router.push({ name: "Company" });
        },

        viewAudits(item) {
            this.$router.push({ name: 'audits', params: { id: item.id } });
        }
    }
};
</script>
