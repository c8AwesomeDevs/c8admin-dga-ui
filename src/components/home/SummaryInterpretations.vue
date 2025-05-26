<template>
  <div>
    <v-data-table
      dense
      :headers="filteredHeaders"
      :items-per-page="8"
      :items="filteredHistoricalData"
      item-key="name"
      class="elevation-1 pa-1"
    >
      <template v-slot:item="{ item }">
        <tr @click="showInterpretations(item)">
          <td>
            <span class="font-sm">{{ dateFormat(item.timestamp) }}</span>
          </td>
          <td v-if="shouldShow('t1', item.oil_type)" >
            <div :class="getCircleClass(item.t1)"></div>
          </td>
          <td v-if="shouldShow('t2', item.oil_type)" >
            <div :class="getCircleClass(item.t2)"></div>
          </td>
          <td v-if="shouldShow('t3', item.oil_type)" >
            <div :class="getCircleClass(item.t3)"></div>
          </td>
          <td v-if="shouldShow('t4', item.oil_type)" >
            <div :class="getCircleClass(item.t4)"></div>
          </td>
          <td v-if="shouldShow('t5', item.oil_type)" >
            <div :class="getCircleClass(item.t5)"></div>
          </td>
          <td v-if="shouldShow('t6', item.oil_type)" >
            <div :class="getCircleClass(item.t6)"></div>
          </td>
          <td v-if="shouldShow('t7', item.oil_type)" >
            <div :class="getCircleClass(item.t7)"></div>
          </td>
          <td v-if="shouldShow('p1', item.oil_type)" >
            <div :class="getCircleClass(item.p1)"></div>
          </td>
          <td v-if="shouldShow('p2', item.oil_type)" >
            <div :class="getCircleClass(item.p2)"></div>
          </td>
          <td v-if="shouldShow('uni_penta', item.oil_type)" >
            <div :class="getCircleClass(item.uni_penta)"></div>
          </td>
          <td v-if="shouldShow('cigre_p1', item.oil_type)" >
            <div :class="getCircleClass(item.cigre_p1)"></div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <interpretations-details :details="attribute_value_details" :show="showInterpretationsPopup" @close="hideLogPopup"></interpretations-details>
  </div>
  
</template>
<style>
.font-sm {
  font-size: 12px !important;
}
.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.normal {
  background-color: green;
}

.not-normal {
  background-color: red;
}

.denser-header {
  padding: 0 !important;
}
</style>
<script>
import InterpretationsDetails from "@/components/popups/InterpretationsDetails.vue";
export default {
  name: "SummaryInterpretation",
  props: ["historical_data"],
  components: {
    InterpretationsDetails,
  },
  data() {
    return {
      headerMapping: {
      "Mineral Oil": ["t1", "t4", "t5"],
      "LTC": ["t2"],
      "BioTemp": ["t3"],
      "FR3": ["t3"],
      "Midel": ["t3"],
      "LTF FR3": ["t6", "t7"],
      "All Oils": ["p1", "p2", "uni_penta", "cigre_p1"],
    },
      headers: [
        { text: "Timestamp", align: "start", sortable: true, value: "timestamp" },
        { text: "T1", align: "start", sortable: false, value: "t1" },
        { text: "T2", align: "start", sortable: false, value: "t2" },
        { text: "T3", align: "start", sortable: false, value: "t3" },
        { text: "T4", align: "start", sortable: false, value: "t4" },
        { text: "T5", align: "start", sortable: false, value: "t5" },
        { text: "T6", align: "start", sortable: false, value: "t6" },
        { text: "T7", align: "start", sortable: false, value: "t7" },
        { text: "P1", align: "start", sortable: false, value: "p1" },
        { text: "P2", align: "start", sortable: false, value: "p2" },
        { text: "UP", align: "start", sortable: false, value: "uni_penta" },
        { text: "CUP", align: "start", sortable: false, value: "cigre_p1" },
      ],
      showInterpretationsPopup: false,
      attribute_value_details: {},
    };
  },
  computed: {
    filteredHistoricalData() {
      return this.historical_data.filter(item => this.headerMapping[item.oil_type]);
    },
    filteredHeaders() {
      const displayedColumns = new Set(["timestamp"]);
      this.filteredHistoricalData.forEach(item => {
        (this.headerMapping[item.oil_type] || []).forEach(column => displayedColumns.add(column));
        this.headerMapping["All Oils"].forEach(column => displayedColumns.add(column));
      });
      return this.headers.filter(header => displayedColumns.has(header.value));
    },
  },
  methods: {
    shouldShow(column, oilType) {
      return this.headerMapping[oilType]?.includes(column) || this.headerMapping["All Oils"].includes(column);
    },
    getCircleClass(value) {
      return value === "Normal" ? "circle normal" : "circle not-normal";
    },
    dateFormat(date) {
      return new Date(date).toLocaleString();
    },
    showInterpretations(item) {
      this.attribute_value_details = item;
      this.showInterpretationsPopup = true;
      // console.log(this.historical_data);
    },
   
    
    hideLogPopup() {
      this.showInterpretationsPopup = false;
    },
  },
};
</script>
