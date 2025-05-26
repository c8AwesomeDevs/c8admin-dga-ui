<template>
  <v-card>
    <v-toolbar dense color="red darken-3" dark>
      <v-toolbar-title>Summary of Duvals Interpretations</v-toolbar-title>
    </v-toolbar>
    <v-data-table :headers="headers" :items="data" item-key="name" class="elevation-1" color="red">
      <template v-slot:item="{ item }">
        <tr @click="viewAllDetails(item)">
          <td>
            <span class="font-sm">{{ dateFormat(item.timestamp) }}</span>
          </td>
          <td class="font-sm">
            <div :class="{ 'circle normal': item.t1 === 'Normal', 'circle not-normal': item.t1 !== 'Normal' }"></div>
          </td>
          <td class="font-sm">
            <div :class="{ 'circle normal': item.t2 === 'Normal', 'circle not-normal': item.t2 !== 'Normal' }"></div>
          </td>
          <td class="font-sm">
            <div :class="{ 'circle normal': item.t3 === 'Normal', 'circle not-normal': item.t3 !== 'Normal' }"></div>
          </td>
          <td class="font-sm">
            <div :class="{ 'circle normal': item.t4 === 'Normal', 'circle not-normal': item.t4 !== 'Normal' }"></div>
          </td>
          <td class="font-sm">
            <div :class="{ 'circle normal': item.t5 === 'Normal', 'circle not-normal': item.t5 !== 'Normal' }"></div>
          </td>
          <td class="font-sm">
            <div :class="{ 'circle normal': item.t6 === 'Normal', 'circle not-normal': item.t6 !== 'Normal' }"></div>
          </td>
          <td class="font-sm">
            <div :class="{ 'circle normal': item.t7 === 'Normal', 'circle not-normal': item.t7 !== 'Normal' }"></div>
          </td>
          <td class="font-sm">
            <div :class="{ 'circle normal': item.p1 === 'Normal', 'circle not-normal': item.p1 !== 'Normal' }"></div>
          </td>
          <td class="font-sm">
            <div :class="{ 'circle normal': item.p2 === 'Normal', 'circle not-normal': item.p2 !== 'Normal' }"></div>
          </td>
          <!-- <td class="font-sm">
            <v-btn depressed  elevation="3" color="red" x-small @click="viewComents(details)" >View</v-btn>
          </td> -->
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<style scoped>
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
</style>
<script>
export default {
  name: "SummaryInterpretation",
  props: ["data"],
  data() {
    return {
      headers: [
        {
          text: "Timestamp",
          align: "start",
          sortable: true,
          value: "timestamp",
        },
        {
          text: "T1",
          align: "start",
          sortable: false,
          value: "t1",
        },
        {
          text: "T2",
          align: "start",
          sortable: false,
          value: "t2",
        },
        {
          text: "T3",
          align: "start",
          sortable: false,
          value: "t3",
        },
        {
          text: "T4",
          align: "start",
          sortable: false,
          value: "t4",
        },
        {
          text: "T5",
          align: "start",
          sortable: false,
          value: "t5",
        },
        {
          text: "T6",
          align: "start",
          sortable: false,
          value: "t6",
        },
        {
          text: "T7",
          align: "start",
          sortable: false,
          value: "t7",
        },
        {
          text: "P1",
          align: "start",
          sortable: false,
          value: "p1",
        },
        {
          text: "P2",
          align: "start",
          sortable: false,
          value: "p2",
        },
      ],
    };
  },
  methods: {
    dateFormat(date) {
      let d = new Date(date);
      return d.toLocaleString();
    },
    viewAllDetails(item) {
      this.$emit('showDetails', item);
    },
  },
};
</script>
