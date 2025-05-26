<template>
  <v-card class="pa-1" outlined style="position: relative">
    <canvas :id="canvasID" :height="canvasHeight"></canvas>
  </v-card>
</template>

<script>
import axios from "axios";
import Chart from "chart.js";

export default {
  name: "MultiLineGraph",
  props: ["canvasID", "chartTitle", "historical_data", "showTrends", "trendLabels", "legends", "canvasHeight"],
  data() {
    return {
      data: [],
      // trends: ["timestamp", "c2h2", "c2h4", "ch4", "c2h6", "h2"],
      trends: [],
      legendOverride: [],
      filtered: {},
      colors: ["#8fb3ff", "#8ac62f", "#452ead", "#fb9223", "#cbd5aa", "#ca9c96", "#106f7a", "#fde6af"],
      chartRef: null,
    };
  },
  mounted() {
    this.trends = this.showTrends;
    this.legendOverride = this.legends;
    this.paintGraph();
    // this.getAttributeValues(this.elementID);
  },
  watch: {
    data() {
      this.paintGraph();
    },
    historical_data() {
      let newPayload = this.buildPayload();

      // first we remove all old labels and data by asigning them to empty array
      // i hope these gets garbage collected
      this.chartRef.chart.data.labels = [];
      this.chartRef.chart.data.datasets.forEach((q, qInd) => {
        q.data = [];
      });

      // then we push all new labels and data one-by-one
      newPayload.data.labels.forEach((q) => {
        this.chartRef.chart.data.labels.push(q);
      });
      newPayload.data.datasets.forEach((q, qInd) => {
        q.data.forEach((w, wInd) => {
          this.chartRef.chart.data.datasets[qInd].data.push(w);
        });
      });

      this.chartRef.chart.update(); // update the chart with everything new
      // console.log(this.chartRef);
    },
  },
  methods: {
    buildPayload() {
      // default payload
      let payload = {
        type: "line",
        data: {
          labels: ["1", "2"],
          datasets: [
            {
              label: "Acetylene",
              data: [1, 1],
              fill: false,
              borderColor: "#FF0000",
              borderWidth: 2,
              pointRadius: 2,
              lineTension: 0,
            },
            {
              label: "Ethylene",
              data: [2, 2],
              fill: false,
              borderColor: "#FFA500",
              borderWidth: 2,
              pointRadius: 2,
              lineTension: 0,
            },
            {
              label: "Methane",
              data: [3, 3],
              fill: false,
              borderColor: "#FFFF00",
              borderWidth: 2,
              pointRadius: 2,
              lineTension: 0,
            },
            {
              label: "Ethane",
              data: [4, 4],
              fill: false,
              borderColor: "#008000",
              borderWidth: 2,
              pointRadius: 2,
              lineTension: 0,
            },
            {
              label: "Hydrogen",
              data: [5, 5],
              fill: false,
              borderColor: "#0000FF",
              borderWidth: 2,
              pointRadius: 2,
              lineTension: 0,
            },
            {
              label: "Oxygen",
              data: [6, 6],
              fill: false,
              borderColor: "#4B0082",
              borderWidth: 2,
              pointRadius: 2,
              lineTension: 0,
            },
            {
              label: "Carbon Monoxide",
              data: [7, 7],
              fill: false,
              borderColor: "#7F00FF",
              borderWidth: 2,
              pointRadius: 2,
              lineTension: 0,
            },
            {
              label: "Carbon Dioxide",
              data: [8, 8],
              fill: false,
              borderColor: "#000000",
              borderWidth: 2,
              pointRadius: 2,
              lineTension: 0,
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            position: "bottom",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 2,
                },
              },
            ],
            xAxes: [
              {
                type: "time",
                time: {
                  unit: "hour",
                },
              },
            ],
          },
          title: {
            display: true,
            text: "Default Title",
            position: "top",
          },
        },
      };

      if (this.historical_data) {

        console.log(this.historical_data);
        this.filtered = {};
        // filter out what we need from what we dont need
        // let filterTheseOut = Object.keys(this.filtered);
        let filterTheseOut = this.trends;
        this.historical_data.map((q) => {
          filterTheseOut.forEach((chartElem) => {
            // init the object property first to an empty array
            if (this.filtered[chartElem] === undefined) this.filtered[chartElem] = [];
            // once defined; we can now push
            this.filtered[chartElem].push(q[chartElem] ? q[chartElem] : 0);
          });
        });

        // put in the xAxis
        payload.data.labels = this.filtered[this.trendLabels];
        // generate the datasets
        let generatedDatasets = [];
        filterTheseOut.map((q, indx) => {
          if (q !== this.trendLabels) {
            generatedDatasets.push({
              label: this.legendOverride[indx],
              data: this.filtered[q],
              borderColor: this.colors[indx - 1],
              fill: false,
              borderWidth: 2,
              pointRadius: 2,
              lineTension: 0,
            });
          }
        });

        // put in the datasets so it can be painted
        payload.data.datasets = generatedDatasets;
        payload.options.title.text = this.chartTitle;
      }

      return payload;
    },
    paintGraph() {
      const ctx = document.getElementById(this.canvasID);
      this.chartRef = new Chart(ctx, this.buildPayload());
    },
  },
};
</script>
