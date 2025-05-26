<template>
  <div class="pa-3">
    <loading-overlay :visible="page_load" />

    <v-card>
      <v-sheet
        class="py-6 px-4"
        dark
        color="red darken-2"
        style="color: white;"
      >
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
          :headers="[
            { text: 'Company Name', value: 'company_name' },
            { text: 'Country', value: 'country' },
            { text: 'Industry', value: 'industry' },
            { text: 'Quick Actions'}
          ]"
          :items="paginatedUsers"
          :items-per-page="rowsPerPage"
          hide-default-footer
        >
          <template v-slot:item.avatar="{ item }">
            <v-avatar size="30" color="red">
              <span style="color: white; user-select: none">{{ getInitials(item.name) }}</span>
            </v-avatar>
          </template>
        </v-data-table>

        <div class="pagination">
          <span>Showing {{ pageStart + 1 }}–{{ pageEnd }} of {{ filteredUsers.length }}</span>
          <v-btn small icon @click="prevPage" :disabled="currentPage === 1">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn small icon @click="nextPage" :disabled="pageEnd >= filteredUsers.length">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import axios from "axios";

export default {
  data() {
    return {
      page_load: false,
      tableSearch: '',
      selectSearch: 'Company Name',
      searchOptions: ['Company Name', 'Country', 'Industry'],
      fieldMap: {
        'Company Name': 'company_name',
        'Country': 'country',
        'Industry': 'industry',
      },
      selectView: 'Show All Users',
      users: [], // Add sample data for testing
      currentPage: 1,
      rowsPerPage: 10,
    };
  },
  computed: {
    filteredUsers() {
      if (!this.tableSearch) return this.users;
      const field = this.fieldMap[this.selectSearch];
      return this.users.filter(u => u[field]?.toLowerCase().includes(this.tableSearch.toLowerCase()));
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
    }
  },
  methods: {
    async getCompanies() {
      this.page_load = true;
      try {
        const res = await axios({
          url: process.env.VUE_APP_BASEURL + "/companies",
          method: "GET",
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        });

        this.users = res.data.map(c => ({
          ...c,
          company_name: c.company_name || "-",
          country: c.country || "-",
          industry: c.industry || "-",
        }));

      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        this.page_load = false;
      }
    },
    getInitials(name) {
      if (!name) return '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    nextPage() {
      if (this.pageEnd < this.filteredUsers.length) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  },
  mounted(){
    this.getCompanies();
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  gap: 10px;
}
</style>
