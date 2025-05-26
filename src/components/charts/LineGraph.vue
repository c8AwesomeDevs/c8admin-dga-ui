<template>
  <div>
    <JSCharting
      v-if="chartOptions.series[0].points.length"
      style="height: 100%;"
      :options="chartOptions"
      :class="{ singlePoint: chartOptions.series[0].points.length === 1 }"
    />
    <span v-else class="no-data-message">No data available</span>
  </div>
</template>


<style scoped>
/* JSCharting.. is shit.. do not use JSCharting  */
/* this removes the JSC logo.. f-you jscharting */
#brandingLogo {
  display: none;
}
/* this goes through every element inside a div (denoted by ">>>")..
looks for a "path" element with attribute "fill" with its value like "url(" (denoted by "*=")
if it found those paths, it will also look for "fill-rule='evenodd'" attribute and remove its "fill" */
/* this removes the gradient used to "stripe" the grid */
div >>> path[fill*="url("][fill-rule="evenodd"] {
  fill: none;
}
/* this lessens the opacity of each grid line giving more emphasis on the trend line */
div >>> path[fill="none"] {
  stroke-opacity: 0.5;
}
/* this increases the width of the trend line to make it more visible */
div >>> path[fill="none"][stroke-width="2"] {
  stroke-width: 3;
  stroke-opacity: 1;
}

/* Apply specific styles when only a single point exists */
.singlePoint >>> path[fill="none"][stroke-width="2"] {
  stroke-width: 3;
  stroke-opacity: 0; /* Set stroke-opacity to 0 */
}


.no-data-message {
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 4rem;
  align-items: center;
  font-size: 16px;
  color: #666;
}
</style>

<script>
import JSCharting, { JSC } from "jscharting-vue";
import { gassesMixin } from "@/mixins/gassesMixin.js";

export default {
  name: "LineGraph",
  props: ["attribute_key", "data"],
  mixins: [gassesMixin],
  data() {
    return {
      options: {
        debug: false,
        box_fill: "transparent",
        xAxis: { scale: { type: "time" } },
        legend: {
          position: "inside top right",
          style_fontSize: 12,
          margin_top: -25,
          fill: "#BDBDBD",
        },
        series: [
          {
            name: this.attribute_key,
            points: [],
          },
        ],
        title_label: {
          text: "<b>Gas Trend</b>",
          color: "red",
          style_fontSize: 12,
        },
      },
    };
  },
  computed: {
    chartOptions() {
      const points = this.data.map((d) => [d.timestamp, parseFloat(d[this.attribute_key])]);
      const seriesOptions = {
        points: points,
      };
      
      const options = { ...this.options };
      options.series[0] = seriesOptions;
      return options;
    },
  },
  components: {
    JSCharting,
  },
};
</script>
