<template>
    <div class="pa-3">
      <loading-overlay :visible="page_load" />
      <v-card>
        <v-sheet class="py-6 px-4" dark color="red darken-2" style="color: white;">
          <div class="text-h6">Users in {{ companyName }}</div>
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
            class="elevation-1"
          >
            <template v-slot:item.role="{ item }">
              <span>{{ item.role?.name || 'Not Assigned' }}</span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  import LoadingOverlay from "@/components/LoadingOverlay.vue";
  import { initializeUsers } from "@/utils/authUtils.js";
  import axios from "axios";

  export default {
    name: "CompanyUsers",
    components: {
      LoadingOverlay,
    },
    data() {
      return {
        page_load: true,
        companyName: '',
        users: [],
        tableSearch: '',
        selectSearch: 'Name',
        searchOptions: ['Name', 'Email', 'Account Type', 'Role'],
        fieldMap: {
        Name: 'name',
        Email: 'email',
        'Account Type': 'account_type',
        Role: 'role.name',
        },
        headers: [
          { text: "Name", value: "name" },
          { text: "Email", value: "email" },
          { text: "Account Type", value: "account_type" },
          { text: "Role", value: "role" },
        ],
      };
    },
    created() {
      this.$store.commit("setTitle", "Company/Company Users");
    },
    async mounted() {
      const token = await initializeUsers();
      await this.makeAuthenticatedRequest(token);
      this.page_load = false;
    },
    methods: {
      async makeAuthenticatedRequest(token) {
        if(token != null){
          await this.fetchCompanyUsers(); 
        }else{
          console.log("Unauthorized");
        }
      },
        async fetchCompanyUsers() {
            try {
                const companyId = this.$route.params.id;
                const companyName = await axios.get(`${process.env.VUE_APP_BASEURL}/company/${companyId}`, {
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                },
                });
                const res = await axios.get(`${process.env.VUE_APP_BASEURL}/company/${companyId}/users`, {
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                },
                });

                this.users = res.data.users;
                this.companyName = companyName.data.company_name;
            } catch (err) {
                console.error("Error fetching company users:", err);
            }
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
  