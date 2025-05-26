<template>
    <div>
        <div class="pa-3" height="100%">
            <loading-overlay :visible="page_load" />
            
            <v-card height="100%">
                <v-sheet class="pa-3 d-flex align-center justify-space-between" dark color="red darken-2" style="color: white;">
                    <div class="d-flex align-center" style="gap: 10px;">
                        All Branches
                    </div>

                    <v-btn 
                        v-if="checkPermission(null, ['Administrator'])" 
                        color="success" 
                        small 
                        @click="addBranchDialog = true"
                    >
                        <v-icon>mdi-plus</v-icon>
                        Add Branch
                    </v-btn>
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
                                    <span v-if="item.transformers_count != null">{{ item.transformers_count }} </span>
                                    <span v-else > 0 </span>
                                </td>
                                <td class="font-sm">
                                    <v-chip block small color="green" class="data-chip">
                                        {{ item.status }}
                                    </v-chip>
                                </td>
                                <td class="font-sm">
                                    {{ item.subscription.activation_date }}
                                </td>
                                <td class="font-sm">
                                    {{ item.subscription.expiration_date }}
                                </td>
                                <td class="font-sm">
                                    <span v-if="item.users_count != null">{{ item.users_count }}</span>
                                    <span v-else> 0 </span>
                                </td>
                                <td class="font-sm">
                                    <v-btn 
                                        v-if="subscription.payment_status == 'paid' && checkPermission(null, ['Administrator'])" 
                                        class="me-2" 
                                        @click="openUpdBranchDialog(item)" 
                                        icon 
                                        depressed
                                    >
                                        <v-icon small>mdi-square-edit-outline</v-icon>
                                    </v-btn>
                                    <!--v-btn class="me-2" @click="openSubscriptionDialog(item)" icon depressed>
                                        <v-icon small>mdi-currency-usd</v-icon>
                                    </v-btn-->
                                    <v-btn class="me-2" :to="{ path: '/dashboard/assets', query: { branch_id: item.id } }" icon depressed>
                                        <v-icon small>mdi-magnify</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </div>

        <!-- Branch profile dialog>
        <v-dialog v-model="branchProfileDialog" persistent max-width="70%">
            <v-card>
                <v-toolbar dark dense color="red">
                    <v-card-title>Branch Profile</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="branchProfileDialog = false" icon><v-icon>mdi-close</v-icon></v-btn>    
                </v-toolbar>

                <v-card-text>
                    <v-row class="py-8 px-12" max-height="1000px">
                        <v-col cols="12" sm="4">
                            <v-img
                                class="grey lighten-2 d-flex align-center justify-center rounded"
                                src="@/assets/branch-placeholder.png"
                                
                                height="200px"
                                width="100%"
                            >
                            </v-img>
                        </v-col>    
                        <v-col cols="12" sm="8" class="pt-10">
                            <h2>{{ focusBranch.branch_name }}</h2>
                            <v-divider class="my-4"></v-divider>
                            <p class="px-4">{{ focusBranch.description }}</p>
                        </v-col>
                    </v-row>
                    <v-tabs v-model="tab">
                        <v-tab key="asset"> Asset Breakdown </v-tab>
                        <v-tab key="users"> Users Breakdown </v-tab>
                        <v-tab key="sub"> Subscription Details </v-tab>
                    </v-tabs-->

                    <!-- Branch Profile - Asset Breakdown>
                    <v-tabs-items v-model="tab">
                        <v-tab-item class="pa-5" key="asset">
                            
                                    <div style="width: 600px;">
                                        <v-row>
                                            <v-col cols="12">
                                                <v-card class="pa-3 asset-card">
                                                    <h2>{{ focusBranch.total_assets }}</h2>
                                                    <h4>TOTAL TRANSFORMERS</h4>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="4">
                                                <v-card class="pa-3 asset-card">
                                                    <h2>{{ focusBranch.total_sites }}</h2>
                                                    <h4><v-icon small>mdi-domain</v-icon> SITES</h4>
                                                </v-card>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-card class="pa-3 asset-card">
                                                    <h2>{{ focusBranch.total_substations }}</h2>
                                                    <h4><v-icon small>mdi-cube-unfolded</v-icon> SUBSTATIONS</h4>
                                                </v-card>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-card class="pa-3 asset-card">
                                                    <h2>{{ focusBranch.total_transformers }}</h2>
                                                    <h4><v-icon small>mdi-cube</v-icon> TRANSFORMERS</h4>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                        </div>
                            
                                    <v-btn class="me-2" @click="" depressed>
                                        <v-icon small>mdi-magnify</v-icon> View Assets
                                    </v-btn>
                            
                        </v-tab-item>
                    </v-tabs-items>
                </v-card-text>
            </v-card>
        </v-dialog-->
        
        <!-- Add new branch dialog -->
        <v-dialog v-model="addBranchDialog" persistent max-width="500">
            <v-card>
                <v-toolbar dark dense color="red">
                    <v-card-title>Add a New Branch</v-card-title>

                    <v-spacer></v-spacer>

                    <v-btn @click="addBranchDialog = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                
                <v-form
                    ref="createForm"
                    v-model="valid"
                    lazy-validation
                >
                <v-card-text>
                    <v-row class="body-row" dense>
                        <v-col cols="12" sm="12">
                            <span class="text-h6">Branch Profile</span>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field 
                                v-model="newBranch.branch_name" 
                                :rules="branchNameRules"
                                color="red darken-2" 
                                label="Branch Name" 
                                 
                                    
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea 
                                v-model="newBranch.description"
                                color="red darken-2" 
                                label="Details" 
                                maxlength="240" 
                            ></v-textarea>
                        </v-col>
                    </v-row>

                    <v-divider></v-divider>

                    <!--v-row class="body-row" dense>
                        <v-col cols="12" sm="12">
                            <span class="text-h6">Subscription Details</span>
                        </v-col>
                        <v-col cols="12" sm="12">  
                            <v-card class="mb-4" outlined tile>
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                    <h3 class="pa-5 pb-1">C8 Vortex Advance</h3>
                                    <v-card-text class="pt-1">
                                        <div class="price">
                                        <h1>{{ subscriptions.advanced.price }}</h1>
                                        </div>
                                    </v-card-text>
                                    </div>
                                </div>
                                <v-divider></v-divider>

                                <v-row class="pa-2" no-gutters>
                                    <v-col v-for="n in subscriptions.advanced.inclusions" :key="n" cols="12" sm="4">
                                        <div class="d-flex">
                                            <v-icon color="green" class="mr-3"> mdi-check </v-icon>
                                            <div class="pa-2" outlined tile>{{ n }}</div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row-->
                </v-card-text>
            
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn :disabled="loading" color="info" apend-icon="mdi-content-save-plus-outline" elevation="3" @click="createBranch()" small
                        >{{ loading ? "Adding..." : "Add Branch" }}<v-icon v-if="!loading" right dark>mdi-arrow-right</v-icon>
                    </v-btn>
                </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

        <!--Update Branch Dialog-->
        <v-dialog v-model="updateBranchDialog" persistent max-width="50%">
            <v-card>
                <v-toolbar dark dense color="red">
                    <v-card-title>Update Branch for {{ titleName }}</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="updateBranchDialog = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                
                <v-form
                        ref="updateForm"
                        v-model="valid"
                        lazy-validation
                >
                    <v-card-text>
                            <v-row class="body-row" dense>
                                <v-col cols="12" sm="12">
                                    <span class="text-h6">Branch Profile</span>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field 
                                        v-model="focusBranch.branch_name" 
                                        color="red darken-2" 
                                        label="Branch Name" 
                                        :rules="branchNameRules"
                                        dense 
                                        outlined 
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-textarea 
                                        v-model="focusBranch.description" 
                                        color="red darken-2" 
                                        label="Details" 
                                        maxlength="240" 
                                        dense 
                                        outlined></v-textarea>
                                </v-col>
                            </v-row>
                    </v-card-text>
                </v-form>

                <!-- <v-card-actions class="pa-4"> -->
                <v-list-item class="pa-2 pb-1">
                    <v-spacer></v-spacer>
                    <v-btn :disabled="loading" depressed color="info" apend-icon="mdi-content-save-plus-outline" elevation="3" small @click="updateBranch()"
                        >{{ loading ? "Saving..." : "Update Branch" }}<v-icon v-if="!loading" right dark>mdi-content-save</v-icon>
                    </v-btn>
                <!-- </v-card-actions> -->
                </v-list-item>
            </v-card>
        </v-dialog>

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
        
        <!--Subscription Dialog>
        <v-dialog v-model="subscriptionDialog" persistent max-width="50%">
            <v-card>
                <v-toolbar dark dense color="red">
                    <v-card-title>Manage Subscription for {{ focusBranch.branch_name }}</v-card-title>

                    <v-spacer></v-spacer>

                    <v-btn @click="subscriptionDialog = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text>
                    <v-row class="body-row" dense>
                        <v-col cols="12" sm="12">  
                            <v-card class="mb-4" outlined tile>
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <h3 class="pa-5 pb-1">C8 Vortex Advance</h3>
                                        <v-card-text class="pt-1">
                                            <div class="price">
                                            <h1>{{ subscriptions.advanced.price }}</h1>
                                            </div>
                                        </v-card-text>
                                    </div>
                                    
                                    <div class="pr-4">
                                        <v-btn v-if="focusBranch.subscription_type == 'Advanced'" block :dark="!loading" :disabled="loading" color="orange" @click="manageSub()">{{
                                            loading ? "Please wait..." : "Manage Subscription"
                                        }}</v-btn>
                                        <v-btn v-if="focusBranch.subscription_type != 'Advanced'" block dark color="orange darken-2" @click="">Get Advance
                                        </v-btn>
                                        <div class="pr-4 pt-2">
                                            <div v-if="subscription_type == 'advanced'">Expiration: {{ expiration_date }}</div>
                                        </div>
                                    </div>
                                </div>
                                <v-divider></v-divider>

                                <v-row class="pa-2" no-gutters>
                                    <v-col v-for="n in subscriptions.advanced.inclusions" :key="n" cols="12" sm="4">
                                        <div class="d-flex">
                                            <v-icon color="green" class="mr-3"> mdi-check </v-icon>
                                            <div class="pa-2" outlined tile>{{ n }}</div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog-->
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

            loading: false,

            //Search Data
            tab: "asset",
            search: "",
            searchQuery: "",        
            searchField: 'Name',
            searchOptions: [
                "Name",
                "Total Transformers", 
                "Status", 
                "Activation Date",
                "End Date",
                "Total Users",
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
                    text: "Total Transformers",
                    align: "start",
                    sortable: true,
                    value: "assets",
                },
                {
                    text: "Status",
                    align: "start",
                    sortable: true,
                    value: "status",
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
                {
                    text: "Total Users",
                    align: "start",
                    sortable: true,
                    value: "total_users",
                },
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

            /*
            {
                branch_name: "USA",
                image: "@/assets/branch-placeholder.png",
                description: "Description of branch goes here. This description is for branch 1, USA. Recently opened with fresh, top of the line assets.",
                activation_date: "2024-11-01",
                expiration_date: "2025-3-31",
                subscription_type: "Advanced",
                subscription_status: "Active",
                total_users: 5,
                total_assets: 9,
                total_sites: 2,
                total_substations: 3,
                total_transformers: 4,
            },
            {
                branch_name: "Philippines",
                image: "@/assets/branch-placeholder.png",
                description: "Description of branch goes here. This description is for branch 2, Philippines. This serves as the main hub for the company.",
                activation_date: "2024-12-01",
                expiration_date: "2025-4-31",
                subscription_type: "Advanced",
                subscription_status: "Active",
                total_users: 10,
                total_assets: 3,
                total_sites: 2,
                total_substations: 3,
                total_transformers: 5,
            },
            {
                branch_name: "India",
                image: "@/assets/branch-placeholder.png",
                description: "Description of branch goes here. This description is for branch 3, India. This branch is currently inactive.",
                activation_date: "2024-09-01",
                expiration_date: "2025-1-31",
                subscription_type: "Advanced",
                subscription_status: "Inactive",
                total_users: 0,
                total_assets: 0,
                total_sites: 0,
                total_substations: 0,
                total_transformers: 0,
            },
            */
        };
    },
    computed: {
        /*
        filteredHeaders() {
            return this.user.account_level === "company_admin"
                ? this.headers
                : this.headers.filter(header => header.text !== "Actions");
        }
        */
        filteredBranches() {
            if (!this.searchQuery) return this.branches;

            // Map UI-friendly field names to database field names (including nested ones)
            const fieldMap = {
                "Name": "branch_name",
                "Total Users": "users_count",
                "Activation Date": "subscription.activation_date",
                "End Date": "subscription.expiration_date",
                "Status": "status",
                "Total Transformers": "transformers_count",
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
                
                //Getting user roles
                if(this.authUser.role){    
                    this.user_full_role = this.authUser.role.name;
                    const split_role = this.user_full_role.split(" ")
                    this.user_level = split_role[0];
                    this.user_role = split_role[1];
                }

                await this.getBranches();
            } else {
                this.showUnauthorizedDialog();
            }
        },

        updateBranch() {
            //Validate
            let isValid = this.$refs.updateForm.validate();
            if (!isValid) {
                // console.log("Form validation failed.");
                return; // Stop execution if form is invalid
            }

            let payload = {
                id: this.focusBranch.id,
                branch_name: this.focusBranch.branch_name,
                description: this.focusBranch.description,
            };
            this.loading = true;
            axios({
                url: process.env.VUE_APP_BASEURL + "/updateBranch",
                method: "PATCH",
                data: payload,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Bearer" + JSON.parse(localStorage.getItem("user")).token,
                },
            }).then((response) => {
                // console.log("Response: ", response);
                let updatedData = { 
                    branch_name: response.data.branch_name,
                    description: response.data.description,
                }

                // console.log("Branches: ", this.branches);
                this.branches = this.branches.map(branch =>
                    branch.id === response.data.id
                        ? {...branch, ...updatedData}
                        : branch
                );
                this.updateBranchDialog = false;
                this.success_dialog = true;
                this.successMessage = "Branch updated successfully.";
            }).catch((err) => {
                this.validation_dialog = true;
                this.dialogMessage = err.response.data.error || "Error: An error occured while updating the branch.";
            })
        },

        createBranch() {
            //Validate
            let isValid = this.$refs.createForm.validate();
            if (!isValid) {
                // console.log("Form validation failed.");
                return; // Stop execution if form is invalid
            }

            //this.startTokenRefreshChecker();
            this.loading = true;

            const userDataJSON = localStorage.getItem("user");
            const userData = JSON.parse(userDataJSON);

            const company_id = userData.user.company_id;
            this.newBranch.company_id = company_id;

            axios({
                url: process.env.VUE_APP_BASEURL + "/createBranch",
                method: "POST",
                data: this.newBranch,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Bearer" + JSON.parse(localStorage.getItem("user")).token,
                },
            }).then((response) => {
                // console.log("Response", response);

                const createdAt = new Date(response.data.created_at).toLocaleDateString();
                const responseDataWithLocalizedDate = {
                    ...response.data.branch,
                    created_at: createdAt,
                    subscription: response.data.subscription[0],
                    status: "ACTIVE",
                }

                this.branches.push(responseDataWithLocalizedDate);
                // console.log("Branches: ", this.branches);

                this.newBranch = {};
                this.addBranchDialog = false;
                this.loading = false;

                this.success_dialog = true;
                this.successMessage = "Branch created successfully.";
            }).catch((err) => {
                this.loading = false;
                this.validation_dialog = true;
                this.dialogMessage = err.response.data.error || "Error: An error occured while creating the branch.";
            })
            
            
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

        async getBranches() {
            try {
                const response = await axios({
                    url: process.env.VUE_APP_BASEURL + '/branches',
                    method: "GET",
                    headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
                });

                // console.log(response);

                this.branches = response.data.branches;
                this.subscription = response.data.subscriptions[0] || null;

                //Inserting subscription data to branches
                this.branches = this.branches.map(branch => ({
                    ...branch,
                    subscription: this.subscription,
                    status: "ACTIVE",
                }))

                // console.log("Branches on load: ", this.branches);
                this.user = JSON.parse(localStorage.getItem("user")).user;
            } catch (err) {
                //console.log(err);
                //this.showUnauthorizedDialog();
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

        //Authentication
        // async initializeUsers() {
        //     const storage = JSON.parse(localStorage.getItem("user"));
        //     if (!storage || !storage.user) return;

        //         const tokenExp = JSON.parse(localStorage.getItem("token_expiry"));

        //     if (storage.user.account_type === 'microsoft') {
        //         await this.handleMicrosoftToken(storage, tokenExp);
        //     } else if (storage.user.account_type === 'google') {
        //         await this.handleGoogleToken(storage, tokenExp);
        //     }
        // },

        // async handleMicrosoftToken(storage, tokenExp) {
        //     if (this.isTokenValid(tokenExp.tokenExpiry)) {
        //         this.makeAuthenticatedRequest(storage.token);
        //     } else {
        //         await this.refreshTokenAndMakeRequest('microsoft');
        //     }
        // },

        // async handleGoogleToken(storage, tokenExp) {
        //     if (this.isTokenValid(tokenExp.tokenExpiry)) {
        //         this.makeAuthenticatedRequest(storage.token);
        //     } else {
        //         await this.refreshTokenAndMakeRequest('google');
        //     }
        // },

        // isTokenValid(expiry) {
        //     return new Date(expiry) > new Date();
        // },

        // async refreshTokenAndMakeRequest(accountType, userId) {
        //     try {
        //         if (accountType === 'google') {
        //             await this.refreshGoogleToken();
        //         } else if (accountType === 'microsoft') {
        //             await this.refreshMicrosoftToken();
        //         }
        //         const storage = JSON.parse(localStorage.getItem("user"));
        //         if (storage && storage.token) {
        //             if (accountType === 'google') {
        //                 this.makeAuthenticatedRequest(storage.token);
        //             } else {
        //                 this.makeAuthenticatedRequest(storage.token, userId);
        //             }
        //         }
        //     } catch (error) {
        //         console.error('Error refreshing tokens:', error);
        //     }
        // },

        // async refreshGoogleToken() {
        //     const storage = JSON.parse(localStorage.getItem("user"));
        //     const { id_token } = await refreshGoogleToken(storage.user.refresh_token);
        //     let user = JSON.parse(localStorage.getItem("user"));
        //     user.token = id_token;
        //     localStorage.setItem("user", JSON.stringify(user));

        //     const decodedToken = jwtDecode(id_token);
        //     const tokenExpiry = new Date(decodedToken.exp * 1000).toISOString();
        //     localStorage.setItem("token_expiry", JSON.stringify({ tokenExpiry }));
        // },

        // async refreshMicrosoftToken() {
        //     try {
        //         const account = msalInstance.getAllAccounts()[0];
        //         const response = await msalInstance.acquireTokenSilent({
        //         scopes: ["user.read", "offline_access"],
        //         account
        //         });
        //         const tokenExpiry = response.expiresOn.toISOString();
        //         let user = JSON.parse(localStorage.getItem("user"));
        //         user.token = response.accessToken;
        //         localStorage.setItem("user", JSON.stringify(user));
        //         localStorage.setItem("token_expiry", JSON.stringify({ tokenExpiry }));
        //     } catch (error) {
        //         console.error('Error acquiring tokens:', error);
        //         await msalInstance.loginRedirect({ scopes: ["user.read", "offline_access"] });
        //     }
        // },

        // makeAuthenticatedRequest() {
        //     this.authUser = JSON.parse(localStorage.getItem("user")).user;
        //     this.getBranches();
        // },
    }
};
</script>
