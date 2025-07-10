<template>
  <div class="pa-3">
    <loading-overlay :visible="page_load" />
    <v-card>
      <v-sheet class="py-6 px-4" dark color="red darken-2" style="color: white;">
  <div class="d-flex justify-space-between align-center">
    <!-- Left side: Back button + title -->
    <div class="d-flex align-center">
      <v-btn icon small @click="goBack()" class="mr-2">
        <v-icon medium>mdi-arrow-left</v-icon>
      </v-btn>
      <span class="text-h6">
        All Audits
      </span>
    </div>
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
          :headers="[
            { text: 'Audit ID', value: 'id' },
            { text: 'Company Name', value: 'company_name' },
            { text: 'Branch Name', value: 'branch_name' },
            { text: 'PO Number', value: 'PO_number' },
            { text: 'Renewal Date', value: 'renewal_date' },
            { text: 'Old Expiration Date', value: 'old_expiration_date' },
            { text: 'Old Renewal Date', value: 'old_renewal_date' },
            { text: 'Actions', value: 'actions', sortable: false }
          ]"
          :items="filteredAudits"
          item-value="id"
        >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td class="font-sm">{{ item.id }}</td>
              <td class="font-sm">{{ item.company_name }}</td>
              <td class="font-sm">{{ item.branch_name }}</td>
              <td class="font-sm">{{ item.PO_number }}</td>
              <td class="font-sm">{{ item.renewal_date }}</td>
              <td class="font-sm">{{ item.old_expiration_date }}</td>
              <td class="font-sm">{{ item.old_renewal_date }}</td>
              <td class="font-sm">
                <v-btn icon small @click="">
                  <v-icon small>mdi-eye</v-icon>
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
import { initializeUsers, startTokenRefreshChecker } from "@/utils/authUtils.js";
import { beforeRouteEnter } from "@/utils/routeUtils.js";
import axios from "axios";

export default {
  beforeRouteEnter,
  name: "Audits",
  components: {
    LoadingOverlay,
  },
  data() {
    const today = new Date().toISOString().split("T")[0];
    return {
    //   branchName: '',
    //   companyName: '',
      page_load: true,
      tableSearch: '',
      selectSearch: 'PO Number',
      searchOptions: ['Audit ID', 'Company Name', 'Branch Name', 'PO Number', 'Renewal Date', 'Old Expiration Date', 'Old Renewal Date'],
      fieldMap: {
        'Audit ID' : 'id',
        'Company Name': 'company_name',
        'Branch Name': 'branch_name',
        'PO Number': 'PO_number',
        'Renewal Date': 'renewal_date',
        'Old Expiration Date': 'old_expiration_date',
        'Old Renewal Date': 'old_renewal_date',
      },
      selectView: 'Show All Audits',
      users: [], // Add sample data for testing
      audits: [],
      currentPage: 1,
      rowsPerPage: 10,
      addAuditDialog: false,
      valid: true,
      newAudit: {
        PO_number: '',
        renewal_date: today,
        old_expiration_date: '',
        old_renewal_date: '',
        added_transformer_count: 10,
        includeTransformers: true,
      },
      loading: null,
      success_dialog: false,
      successMessage: "",
      validation_dialog: false,
      dialogMessage: "",
    };
  },    
  created() {
      this.$store.commit("setTitle", "All Audits");
  },
  async mounted() {
    const token = await initializeUsers();
    await this.makeAuthenticatedRequest(token);
    this.page_load = false;
  },

  computed: {
    filteredAudits() {
      if (!this.tableSearch) return this.audits;
      const field = this.fieldMap[this.selectSearch];
      return this.audits.filter(audit => 
        audit[field]?.toString().toLowerCase().includes(this.tableSearch.toLowerCase()));
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      return this.filteredAudits.slice(start, start + this.rowsPerPage);
    },
    pageStart() {
      return (this.currentPage - 1) * this.rowsPerPage;
    },
    pageEnd() {
      return Math.min(this.currentPage * this.rowsPerPage, this.filteredAudits.length);
    }
  },
  watch: {
    'newAudit.includeTransformers'(val) {
        this.newAudit.added_transformer_count = val ? 10 : 0;
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },

    openAuditDialog() {
        this.addAuditDialog = true;
        this.resetAuditForm();

        // const companyId = this.$route.params.id;
        const branchId = this.$route.params.id;
        this.fetchSubscriptionDefaults(branchId);
    },

    async fetchSubscriptionDefaults(branchId) {
        try {
            // const branchId = this.$route.params.id;
            const res = await axios({
            url: `${process.env.VUE_APP_BASEURL}/branch/${branchId}/subscription`,
            method: "GET",
            headers: {
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
            },
            });

            const subscription = res.data.subscription;

            if (subscription) {
            this.newAudit.old_expiration_date = subscription.expiration_date;
            this.newAudit.old_renewal_date = subscription.activation_date;
            }
        } catch (err) {
            console.error("Failed to fetch subscription for audit defaults", err);
        }
    },

    async makeAuthenticatedRequest(token) {
      if (token != null) {
        await this.getAudits();
      }else{
        console.log("Unauthorized");
      }
    },

    async getAudits() {
        try {
            const res = await axios({
            url: `${process.env.VUE_APP_BASEURL}/audits/all`,
            method: "GET",
            headers: {
                Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
            },
            });

            this.audits = res.data.audits.map(audit => ({
            ...audit,
            PO_number: audit.PO_number || "-",
            renewal_date: audit.renewal_date || "-",
            old_expiration_date: audit.old_expiration_date || "-",
            old_renewal_date: audit.old_renewal_date || "-"
            }));
        } catch (err) {
            console.error("Error fetching audits:", err);
        }
    },

    getInitials(name) {
      if (!name) return '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    nextPage() {
      if (this.pageEnd < this.filteredAudits.length) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
};
</script>

<style scoped>
</style>
