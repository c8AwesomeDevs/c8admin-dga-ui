<template>
  <div class="pa-3">
    <loading-overlay :visible="page_load" />

    <v-card>
      <v-sheet class="py-6 px-4" dark color="red darken-2" style="color: white;">
        <span class="text-h6">All Registered Companies</span>
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
          :headers="tableHeaders"
          :items="paginatedUsers"
          item-value="id"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td class="font-sm">{{ item.id }}</td>
                <td class="font-sm">{{ item.company_name }}</td>
                <td class="font-sm">{{ item.domain }}</td>
                <td class="font-sm">{{ item.country }}</td>
                <td class="font-sm">{{ item.industry }}</td>
                <td class="font-sm">{{ item.hear_aboutus }}</td>
                <td class="font-sm">{{ item.total_users }}</td>
                <td class="font-sm">
                  <v-btn icon small @click="viewCompany(item)">
                    <v-icon small>mdi-account-circle</v-icon>
                  </v-btn>
                  <v-btn icon small @click="viewCompanyAssetHierarchy(item)">
                    <v-icon small>mdi-office-building</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { initializeUsers } from "@/utils/authUtils.js";
import { beforeRouteEnter } from "@/utils/routeUtils.js";
import axios from "axios";

export default {
  name: "Company",
  components: { LoadingOverlay },
  beforeRouteEnter,
  data() {
    return {
      page_load: true,
      tableSearch: '',
      selectSearch: 'Company Name',
      searchOptions: [
        'Company Name',
        'Domain',
        'Country',
        'Industry',
        'Total Users',
        'Heard Through',
      ],
      fieldMap: {
        'Company ID': 'id',
        'Company Name': 'company_name',
        'Domain': 'domain',
        'Country': 'country',
        'Industry': 'industry',
        'Total Users': 'total_users',
        'Heard Through': 'hear_aboutus',
      },
      users: [],
      currentPage: 1,
      rowsPerPage: 10,
    };
  },
  created() {
    this.$store.commit("setTitle", "Companies");
  },
  async mounted() {
    const token = await initializeUsers();
    await this.makeAuthenticatedRequest(token);
    this.page_load = false;
  },
  computed: {
    tableHeaders() {
      return [
        { text: 'Company ID', value: 'id' },
        { text: 'Company Name', value: 'company_name' },
        { text: 'Domain', value: 'domain' },
        { text: 'Country', value: 'country' },
        { text: 'Industry', value: 'industry' },
        { text: 'Heard Through', value: 'hear_aboutus' },
        { text: 'Total Users', value: 'total_users' },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
    },
    filteredUsers() {
      if (!this.tableSearch) return this.users;
      const field = this.fieldMap[this.selectSearch];
      return this.users.filter(user =>
        user[field]?.toLowerCase().includes(this.tableSearch.toLowerCase())
      );
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      return this.filteredUsers.slice(start, start + this.rowsPerPage);
    },
    pageStart() {
      return (this.currentPage - 1) * this.rowsPerPage;
    },
    pageEnd() {
      return Math.min(this.currentPage * this.rowsPerPage, this.filteredUsers.length);
    },
  },
  methods: {
    async makeAuthenticatedRequest(token) {
      if (token) {
        await this.getCompanies();
      } else {
        console.warn("Unauthorized");
      }
    },
    async getCompanies() {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_BASEURL}/companies`,
          {
            headers: {
              Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
            },
          }
        );

        this.users = res.data.map(c => ({
          ...c,
          domain: c.domain || "-",
          company_name: c.company_name || "-",
          country: c.country || "-",
          industry: c.industry || "-",
          hear_aboutus: c.hear_aboutus || "-",
          total_users: c.users_count ?? 0,
        }));
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    },
    nextPage() {
      if (this.pageEnd < this.filteredUsers.length) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    viewCompany(item) {
      this.$router.push({ name: 'Company Users', params: { id: item.id } });
    },
    viewCompanyAssetHierarchy(item) {
      this.$router.push({ name: 'Company Asset Hierarchy', params: { id: item.id } });
    },
  },
};
</script>

<style scoped>
</style>
