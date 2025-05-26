<template>
    <div class="pa-3">
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
  import axios from "axios";
  
  export default {
    data() {
      return {
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
    methods: {
        async fetchCompanyUsers() {
            try {
                const companyId = this.$route.params.id;
                const res = await axios.get(`${process.env.VUE_APP_BASEURL}/companies/${companyId}/users`, {
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                },
                });

                this.users = res.data.users;
                this.companyName = res.data.company_name;
            } catch (err) {
                console.error("Error fetching company users:", err);
            }
        },
    },
    mounted() {
      this.fetchCompanyUsers();
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
  