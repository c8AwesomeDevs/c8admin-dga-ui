<template>
  <div>
    <JSCharting style="height: 100%; width: 100%" :options="chartOptions"></JSCharting>
  </div>
</template>

<style scope>
#brandingLogo {
  display: none;
}
</style>

<script>
import JSCharting, { JSC } from "jscharting-vue";
import { gassesMixin } from "@/mixins/gassesMixin.js";
export default {
  name: "Gauge",
  props: ["type", "value"],
  mixins: [gassesMixin],
  data() {
    return {
      coptions: {
        legend_visible: false,
        box: {
          fill: "transparent",
          width: 100,
          height: 150,
        },
        branding_Logo: {
          style_opacity: 0,
          opacity: 0,
        },
        defaultTooltip_enabled: false,
        xAxis_spacingPercentage: 0.5,
        animation: { duration: 400 },
        yAxis: [
          {
            id: "ax1",

            defaultTick: { padding: -1, enabled: false },
            // customTicks: [0, 45, 400, 900, 1800],
            line: {
              width: 3,
              breaks_gap: 0.06,
              color: "smartPalette:pal1",
            },

            scale_range: [],
            // scale_range: [0, 45]
          },
        ],
        defaultSeries: {
          type: "gauge column roundcaps",
          shape: {
            label: {
              text: "%max",
              align: "center",
              color: "gray",
              verticalAlign: "middle",
              style_fontSize: 15,
            },
          },
        },
        series: [
          {
            type: "column roundcaps",
            name: "values",
            yAxis: "ax1",
            palette: {
              id: "pal1",
              pointValue: "%yValue",
              ranges: [],
            },
            points: [["x", [0, 0]]],
          },
        ],
      },
    };
  },
  computed: {
    chartOptions() {
      let gasLimit = this.gasses[this.type];
      // console.log(gasLimit);
      let options = this.coptions;
      let value = this.value ? this.value : 0;

      options.series[0].palette.ranges = [
        { value: [gasLimit.normal.min, gasLimit.normal.max], color: "green" },
        { value: [gasLimit.medium.min, gasLimit.medium.max], color: "yellow" },
        { value: [gasLimit.critical.min, gasLimit.critical.max], color: "orange" },
        { value: [gasLimit.failure.min, gasLimit.failure.max], color: "red" },
      ];

      options.yAxis[0].scale_range = [0, gasLimit.failure.max];

      options.series[0].points = [["x", [0, value]]];

      // Set the defaultSeries label color based on the series palette ranges
      options.series[0].palette.ranges.forEach((range) => {
        if (value >= range.value[0] && value <= range.value[1]) {
          options.defaultSeries.shape.label.color = range.color;
        }
      });

      return options;
    },
  },
  watch: {
    value() {
      let value = this.value ? this.value : 0;
      this.coptions.series[0].points = [["x", [0, value]]];
    },
  },
  components: {
    JSCharting,
  },
};
</script>
