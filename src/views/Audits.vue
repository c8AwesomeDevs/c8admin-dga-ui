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
        All <span style="color: lightgreen">{{ companyName }}</span> -> <span style="color: lightgreen">{{ branchName }}</span> Audits
      </span>
    </div>

    <!-- Right side: Add Audit button -->
    <v-btn 
      color="success" 
      small 
      @click="openAuditDialog"
    >
      <v-icon>mdi-plus</v-icon>
      Add Audit
    </v-btn>
  </div>
</v-sheet>

      <!-- <v-sheet
        class="pa-3 d-flex align-center justify-space-between"
        dark
        color="red darken-2"
        style="color: white;"
      >
      
      <span class="text-h6">
        <v-btn icon small @click="goBack()" class="mr-2">
            <v-icon medium>mdi-arrow-left</v-icon>
        </v-btn>
        All Company Audits</span>

      
      </v-sheet> -->

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
            { text: 'PO Number', value: 'PO_number' },
            { text: 'Renewal Date', value: 'renewal_date' },
            { text: 'Old Expiration Date', value: 'old_expiration_date' },
            { text: 'Old Renewal Date', value: 'old_renewal_date' },
            // { text: 'Added Transformer Count', value: 'added_transformer_count' },
            { text: 'Actions', value: 'actions', sortable: false }
          ]"
          :items="filteredAudits"
          item-value="id"
        >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td class="font-sm">{{ item.id }}</td>
              <td class="font-sm">{{ item.PO_number }}</td>
              <td class="font-sm">{{ item.renewal_date }}</td>
              <td class="font-sm">{{ item.old_expiration_date }}</td>
              <td class="font-sm">{{ item.old_renewal_date }}</td>
              <!-- <td class="font-sm">{{ item.added_transformer_count }}</td> -->
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

    <v-dialog v-model="addAuditDialog" persistent max-width="500">
        <v-card>
            <v-toolbar dark dense color="red">
                <v-card-title>Add a New Audit</v-card-title>

                <v-spacer></v-spacer>

                <v-btn @click="addAuditDialog = false" icon>
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
                        <span class="text-h6">Audit Profile</span>
                    </v-col>
                    <v-card-text>
                        <v-text-field
                            v-model="newAudit.PO_number"
                            label="PO Number"
                            dense
                            outlined
                            :rules="[v => !!v || 'PO Number is required']"
                        />

                        <v-text-field
                            v-model="newAudit.renewal_date"
                            label="Renewal Date"
                            type="date"
                            dense
                            outlined
                            :rules="[v => !!v || 'Renewal Date is required']"
                        />
                        <v-text-field v-model="newAudit.old_expiration_date" label="Old Expiration Date" type="date" dense outlined readonly/>
                        <v-text-field v-model="newAudit.old_renewal_date" label="Old Renewal Date" type="date" dense outlined readonly/>
                        <!-- <v-switch
                            v-model="newAudit.includeTransformers"
                            label="Include 10 Transformers"
                            color="success"
                            inset
                            dense
                            hide-details
                            >
                            <v-btn :value="10" color="success" outlined>
                                Include 10 Transformers
                            </v-btn>
                            <v-btn :value="0" color="grey darken-1" outlined>
                                Exclude Transformers
                            </v-btn>
                        </v-switch> -->
                    </v-card-text>
                </v-row>

                <v-divider></v-divider>
            </v-card-text>
        
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn :disabled="loading" color="info" apend-icon="mdi-content-save-plus-outline" elevation="3" @click="openConfirmDialog" small
                    >{{ loading ? "Adding..." : "Add Audit" }}<v-icon v-if="!loading" right dark>mdi-arrow-right</v-icon>
                </v-btn>
            </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">
          Confirm Add Audit
        </v-card-title>

        <v-card-text>
          Are you sure you want to add this new audit with the following details?
          <ul>
            <li><strong>PO Number:</strong> {{ newAudit.PO_number }}</li>
            <li><strong>Renewal Date:</strong> {{ newAudit.renewal_date }}</li>
            <li><strong>Old Expiration Date:</strong> {{ newAudit.old_expiration_date }}</li>
            <li><strong>Old Renewal Date:</strong> {{ newAudit.old_renewal_date }}</li>
          </ul>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="confirmDialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="confirmCreateAudit">Yes, Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      confirmDialog: false,
      branchName: '',
      companyName: '',
      page_load: true,
      tableSearch: '',
      selectSearch: 'PO Number',
      searchOptions: ['Audit ID', 'PO Number', 'Renewal Date', 'Old Expiration Date', 'Old Renewal Date'],
      fieldMap: {
        'Audit ID' : 'id',
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
      this.$store.commit("setTitle", "Audits");
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

    // async fetchSubscriptionDefaults() {
    //     try {
    //         const companyId = this.$route.params.id;

    //         const res = await axios({
    //         url: `${process.env.VUE_APP_BASEURL}/company/${companyId}/subscription`,
    //         method: "GET",
    //         headers: {
    //             Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    //         },
    //         });

    //         const subscription = res.data.subscription;

    //         this.newAudit.old_expiration_date = subscription?.expiration_date || '';
    //         this.newAudit.old_renewal_date = subscription?.activation_date || '';

    //     } catch (err) {
    //         console.warn("No subscription found for this company.");
    //         this.newAudit.old_expiration_date = '';
    //         this.newAudit.old_renewal_date = '';
    //     }
    // },

    async createAudit() {
        // const isValid = this.$refs.createForm.validate();
        const isValid = await this.$refs.createForm.validate();
        if (!isValid) return;

        this.loading = true;

        // const company_id = this.$route.params.id; // ✅ use the route param, not user

        // const payload = {
        //     ...this.newAudit,
        //     company_id, // ✅ explicitly include company_id
        // };

        const branch_id = this.$route.params.id;
        const payload = {
            ...this.newAudit,
            branch_id,
        };

        axios({
            url: process.env.VUE_APP_BASEURL + "/audits",
            method: "POST",
            data: payload,
            headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
            },
        })
            .then((response) => {
            this.audits.push(response.data.audit);
            this.success_dialog = true;
            this.successMessage = "Audit created successfully.";
            this.addAuditDialog = false;
            this.resetAuditForm();
            })
            .catch((err) => {
            console.error("Validation failed:", err.response?.data?.errors);
            this.validation_dialog = true;
            this.dialogMessage = err.response?.data?.message || "Validation error occurred.";
            })
            .finally(() => {
            this.loading = false;
            });
    },

    resetAuditForm() {
        const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
        this.newAudit = {
            PO_number: '',
            renewal_date: today,
            old_expiration_date: '',
            old_renewal_date: '',
            added_transformer_count: 0,
        };
    },

    async makeAuthenticatedRequest(token) {
      if (token != null) {
        await this.getAudits();
      }else{
        console.log("Unauthorized");
      }
    },

    // async getAudits() {
    //     try {
    //         const branchId = this.$route.params.id;

    //         const res = await axios({
    //         url: `${process.env.VUE_APP_BASEURL}/audits/branch/${branchId}`,
    //         method: "GET",
    //         headers: {
    //             Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    //         },
    //         });

    //         this.audits = res.data.map(c => ({
    //         ...c,
    //         domain: c.domain || "-",
    //         PO_number: c.PO_number || "-",
    //         renewal_date: c.renewal_date || "-",
    //         old_expiration_date: c.old_expiration_date || "-",
    //         old_renewal_date: c.old_renewal_date || "-",
    //         added_transformer_count: c.added_transformer_count ?? 0
    //         }));
    //     } catch (err) {
    //         console.error("Error fetching companies:", err);
    //     }
    // },

    async getAudits() {
    try {
      const branchId = this.$route.params.id;

      const res = await axios({
        url: `${process.env.VUE_APP_BASEURL}/audits/branch/${branchId}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      });

      this.companyName = res.data.company_name; 
      this.branchName = res.data.branch_name; 

      this.audits = res.data.audits.map(c => ({
        ...c,
        domain: c.domain || "-",
        PO_number: c.PO_number || "-",
        renewal_date: c.renewal_date || "-",
        old_expiration_date: c.old_expiration_date || "-",
        old_renewal_date: c.old_renewal_date || "-",
        added_transformer_count: c.added_transformer_count ?? 0
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

    async openConfirmDialog() {
      const isValid = await this.$refs.createForm.validate();
      if (!isValid) return;
      this.confirmDialog = true;
    },

    confirmCreateAudit() {
      this.confirmDialog = false;
      this.createAudit();
    },
  },
};
</script>

<style scoped>
</style>
