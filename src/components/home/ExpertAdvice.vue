<template>
    <v-card class="mb-5" outlined elevation="0">
        <v-toolbar dense color="red darken-3" dark elevation="0">
            <v-toolbar-title class="font text-uppercase font-weight-medium">Expert Advice</v-toolbar-title>
        </v-toolbar>
        <v-container>
            <v-data-table dense :headers="headers" :items="historical_data" @click:row="showExpertAdviceDialog" :items-per-page="5">
                <!-- Date Formatting -->
                <template v-slot:item.timestamp="{ item }">
                    {{ formatDate(item.timestamp) }}
                </template>

                <!-- ROC Gas Limit -->
                <template v-slot:item.roc_gas_limit="{ item }">
                    <td :style="getCellStyle(item.roc_gas_limit)">
                        {{ cleanValue(item.roc_gas_limit) }}
                    </td>
                </template>

                <!-- Absolute Gas Limit -->
                <template v-slot:item.absolute_gas_limit="{ item }">
                    <td :style="getCellStyle(item.absolute_gas_limit)">
                        {{ cleanValue(item.absolute_gas_limit) }}
                    </td>
                </template>

                <!-- Dangerous Zone State -->
                <template v-slot:item.dangerous_zone_state="{ item }">
                    <td :style="getCellStyle(item.dangerous_zone_state)">
                        {{ cleanValue(item.dangerous_zone_state) }}
                    </td>
                </template>

            </v-data-table>
        </v-container>
        <ExpertAdviceDialog :details="selectedRow" :show="showExpertAdvicePopup" @close="hideExpertAdvicePopup" />
    </v-card>
</template>

<script>
import ExpertAdviceDialog from '../popups/ExpertAdviceDialog.vue';
export default {
    name: "ExpertAdvice",
    props: ["historical_data"],
    components: {
        ExpertAdviceDialog,
  },
    data() {
        return {
            selectedRow: null,
            showExpertAdvicePopup: false,
            headers: [
                { text: 'Data Source', align: 'start', sortable: false, value: 'data_source' },
                { text: 'Date/Time', value: 'timestamp' },
                { text: 'Primary Fault', value: 'primary_fault' },
                { text: 'Secondary Fault', value: 'secondary_fault' },
                { text: 'Possible Insulation Status', value: 'possible_insulation_status' },
                { text: 'Absolute Gas Limit', value: 'absolute_gas_limit' },
                { text: 'ROC Gas Limit', value: 'roc_gas_limit' },
                { text: 'Dangerous Zone State', value: 'dangerous_zone_state' },
                { text: 'Additional Tests', value: 'additional_tests' },
                { text: 'Recommended Actions', value: 'recommended_actions' },
            ],
        };
    },
    methods: {
        formatDate(date) {
            if (!date) return "";
            const d = new Date(date);
            return isNaN(d) ? "Invalid Date" : d.toLocaleString();
        },
        getCellStyle(value) {
            if (!value) return {};
            if (value.includes("Normal")) return { color: "#4CAF50" }; // Green
            if (value.includes("Warning")) return { color: "#FFC107" }; // Yellow
            if (value.includes("Severe") || value.includes("D2")) return { color: "#F44336" }; // Red
            return {};
        },
        cleanValue(value) {
            return value.replace(/(Warning: |Severe: )/, "").trim();
        },

        
        showExpertAdviceDialog(item) {
            this.selectedRow = item;
            this.showExpertAdvicePopup = true;
        },
        
        hideExpertAdvicePopup() {
            this.showExpertAdvicePopup = false;
        },


    },

};
</script>
