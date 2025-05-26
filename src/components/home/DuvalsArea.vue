<template>
  <div>
    <v-card outlined elevation="0">
      <v-toolbar dense color="red darken-3" dark elevation="0">
        <v-toolbar-title class="font text-uppercase font-weight-medium">{{ symbol.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text dark @click="symbols_dialog = true"> Select<v-icon class="">mdi-chevron-right</v-icon> </v-btn>
      </v-toolbar>

      <div class="column-content">
        <div 
  class="floating-indicator" 
  v-if="current.interpretation && current.interpretation !== 'Normal'"
  :style="{ background: symbol.legends[current.interpretation]?.color }"
>
  <v-btn text dark small @click="legends_deialog = true">
    {{ current.interpretation }}
    <v-icon class="ml-5">mdi-chevron-right</v-icon>
  </v-btn>
</div>

<div class="content">
  <div class="left-content">
    <span 
      class="floating-indicator normal" 
      v-if="['Normal', null].includes(current.interpretation)"
      :style="{ background: 'transparent' }"
    >
      {{ current.interpretation ?? 'No Data' }}
    </span>
  </div>

  <div v-if="[10, 11].includes(symbol.id)" class="right-content">
    <v-switch 
      v-model="switch_cigre_p1" 
      @click="switch_cigre()" 
      color="red darken-3" 
      label="Cigre" 
      hide-details 
      class="mt-0 mb-0" 
    />
  </div>

  <div class="right-content">
    <div></div>
  </div>
</div>



        <div v-if="symbol.id == 1 && symbol.oil_type.includes(transformer_details[0].oil_type)">
          <!-- <duvals-triangle-one :data="data"></duvals-triangle-one> -->
          <div v-html="svgs.t1" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 2 && symbol.oil_type.includes(transformer_details[0].oil_type)">
          <!-- <duvals-triangle-two :data="data"></duvals-triangle-two> -->
          <div v-html="svgs.t2" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 3 && symbol.oil_type.includes(transformer_details[0].oil_type)">
          <!-- <duvals-triangle-three :data="data"></duvals-triangle-three> -->
          <div v-html="svgs.t3" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 4 && symbol.oil_type.includes(transformer_details[0].oil_type)">
          <!-- <duvals-triangle-four :data="data"></duvals-triangle-four> -->
          <div v-html="svgs.t4" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 5 && symbol.oil_type.includes(transformer_details[0].oil_type)">
          <!-- <duvals-triangle-five :data="data"></duvals-triangle-five> -->
          <div v-html="svgs.t5" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 6 && symbol.oil_type.includes(transformer_details[0].oil_type)">
          <!-- <duvals-triangle-six :data="data"></duvals-triangle-six> -->
          <div v-html="svgs.t6" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 7 && symbol.oil_type.includes(transformer_details[0].oil_type)">
          <!-- <duvals-triangle-seven :data="data"></duvals-triangle-seven> -->
          <div v-html="svgs.t7" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 8" class="pt-2">
          <!-- <duvals-pentagon-one :data="data"></duvals-pentagon-one> -->
          <div v-html="svgs.p1" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 9" class="pt-2">
          <!-- <duvals-pentagon-two :data="data"></duvals-pentagon-two> -->
          <div v-html="svgs.p2" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 10" class="pt-2">
          <!-- <duvals-pentagon-two :data="data"></duvals-pentagon-two> -->
          <div v-html="svgs.uni_penta" @mouseenter="addListenersToCircles"></div>
        </div>
        <div v-if="symbol.id == 11" class="pt-2">
          <!-- <duvals-pentagon-two :data="data"></duvals-pentagon-two> -->
          <div v-html="svgs.cigre_p1" @mouseenter="addListenersToCircles"></div>
        </div>
      </div>

      <div class="content">
        <div class="content-item" v-if="![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)">
          <span class="label-sm">Acetylene :</span>
          <span class="percentage" v-if="![1, 2, 3].includes(symbol.id)">{{ current.c2h2_pc_pen ? current.c2h2_pc_pen :
            0 }}%</span>
          <span class="percentage" v-if="[1, 2, 3].includes(symbol.id)">{{ current.c2h2_pc_tri_1 ? current.c2h2_pc_tri_1
            : 0 }}%</span>
        </div>

        <div class="content-item" v-if="![4, 6].includes(symbol.id)">
          <span class="label-sm">Ethylene :</span>
          <span class="percentage" v-if="![1, 2, 3].includes(symbol.id) && ![5, 7].includes(symbol.id)">{{
            current.c2h4_pc_pen ? current.c2h4_pc_pen : 0 }}%</span>
          <span class="percentage" v-if="[1, 2, 3].includes(symbol.id)">{{ current.c2h4_pc_tri_1 ? current.c2h4_pc_tri_1
            : 0 }}%</span>
          <span class="percentage" v-if="[5, 7].includes(symbol.id)">{{ current.c2h4_pc_tri_3 ? current.c2h4_pc_tri_3 :
            0 }}%</span>
        </div>

        <div class="content-item">
          <span class="label-sm">Methane :</span>
          <span class="percentage"
            v-if="![1, 2, 3].includes(symbol.id) && ![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)">{{
              current.ch4_pc_pen ? current.ch4_pc_pen : 0 }}%</span>
          <span class="percentage" v-if="[1, 2, 3].includes(symbol.id)">{{ current.ch4_pc_tri_1 ? current.ch4_pc_tri_1 :
            0 }}%</span>
          <span class="percentage" v-if="[4, 6].includes(symbol.id)">{{ current.ch4_pc_tri_2 ? current.ch4_pc_tri_2 : 0
            }}%</span>
          <span class="percentage" v-if="[5, 7].includes(symbol.id)">{{ current.ch4_pc_tri_3 ? current.ch4_pc_tri_3 : 0
            }}%</span>
        </div>

        <div class="content-item" v-if="![1, 2, 3].includes(symbol.id)">
          <span class="label-sm">Ethane :</span>
          <span class="percentage" v-if="![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)">{{
            current.c2h6_pc_pen ? current.c2h6_pc_pen : 0 }}%</span>
          <span class="percentage" v-if="[4, 6].includes(symbol.id)">{{ current.c2h6_pc_tri_2 ? current.c2h6_pc_tri_2 :
            0 }}%</span>
          <span class="percentage" v-if="[5, 7].includes(symbol.id)">{{ current.c2h6_pc_tri_3 ? current.c2h6_pc_tri_3 :
            0 }}%</span>
        </div>

        <div class="content-item" v-if="![1, 2, 3].includes(symbol.id) && ![5, 7].includes(symbol.id)">
          <span class="label-sm">Hydrogen :</span>
          <span class="percentage" v-if="![5, 7, 4, 6].includes(symbol.id)">{{ current.h2_pc_pen ? current.h2_pc_pen : 0
            }}%</span>
          <span class="percentage" v-if="[4, 6].includes(symbol.id)">{{ current.c2h4_pc_tri_3 ? current.c2h4_pc_tri_3 :
            0 }}%</span>
        </div>
      </div>

    </v-card>

    <v-dialog v-model="legends_deialog" max-width="400">
      <v-card>
   
        <v-divider></v-divider>
        <v-card class="pa-3">
          <div class="legend" v-if="(show_legends, !show_trend)">
            <div class="legend-item" v-for="(i, key) in symbol.legends" v-bind:key="i.color">
              <div class="legend-item-icon" :style="{ background: i.color }"></div>
              <div class="legend-item-text">{{ key }} : {{ i.description }}</div>
            </div>
          </div>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog v-model="symbols_dialog" max-width="320">
      <v-card>
        <v-toolbar dark dense color="red darken-3"> SELECT DGA SYMBOL </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item v-for="symbol in filteredSymbols" v-if="symbol.id != 11" :key="symbol.id"
                @click="switchSymbol(symbol)">
                <v-list-item-content>
                  <v-list-item-title v-text="symbol.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.font {
  font-size: 14px;
}

.noData {
  color: grey;
  /* Set the font color to grey */
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.content-item {
  display: flex;
  align-items: center;
  padding-bottom: 0.5em;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.label-sm {
  font-size: 12px;
  margin-right: 5px;
}

.percentage {
  font-size: 12px;
  font-weight: bold;
}

.left-content {
  flex-grow: 1;
  padding-left: 1em;
  padding-bottom: 1em;
}

.right-content {
  margin-right: 1em;
}

.demo-check {
  font-size: 13px;
  white-space: pre;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1em;
  margin-right: 1em;
}

.icon {
  font-size: 25px;
}

.column-header {
  padding: 5px;
  background: #9f0303 !important;
  color: #fff;
  text-align: left;
}

.column-content {
  position: relative;
}

.floating-indicator {
  position: absolute;
  top: 5px;
  left: 5px;
  padding: 3px;
  width: 100px;
  border-radius: 20px;
  text-align: center;
  font-size: 12px;
  color: #fff;
}

.floating-indicator.normal {
  border: 2px solid green;
  color: green;
}

.indicator {
  padding: 5px;
  text-align: center;
  color: white;
}

.indicator.normal {
  border: 1px solid green;
  color: green;
}

.gas-cont {
  text-align: center;
  width: 150px;
  height: 150px;
  bottom: 10px;
  float: left;
  left: 20px;
  position: relative;
}

.gas-cont .label {
  position: relative;
  bottom: 40px;
  /* padding-bottom: 25; */
  left: 23px;
  background: #424242;
  padding: 2px;
  font-size: 10px;
  border-radius: 3px;
  width: 60px;
  color: #fff;
}

.gas-cont .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #5e5d5d;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  font-size: 12px;
  right: 20px;
  padding: 5px 6px;
  bottom: 90px;
  /* Position the tooltip */
  position: relative;
  z-index: 1;
}

.gas-cont:hover .tooltiptext {
  visibility: visible;
}

/* .gas-cont .circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
} */

.chart-cont {
  width: calc(100% - 170px);
  right: 10px;
  float: left;
}

.clear {
  clear: both;
}

.no-border {
  border-width: 0 !important;
}

.no-padding {
  padding: 0;
}

.text-sm {
  font-size: 12px;
  margin-bottom: 0px;
}

.time-selector {
  width: 450px;
  height: auto;
  position: absolute;
  /* bottom: 55px; */
  /* left: -165px; */
  margin-top: 0.3rem;
  right: -60px;
  text-align: justify;
}

.relative {
  position: relative;
}

iframe {
  pointer-events: none;
}

.time-btn {
  margin-left: 10px;
}
.legend .legend-item {
  padding: 6px 15px;
}

.legend .legend-item-icon {
  width: 10px;
  margin-right: 10px;
  height: 10px;
  float: left;
}

.legend .legend-item-text {
  width: calc(100% - 20px);
  font-size: 11px !important;
}

.label-sm {
  font-size: 12px;
}

.link {
  cursor: pointer;
  color: blue;
}

.pointer {
  cursor: pointer;
}
</style>

<script>
import { symbolMixin } from "@/mixins/symbolMixin.js";

export default {
  name: "DuvalsArea",
  mixins: [symbolMixin],
  props: ["latest_data", "svgs_data", "transformer_details"],
  data() {
    return {
      symbols_dialog: false,
      symbol: {},
      symbol_legends: [],
      data: [],
      current: {},
      legends_deialog: false,
      show_legends: true,
      show_trend: false,
      svgs: {},
      popup_mappings: [],
      switch_cigre_p1: false,
      trans_details: null
    };
  },
  mounted() {
    
    let sym_id = this.filteredSymbols[0]?.id; // Ensure there's a valid ID
    this.symbol = this.symbols.find(symbol => symbol.id === sym_id) || {}; // Find the correct symbol
    this.loadInterpretation();
  },
  watch: {

    transformer_details() {
      if (!this.filteredSymbols.length) {
        console.warn("No matching symbol found in filteredSymbols.");
        return;
      }

      let sym_id = this.filteredSymbols[0].id;
      this.symbol = this.symbols[sym_id - 1];
      this.loadInterpretation();
    },



    latest_data() {
      this.current = this.latest_data;
      this.loadInterpretation();
    },
    svgs_data() {
      // idk why the properties are suddenly inside the "this.svgs_data.original" property
      // console.log(JSON.stringify(this.svgs_data));
      this.removePopupbeforeupdate();
      this.svgs = {
        t1: this.svgs_data.original.t1,
        t2: this.svgs_data.original.t2,
        t3: this.svgs_data.original.t3,
        t4: this.svgs_data.original.t4,
        t5: this.svgs_data.original.t5,
        t6: this.svgs_data.original.t6,
        t7: this.svgs_data.original.t7,
        p1: this.svgs_data.original.p1,
        p2: this.svgs_data.original.p2,
        uni_penta: this.svgs_data.original.uni_penta,
        cigre_p1: this.svgs_data.original.cigre_p1,  
      };
      document.body.insertAdjacentHTML("beforeend", this.svgs_data.original.popups);
      this.popup_mappings = this.svgs_data.original.popup_mappings;
    },
  },
  computed: {
    filteredSymbols() {
      if (!this.transformer_details.length) return []; // Prevents accessing undefined values

      return this.symbols.filter(symbol =>
        Array.isArray(symbol.oil_type) // Ensure oil_type is an array
          ? symbol.oil_type.includes(this.transformer_details[0]?.oil_type)
          : symbol.oil_type === this.transformer_details[0]?.oil_type
      );
    },
  
  },
  methods: {
    loadInterpretation() {
        if (this.symbol?.id) {
            let interpretationKey = this.getSymbolById(this.symbol.id);
            this.current.interpretation = this.current[interpretationKey] || null;
        }
    },

    switch_cigre() {
      if (this.switch_cigre_p1 == true) {
        this.switchSymbol(this.symbols[10]);
      } else {
        this.switchSymbol(this.symbols[9]);
      }
    },
    switchSymbol(symbol) {
      this.symbol = symbol;
      // console.log(this.transformer_details);
      this.current.interpretation = this.current[this.getSymbolById(this.symbol.id)];
      this.symbols_dialog = false;
      this.switch_cigre_p1 = false;
    },
    addListenersToCircles() {
      let maps = this.popup_mappings;
      // console.log(maps);
      maps.forEach((element) => {
        let targetElem = document.getElementById(element[0]);
        if (targetElem) {
          // console.log(element[0]);
          targetElem.addEventListener("mouseover", function showPopup(event) {
            document.getElementById(element[1]).style.width = "250px";
            document.getElementById(element[1]).style.zIndex = 1;
            document.getElementById(element[1]).style.left = event.pageX + 10 + "px";
            document.getElementById(element[1]).style.top = event.pageY - 10 + "px";
            document.getElementById(element[1]).style.opacity = 0.8;
            document.getElementById(element[1]).style.visibility = "visible";
            document.getElementById(element[1]).style.display = "block";
          });
          document.getElementById(element[0]).addEventListener("mouseout", function hidePopup(event) {
            document.getElementById(element[1]).style.visibility = "hidden";
            document.getElementById(element[1]).style.display = "none";
          });
        }
      });
    },
    removePopupbeforeupdate() {
      this.popup_mappings.forEach((e) => {
        document.getElementById(e[1]).remove();
      });
    }
  },
};
</script>
