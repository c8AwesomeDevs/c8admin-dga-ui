<template>
  <div :id="canvasID + 'Cont'">
    <canvas :id="canvasID"></canvas>

    <div class="text-center">
      <v-btn block depressed text @click="checkLimitDetails(type)">{{ chartTitle }}</v-btn>
      <GasLimitDetails :title="chartTitle" :data="gas_limit" :dialog="gas_limit_dialog" @close="gas_limit_dialog = false"></GasLimitDetails>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js";
import { gassesMixin } from "@/mixins/gassesMixin.js";
import GasLimitDetails from "@/components/popups/GasLimitDetails.vue";

export default {
  name: "PieChartAKAGuage",
  props: ["canvasID", "chartTitle", "activeTab", "tabItem", "type", "latest_data"],
  mixins: [gassesMixin],
  components: { GasLimitDetails },
  data() {
    return {
      data: [],
      current: {},
      gas_limit_dialog: false,
      gas_limit: {},
      chartRef: null,
    };
  },
  mounted() {
    this.paintGraph();
  },
  watch: {
    latest_data() {
      // this updates the needle value based on changes from the parent
      this.chartRef.chart.data.datasets[0].needleValue = this.latest_data;
      this.chartRef.chart.update();
    },
    activeTab() {
      // 1. when Vue renders a component on a v-tab it mounts it on first-time and then hides it when you click away
      //    if you click on it again Vue simply un-hides it
      // 2. Chartjs can only render on something that is visible on the DOM
      //    (which is understandable; you cant render on something that is not rendered)
      // 3. the gauge's needle is dependent Chartjs 'afterRender' callback
      //    (Ive check all the callback chartjs offers, 'afterRender' makes the most sense)
      // problem: if you have 2 tabs, both with guages, and a single function that updates those gauges in bulk
      // if some of those gauges are hidden from the DOM when you 'bulk update'... those gauges will not update
      // solution: (brute-force) pass the currently active tab; and the tab where the gauge belongs to the component
      // if those variables match; force a 'rerender' on the chart
      if (this.activeTab === parseInt(this.tabItem)) {
        this.rerender();
      }
    },
  },
  methods: {
    buildPayload() {
      // default payload
      let payload = {
        type: "doughnut",
        data: {
          labels: ["Red", "Yellow", "Blue"],
          datasets: [
            {
              data: [10, 20, 30],
              needleValue: 0,
              backgroundColor: ["rgba(0, 255, 0, 0.5)", "rgba(255,255,0,0.5)", "rgba(255,140,0,0.8)", "rgba(255,0,0,0.7)"],
              borderColor: "rgba(0, 0, 0, 0)",
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            display: false,
          },
          title: {
            display: false,
            text: "Default Title",
          },
          tooltips: {
            enabled: false,
          },
          events: [], // this makes the chart not listen to any events(like a picture); this is to aid the 'afterRender' plugin
          circumference: Math.PI, // this makes only half the donut
          rotation: -1 * Math.PI, // this makes it so it starts from the left to the top to the right
          animation: {
            animateRotate: false,
          },
        },
        plugins: {
          afterRender: function (chart, args, options) {
            // afterUpdate: function (chart, args, options) {
            var needleValue = chart.chart.config.data.datasets[0].needleValue;
            var dataTotal = chart.chart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
            // there are cases where the gauge value exceeds the gauge's range (overflow)
            // the line bellow effectively stops the guage from overflowing for better depiction
            var angle = needleValue > dataTotal ? Math.PI + (1 / dataTotal) * dataTotal * Math.PI : Math.PI + (1 / dataTotal) * needleValue * Math.PI;
            var ctx = chart.chart.ctx;
            var cw = chart.chart.canvas.offsetWidth;
            var ch = chart.chart.canvas.offsetHeight;
            var cx = cw / 2;
            var cy = ch - 6;
            var innerR = chart.innerRadius;
            var outerR = chart.outerRadius;
            // console.log(outerR - innerR);

            // needle
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.beginPath();
            // ctx.moveTo(0, -3);
            // ctx.lineTo(ch - (ch - outerR), 0);
            // ctx.lineTo(0, 3);
            ctx.moveTo(ch - (ch - outerR), -2);
            ctx.lineTo(ch - (ch - outerR) - (outerR - innerR) / 2, 0);
            ctx.lineTo(ch - (ch - outerR), 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.rotate(-angle);

            ctx.translate(-cx, -cy);
            ctx.beginPath();

            ctx.fillStyle = "gray";
            ctx.font = `bold ${ch * 0.3}px sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(needleValue, cx, cy);
            // ctx.beginPath();
            // ctx.arc(cx, cy, 5, 0, Math.PI * 2);
            // ctx.fill();
          },
        },
      };

      if (this.type || this.latest_data) {
        // assemble the ranges from mixin
        let gasLimit = this.gasses[this.type];
        let ranges = [
          gasLimit.normal.max - gasLimit.normal.min || 0,
          gasLimit.medium.max - gasLimit.medium.min || 0,
          gasLimit.critical.max - gasLimit.critical.min || 0,
          gasLimit.failure.max - gasLimit.failure.min || 0,
        ];
        payload.data.datasets[0].data = ranges;

        // move the needle to the correct value
        payload.data.datasets[0].needleValue = this.latest_data;
      }

      return payload;
    },
    paintGraph() {
      const ctx = document.getElementById(this.canvasID);
      this.chartRef = new Chart(ctx, this.buildPayload());
    },
    checkLimitDetails(type) {
      this.gas_limit = this.gasses[type];
      this.gas_limit_dialog = true;
    },
    rerender() {
      this.chartRef.chart.render();
    },
  },
};
</script>
