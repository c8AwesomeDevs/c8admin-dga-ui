<template>
  <v-card class="mt-2" outlined elevation="0">
    <v-toolbar dense color="red darken-3" dark elevation="0">
      <v-toolbar-title class="font text-uppercase font-weight-medium">Other Interpretations ({{ new Date(latest_data.timestamp).toLocaleDateString() }})</v-toolbar-title>
    </v-toolbar>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Type</th>
            <th class="text-left">Interpretation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">IEC Ratio</td>
            <td class="text-left pa-2" :class="{ noData: !latest_data.iec_ratio }">{{ latest_data.iec_ratio ? latest_data.iec_ratio : "No data available" }}</td>
          </tr>
          <tr>
            <td class="text-left">Dornenburg</td>
            <td class="text-left pa-2" :class="{ noData: !latest_data.dornenberg }">{{ latest_data.dornenberg ? latest_data.dornenberg : "No data available" }}</td>
          </tr>
          <tr>
            <td class="text-left">Roger's Ratio</td>
            <td class="text-left pa-2" :class="{ noData: !latest_data.rogers_ratio }">{{ latest_data.rogers_ratio ? latest_data.rogers_ratio : "No data available" }}</td>
          </tr>
          <tr>
            <td class="text-left">CO2/CO Ratio</td>
            <td class="text-left pa-2" :class="{ noData: !latest_data.carbon_ratio }">{{ latest_data.carbon_ratio ? latest_data.carbon_ratio : "No data available" }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>
<style scope>
.font {
  font-size: 14px;
}
</style>
<script>
import axios from "axios";
// import { symbolMixin } from "@/mixins/symbolMixin.js";

export default {
  name: "OtherInterpretations",
  // mixins: [symbolMixin],
  props: ["latest_data"],
  data() {
    return {
      // data: [],
      // symbol: {},
    };
  },
  mounted() {
    // this.getAttributeValues(this.elementID);
  },
  watch: {},
  methods: {},
};
</script>
