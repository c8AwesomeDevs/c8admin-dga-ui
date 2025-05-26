<template>
  <div class="pa-3">
    <v-row dense>
      <!-- asset select -->
      <v-col cols="12" md="2">
        <div class="mt-1">
          <v-select color="red" outlined @mousedown="setAsset" v-model="asset" :items="assets" item-text="path" item-value="idx" label="Select Asset" dense></v-select>
        </div>
      </v-col>
      <!-- time range limiters including realtime -->
      <v-col cols="12" md="4">
        <div class="mt-1">
          <v-text-field color="red" outlined label="Start" dense append-icon="mdi-calendar" readonly @click:append="openDatePicker('date1')" v-model="datetime1"> </v-text-field>
        </div>
      </v-col>
      <!-- <v-col cols="12" md="1">
            <div class="mt-4 relative">
              <v-btn :color="timeselector ? 'red' : ''" :dark="timeselector" block small @click="timeselector = !timeselector">{{ timerange }}</v-btn>
              <div color="red" class="time-selector" v-if="timeselector">
                <v-btn class="time-btn" small v-for="r in timeranges" v-bind:key="r" @click="selectTime(r)">{{ r }}</v-btn>
              </div>
            </div>
          </v-col> -->
      <v-col cols="12" md="4">
        <div class="mt-1">
          <v-text-field color="red" outlined label="End" dense append-icon="mdi-calendar" readonly @click:append="openDatePicker('date2')" v-model="datetime2"> </v-text-field>
        </div>
      </v-col>
      <v-col cols="12" md="2">
        <div class="mt-3">
          <v-btn block small class="darken-2" :color="realtime ? 'red' : ''" :dark="realtime" @click="setRealTime(!realtime)"> Realtime </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row style="margin-top: -20px">
      <v-col cols="12" md="5" class="pt-0">
        <!-- Duvals area -->
        <v-card>
          <v-toolbar dense color="red darken-3" dark>
            <v-toolbar-title>{{ symbol.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text dark @click="symbols_dialog = true"> Select<v-icon class="">mdi-chevron-right</v-icon> </v-btn>
            <!-- <v-spacer></v-spacer>
             <v-toolbar-item> See Legends</v-toolbar-item>
             <v-btn class="float-right" x-small text dark @click="legends_deialog = true">
                <v-icon class="">mdi-chevron-right-circle-outline</v-icon>
              </v-btn> -->
          </v-toolbar>

          <div class="column-content">
            <div
              class="floating-indicator"
              v-if="current.interpretation != 'Normal' && current.interpretation != undefined"
              :style="{ background: symbol.legends[current.interpretation].color }"
            >
              {{ current.interpretation }}
            </div>
            <div class="content">
              <div class="left-content">
                <span class="floating-indicator normal" v-if="current.interpretation == 'Normal'" :style="{ background: 'transparent' }">Normal</span>
                <span class="floating-indicator normal" v-if="current.interpretation == null" :style="{ background: 'transparent' }">No Data</span>
              </div>
              <div class="right-content">
                <span class="label-sm link" @click="legends_deialog = !legends_deialog">{{ legends_deialog ? "- Hide " : "+ Show" }} Legends</span>
              </div>
            </div>
            <div v-if="symbol.id == 1">
              <duvals-triangle-one :data="data"></duvals-triangle-one>
            </div>
            <div v-if="symbol.id == 2">
              <duvals-triangle-two :data="data"></duvals-triangle-two>
            </div>
            <div v-if="symbol.id == 3">
              <duvals-triangle-three :data="data"></duvals-triangle-three>
            </div>
            <div v-if="symbol.id == 4">
              <duvals-triangle-four :data="data"></duvals-triangle-four>
            </div>
            <div v-if="symbol.id == 5">
              <duvals-triangle-five :data="data"></duvals-triangle-five>
            </div>
            <div v-if="symbol.id == 6">
              <duvals-triangle-six :data="data"></duvals-triangle-six>
            </div>
            <div v-if="symbol.id == 7">
              <duvals-triangle-seven :data="data"></duvals-triangle-seven>
            </div>
            <div v-if="symbol.id == 8" class="pt-2">
              <duvals-pentagon-one :data="data"></duvals-pentagon-one>
            </div>
            <div v-if="symbol.id == 9" class="pt-2">
              <duvals-pentagon-two :data="data"></duvals-pentagon-two>
            </div>
          </div>

          <div class="content">
            <div class="content-item" v-if="![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)">
              <span class="label-sm">Acetylene :</span>
              <span class="percentage" v-if="![1, 2, 3].includes(symbol.id)">{{ current.c2h2_pc_pen ? current.c2h2_pc_pen : 0 }}%</span>
              <span class="percentage" v-if="[1, 2, 3].includes(symbol.id)">{{ current.c2h2_pc_tri_1 ? current.c2h2_pc_tri_1 : 0 }}%</span>
            </div>

            <div class="content-item" v-if="![4, 6].includes(symbol.id)">
              <span class="label-sm">Ethylene :</span>
              <span class="percentage" v-if="![1, 2, 3].includes(symbol.id) && ![5, 7].includes(symbol.id)">{{ current.c2h4_pc_pen ? current.c2h4_pc_pen : 0 }}%</span>
              <span class="percentage" v-if="[1, 2, 3].includes(symbol.id)">{{ current.c2h4_pc_tri_1 ? current.c2h4_pc_tri_1 : 0 }}%</span>
              <span class="percentage" v-if="[5, 7].includes(symbol.id)">{{ current.c2h4_pc_tri_3 ? current.c2h4_pc_tri_3 : 0 }}%</span>
            </div>

            <div class="content-item">
              <span class="label-sm">Methane :</span>
              <span class="percentage" v-if="![1, 2, 3].includes(symbol.id) && ![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)"
                >{{ current.ch4_pc_pen ? current.ch4_pc_pen : 0 }}%</span
              >
              <span class="percentage" v-if="[1, 2, 3].includes(symbol.id)">{{ current.ch4_pc_tri_1 ? current.ch4_pc_tri_1 : 0 }}%</span>
              <span class="percentage" v-if="[4, 6].includes(symbol.id)">{{ current.ch4_pc_tri_2 ? current.ch4_pc_tri_2 : 0 }}%</span>
              <span class="percentage" v-if="[5, 7].includes(symbol.id)">{{ current.ch4_pc_tri_3 ? current.ch4_pc_tri_3 : 0 }}%</span>
            </div>

            <div class="content-item" v-if="![1, 2, 3].includes(symbol.id)">
              <span class="label-sm">Ethane :</span>
              <span class="percentage" v-if="![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)">{{ current.c2h6_pc_pen ? current.c2h6_pc_pen : 0 }}%</span>
              <span class="percentage" v-if="[4, 6].includes(symbol.id)">{{ current.c2h6_pc_tri_2 ? current.c2h6_pc_tri_2 : 0 }}%</span>
              <span class="percentage" v-if="[5, 7].includes(symbol.id)">{{ current.c2h6_pc_tri_3 ? current.c2h6_pc_tri_3 : 0 }}%</span>
            </div>

            <div class="content-item" v-if="![1, 2, 3].includes(symbol.id) && ![5, 7].includes(symbol.id)">
              <span class="label-sm">Hydrogen :</span>
              <span class="percentage" v-if="![5, 7, 4, 6].includes(symbol.id)">{{ current.h2_pc_pen ? current.h2_pc_pen : 0 }}%</span>
              <span class="percentage" v-if="[4, 6].includes(symbol.id)">{{ current.c2h4_pc_tri_3 ? current.c2h4_pc_tri_3 : 0 }}%</span>
            </div>
          </div>
        </v-card>
        <!-- <v-card class="mt-3">
            <div class="legend" v-if="show_legends, !show_trend" >
              <div class="legend-item" v-for="(i, key) in symbol.legends" v-bind:key="i.color">
                <div class="legend-item-icon" :style="{ background: i.color }"></div>
                <div class="legend-item-text">{{ key }} : {{ i.description }}</div>
              </div>
            </div>
            <div class="label-sm link pa-2" @click="show_legends = !show_legends">{{ show_legends? '- Show ': '- Show' }}
              Legends</div>
          </v-card> -->
        <!-- Last Gaseous Component Extract -->
        <!-- <v-card class="mt-2">
          <v-toolbar dense color="red darken-3" dark>
            <v-toolbar-title>Last Gaseous Component Extract</v-toolbar-title>
          </v-toolbar>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Dissolved Gases</th>
                  <th class="text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)">
                  <td class="text-left">Acetylene (C2h2)</td>
                  <td class="text-left" v-if="![1, 2, 3].includes(symbol.id)">{{ current.c2h2_pc_pen }}%</td>
                  <td class="text-left" v-if="[1, 2, 3].includes(symbol.id)">{{ current.c2h2_pc_tri_1 }}%</td>
                </tr>
                <tr v-if="![4, 6].includes(symbol.id)">
                  <td class="text-left">Ethylene (C2H4)</td>
                  <td class="text-left" v-if="![1, 2, 3].includes(symbol.id) && ![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)">{{ current.c2h4_pc_pen }}%</td>
                  <td class="text-left" v-if="[1, 2, 3].includes(symbol.id)">{{ current.c2h4_pc_tri_1 }}%</td>
                  <td class="text-left" v-if="[5, 7].includes(symbol.id)">{{ current.c2h4_pc_tri_3 }}%</td>
                </tr>
                <tr>
                  <td class="text-left">Methane (CH4)</td>
                  <td class="text-left" v-if="![1, 2, 3].includes(symbol.id) && ![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)">{{ current.ch4_pc_pen }}%</td>
                  <td class="text-left" v-if="[1, 2, 3].includes(symbol.id)">{{ current.ch4_pc_tri_1 }}%</td>
                  <td class="text-left" v-if="[4, 6].includes(symbol.id)">{{ current.ch4_pc_tri_2 }}%</td>
                  <td class="text-left" v-if="[5, 7].includes(symbol.id)">{{ current.ch4_pc_tri_3 }}%</td>
                </tr>
                <tr v-if="![1, 2, 3].includes(symbol.id)">
                  <td class="text-left">Ethane (C2H6)</td>
                  <td class="text-left" v-if="![4, 6].includes(symbol.id) && ![5, 7].includes(symbol.id)">{{ current.c2h6_pc_pen }}%</td>
                  <td class="text-left" v-if="[4, 6].includes(symbol.id)">{{ current.c2h6_pc_tri_2 }}%</td>
                  <td class="text-left" v-if="[5, 7].includes(symbol.id)">{{ current.c2h6_pc_tri_3 }}%</td>
                </tr>
                <tr v-if="![1, 2, 3].includes(symbol.id) && ![5, 7].includes(symbol.id)">
                  <td class="text-left">Hydrogen (H2)</td>
                  <td class="text-left" v-if="![5, 7, 4, 6].includes(symbol.id)">{{ current.h2_pc_pen }}%</td>
                  <td class="text-left" v-if="[4, 6].includes(symbol.id)">{{ current.c2h4_pc_tri_3 }}%</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card> -->

        <!-- summary-interpretations -->
        <v-card class="mt-2">
          <summary-interpretations :data="data" @showDetails="showInterpretations"></summary-interpretations>
        </v-card>

        <v-card class="mt-2">
          <v-toolbar dense color="red darken-3" dark><v-toolbar-title>Other Interpretations</v-toolbar-title></v-toolbar>
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
                  <td class="text-left" :class="{ noData: !current.iec_ratio }">{{ current.iec_ratio ? current.iec_ratio : "No data available" }}</td>
                </tr>
                <tr>
                  <td class="text-left">Dornenburg</td>
                  <td class="text-left" :class="{ noData: !current.dornenberg }">{{ current.dornenberg ? current.dornenberg : "No data available" }}</td>
                </tr>
                <tr>
                  <td class="text-left">Roger's Ratio</td>
                  <td class="text-left" :class="{ noData: !current.rogers_ratio }">{{ current.rogers_ratio ? current.rogers_ratio : "No data available" }}</td>
                </tr>
                <tr>
                  <td class="text-left">CO2/CO Ratio</td>
                  <td class="text-left" :class="{ noData: !current.carbon_ratio }">{{ current.carbon_ratio ? current.carbon_ratio : "No data available" }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="7" class="pt-0">
        <!-- PPM Levels -->
        <template>
          <v-card>
            <!-- <v-toolbar dense color="red darken-3" dark>
            <v-toolbar-title>PPM Levels</v-toolbar-title>
            <v-spacer></v-spacer>
            <template>
                <div class="text-center">
                  <v-menu>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn  v-bind="attrs" v-on="on" text dark :disabled="loading">
                        <span v-if="!loading">Export</span>
                        <span v-else>Exporting...</span>
                        <v-icon v-if="!loading" class="">mdi-folder-arrow-down-outline</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item  @click="generateCSV()">
                        <v-list-item-title >CSV</v-list-item-title>
                      </v-list-item>
                      <v-list-item  @click="generatePDF()">
                        <v-list-item-title>PDF</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
          </v-toolbar> -->
            <v-tabs fixed-tabs background-color="red darken-3" color="white" v-model="tab">
              <v-tab key="ppmlevels"> PPM Levels </v-tab>
              <v-tab key="roclevels"> Rate of Change Levels </v-tab>
              <v-spacer></v-spacer>
              <template>
                <div class="text-center pa-2">
                  <v-menu>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" text dark :disabled="loading">
                        <span v-if="!loading">Export</span>
                        <span v-else>Exporting...</span>
                        <v-icon v-if="!loading" class="">mdi-folder-arrow-down-outline</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="generateCSV()">
                        <v-list-item-title>CSV</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="generatePDF()">
                        <v-list-item-title>PDF</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-tabs>

            <!-- <v-tabs-items v-model="tab">
              <v-tab-item key="ppmlevels">
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="acetylene" :value.sync="current.acetylene" />
                    <div class="label pointer" @click="checkLimitDetails('acetylene')">(C2h2)</div>
                    <span class="tooltiptext">Acetylene</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line1" attribute_key="c2h2" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="ethylene" :value.sync="current.ethylene" />
                    <div class="label pointer" @click="checkLimitDetails('ethylene')">(C2H4)</div>
                    <span class="tooltiptext">Ethylene</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line2" attribute_key="c2h4" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="methane" :value.sync="current.methane" />
                    <div class="label pointer" @click="checkLimitDetails('methane')">(CH4)</div>
                    <span class="tooltiptext">Methane</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line3" attribute_key="ch4" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="ethane" :value.sync="current.ethane" />
                    <div class="label pointer" @click="checkLimitDetails('ethane')">(C2H6)</div>
                    <span class="tooltiptext">Ethane</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line4" attribute_key="c2h6" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="hydrogen" :value.sync="current.hydrogen" />
                    <div class="label pointer" @click="checkLimitDetails('hydrogen')">(H2)</div>
                    <span class="tooltiptext">Hydrogen</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line5" attribute_key="h2" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
              </v-tab-item>
              <v-tab-item key="roclevels">
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="acetylene_roc" :value.sync="current.acetylene_roc" />
                    <div class="label pointer" @click="checkLimitDetails('acetylene_roc')">(C2h2 ROC)</div>
                    <span class="tooltiptext">Acetylene ROC</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line1" attribute_key="c2h2_roc" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="ethylene_roc" :value.sync="current.ethylene_roc" />
                    <div class="label pointer" @click="checkLimitDetails('ethylene_roc')">(C2H4 ROC)</div>
                    <span class="tooltiptext">Ethylene ROC</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line2" attribute_key="c2h4_roc" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="methane_roc" :value.sync="current.methane_roc" />
                    <div class="label pointer" @click="checkLimitDetails('methane_roc')">(CH4 ROC)</div>
                    <span class="tooltiptext">Methane ROC</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line3" attribute_key="ch4_roc" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="ethane_roc" :value.sync="current.ethane_roc" />
                    <div class="label pointer" @click="checkLimitDetails('ethane_roc')">(C2H6 ROC)</div>
                    <span class="tooltiptext">Ethane ROC</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line4" attribute_key="c2h6_roc" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="mb-2">
                  <div class="gas-cont">
                    <gauge type="hydrogen_roc" :value.sync="current.hydrogen_roc" />
                    <div class="label pointer" @click="checkLimitDetails('hydrogen_roc')">(H2 ROC)</div>
                    <span class="tooltiptext">Hydrogen ROC</span>
                  </div>
                  <div class="chart-cont">
                    <line-graph id="line5" attribute_key="h2_roc" :data="data" />
                  </div>
                  <div class="clear"></div>
                </div>
              </v-tab-item>
            </v-tabs-items> -->
          </v-card>
        </template>
        <!-- Rate of Change Levels -->
        <!-- <v-card>
          <v-toolbar dense color="red darken-3" dark>
            <v-toolbar-title>Rate of Change Levels</v-toolbar-title>
          </v-toolbar>
          
        </v-card> -->
      </v-col>
    </v-row>
    <!-- <v-dialog v-model="show_trend" max-width="1000">
      <v-card>
        <v-card-item>
          <line-graph :data="data" />
        </v-card-item>
      </v-card>
    </v-dialog> -->

    <v-dialog v-model="legends_deialog" max-width="400">
      <v-card>
        <!-- <v-toolbar dark dense color="red darken-3">
          LEGENDS
        </v-toolbar> -->
        <v-divider></v-divider>
        <v-card class="pa-3">
          <div class="legend" v-if="(show_legends, !show_trend)">
            <div class="legend-item" v-for="(i, key) in symbol.legends" v-bind:key="i.color">
              <div class="legend-item-icon" :style="{ background: i.color }"></div>
              <div class="legend-item-text">{{ key }} : {{ i.description }}</div>
            </div>
          </div>
          <!-- <div class="label-sm link pa-2" @click="show_legends = !show_legends, show_trend = true;">{{ show_legends? '+ Show ': '+ Show' }}
              Gases Trends</div> -->
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
              <v-list-item v-for="symbol in symbols" :key="symbol.id" @click="switchSymbol(symbol)">
                <v-list-item-content>
                  <v-list-item-title v-text="symbol.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="validation_dialog" max-width="350" min-width="300">
      <template>
        <v-card>
          <div>
            <span>
              <v-icon color="orange" class="icon ml-3 mt-3"> mdi-alert-circle-outline </v-icon>
              <span class="demo-check">
                {{ dialogMessage }}
              </span>
            </span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn dark small color="red" text @click="validation_dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <interpretations-details :details="attribute_value_details" :show="showInterpretationsPopup" @close="hideLogPopup"></interpretations-details>
    <date-picker :dialog="datepicker" :date="date" @setDate="setDate" @close="closeDatePicker"></date-picker>
    <time-picker :dialog="timepicker" @setTime="setTime" @close="closeTimePicker" :current_time="time"></time-picker>
    <gas-limit-details :data="gas_limit" :dialog="gas_limit_dialog" @close="gas_limit_dialog = false"></gas-limit-details>
  </div>
</template>

<style scoped>
.noData {
  color: grey; /* Set the font color to grey */
}
.content {
  display: flex;
  align-items: center;
}
.content-item {
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  margin-left: 1em;
}

.label-sm {
  font-size: 10px;
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

/* .legend {
  background-color: rgb(216, 216, 216);
} */

/* .no-data-message {
        position: relative;
        display: block;
        text-align: center;
        width: 100%;
        top: -110px;
        font-size: 1em;
        color: #999;
    } */

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
import axios from "axios";
// import DuvalsTriangleOne from "@/components/DuvalsTriangleOne.vue";
// import DuvalsTriangleTwo from "@/components/DuvalsTriangleTwo.vue";
// import DuvalsTriangleThree from "@/components/DuvalsTriangleThree.vue";
// import DuvalsTriangleFour from "@/components/DuvalsTriangleFour.vue";
// import DuvalsTriangleFive from "@/components/DuvalsTriangleFive.vue";
// import DuvalsTriangleSix from "@/components/DuvalsTriangleSix.vue";
// import DuvalsTriangleSeven from "@/components/DuvalsTriangleSeven.vue";
// import DuvalsPentagonTwo from "@/components/DuvalsPentagonTwo.vue";
// import DuvalsPentagonOne from "@/components/DuvalsPentagonOne.vue";
import DatePicker from "@/components/pickers/DatePicker.vue";
import TimePicker from "@/components/pickers/TimePicker.vue";
import { timeMixin } from "@/mixins/timeMixin.js";
import { symbolMixin } from "@/mixins/symbolMixin.js";
import { gassesMixin } from "@/mixins/gassesMixin.js";
// import LineChart from "@/components/LineChart.vue";
// import LineGraph from "@/components/charts/LineGraph.vue";
import GasLimitDetails from "@/components/popups/GasLimitDetails.vue";
import SummaryInterpretations from "@/components/tables/SummaryInterpretations.vue";
import InterpretationsDetails from "@/components/popups/InterpretationsDetails.vue";
// import Gauge from "@/components/charts/Gauge.vue";
import Papa from "papaparse";
export default {
  name: "Home",
  mixins: [timeMixin, symbolMixin, gassesMixin],
  data() {
    return {
      tab: "ppmlevels",
      step: 1,
      gas_limit: {},
      gas_limit_dialog: false,
      asset: null,
      realtime: false,
      symbols_dialog: false,
      symbol: {},
      assets: [],
      data: [],
      SelectTransformer: [],
      previous: {},
      current: {},
      datepicker: false,
      timepicker: false,
      date_type: null,
      datetime1: null,
      datetime2: null,
      date: null,
      endTime: null,
      startTime: null,
      time: null,
      timeselector: false,
      timeranges: ["30m", "1h", "8h", "1d", "7d", "1mo", "3mo"],
      timerange: "1d",
      timer: null,
      symbol_legends: [],
      show_legends: true,
      legends_deialog: false,
      show_trend: false,
      dataItems: [],
      responseData: [],
      loading: false,
      showInterpretationsPopup: false,
      attribute_value_details: {},
      commentDetails: {},
      commentDialog: false,
      commentDetails: {},
      element_id: {},
      comments: {},
      validation_dialog: false,
      dialogMessage: "",
    };
  },

  mounted() {
    this.symbol = this.symbols[0];
    axios({
      url: process.env.VUE_APP_BASEURL + "/elements",
      method: "GET",
      headers: {
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    })
      .then((res) => {
        this.assets = res.data.map((d, idx) => {
          d.idx = idx;
          return d;
        });

        if (this.assets.length > 0) {
          this.asset = 0;
          this.getAttributeValues(this.assets[0]);
        }
      })
      .catch((err) => {
        const statusCode = err.response.status;
        console.log(statusCode);
       
      });
    var current = new Date();
    var dt1 = localStorage.getItem("startDateTime") ? JSON.parse(localStorage.getItem("startDateTime")) : this.formatDate(new Date().getTime() - this.getMsByTime("1d"));

    this.datetime2 = this.formatDate(current.toLocaleString());
    this.datetime1 = this.formatDate(new Date(dt1).toLocaleString());
  },
  watch: {
    timerange() {
      // the goal of this function is to change the "Start" datetime
      // let ms = this.getMsByTime(this.timerange);
      // let enddate = new Date(this.datetime2).getTime();
      // let startdate = new Date(enddate - ms);
      // this.datetime1 = this.formatDate(new Date(startdate).toLocaleString());
      // this.getAttributeValues(this.assets[this.asset]);
    },
    datetime1() {
      // let timerange = this.getTimeRange(this.datetime1, this.datetime2);
      // this.timerange = this.getTimeRange(this.datetime1, this.datetime2);
      // console.log(timerange);;

      localStorage.setItem("startDateTime", JSON.stringify(this.datetime1));
      this.getAttributeValues(this.assets[this.asset]);
    },
    datetime2() {
      // let ms = this.getMsByTime(this.timerange);

      // let enddate = new Date(this.datetime2).getTime();
      // let startdate = new Date(enddate - ms);
      // this.datetime1 = this.formatDate(new Date(startdate).toLocaleString());

      this.getAttributeValues(this.assets[this.asset]);
    },
    asset() {
      const SelectTransformer = this.$route.params.SelectTransformer;
      // console.warn(SelectTransformer);
      if (SelectTransformer != undefined) {
        let index = null;
        for (const outerKey in this.assets) {
          if (this.assets[outerKey].path === SelectTransformer) {
            index = outerKey;
            break;
          }
        }
        // this.asset = index;
        this.setAsset(parseFloat(index));
        // console.log(index);
      }
      console.log(this.asset);
      this.getAttributeValues(this.assets[this.asset]);
    },
  },
  methods: {
    setAsset(index) {
      this.asset = index;
      this.$route.params.SelectTransformer = undefined;
      // console.log(this.$route.params.SelectTransformer)
      // console.log("0");
    },
    setRealTime(realtime) {
      this.realtime = realtime;

      if (this.realtime) {
        let fromNowTodt2 = new Date().getTime() - new Date(this.datetime2).getTime();
        let ms = new Date(this.datetime2).getTime() - new Date(this.datetime1).getTime();

        this.timer = setInterval((res) => {
          var current = new Date(new Date().getTime() - fromNowTodt2);
          var dt1 = current.getTime() - ms;

          this.datetime2 = this.formatDate(current.toLocaleString());
          this.datetime1 = this.formatDate(new Date(dt1).toLocaleString());
        }, 5000); // 5sec
      } else {
        clearInterval(this.timer);
      }
    },
    getAttributeValues(element) {
      if (element != null) {
        // fetch data from db based on datetime1 and datetime2...
        axios({
          url: process.env.VUE_APP_BASEURL + "/elements/" + element.id + "/attribute-values",
          method: "GET",
          params: {
            start: this.datetime1,
            end: this.datetime2,
          },
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
          .then((res) => {
            // console.log(res.data);
            this.data = res.data.values.map((d) => {
              const parts = d.path.split("\\");
              const site = parts[0];
              const substation = parts[1];
              const transformer = parts[2];

              let obj = {
                StartTime: this.datetime1,
                EndTime: this.datetime2,
                timestamp: d.timestamp,
                site: site,
                substation: substation,
                transformer: transformer,
                c2h2: d.acetylene,
                c2h4: d.ethylene,
                ch4: d.methane,
                c2h6: d.ethane,
                c2h2_roc: d.acetylene_roc,
                c2h4_roc: d.ethylene_roc,
                ch4_roc: d.methane_roc,
                c2h6_roc: d.ethane_roc,
                h2_roc: d.hydrogen_roc,
                co: d.carbon_monoxide,
                co2: d.carbon_dioxide,
                h2: d.hydrogen,
                n2: d.nitrogen,
                t1: d.t1,
                t2: d.t2,
                t3: d.t3_biotemp,
                t4: d.t4,
                t5: d.t5,
                t6: d.t6,
                t7: d.t7,
                p1: d.p1,
                p2: d.p2,
                nei: d.nei,
                iec_ratio: d.iec_ratio,
                dornenberg_ratio: d.dornenberg,
                rogers_ratio: d.rogers_ratio,
                carbon_ratio: d.carbon_ratio,
                element_id: d.id,
              };
              return obj;
            });
            // console.log(this.current.acetylene_roc);
            this.current = res.data.current ? res.data.current : {};
            this.current.interpretation = res.data.current[this.getSymbolById(this.symbol.id)];
            //Calculate current percentage of gases for pentagon
            var currentGasTotal = this.current.acetylene + this.current.ethylene + this.current.methane + this.current.ethane + this.current.hydrogen;

            var currentC2H2 = (this.current.acetylene / currentGasTotal) * 100;
            var currentC2H4 = (this.current.ethylene / currentGasTotal) * 100;
            var currentCH4 = (this.current.methane / currentGasTotal) * 100;
            var currentC2H6 = (this.current.ethane / currentGasTotal) * 100;
            var currentH2 = (this.current.hydrogen / currentGasTotal) * 100;
            this.current.c2h2_pc_pen = currentC2H2.toFixed(2);
            this.current.c2h4_pc_pen = currentC2H4.toFixed(2);
            this.current.ch4_pc_pen = currentCH4.toFixed(2);
            this.current.c2h6_pc_pen = currentC2H6.toFixed(2);
            this.current.h2_pc_pen = currentH2.toFixed(2);
            //Calculate current percentage of gases for triangle
            var currentGasTotal = this.current.acetylene + this.current.ethylene + this.current.methane;
            var currentC2H2 = (this.current.acetylene / currentGasTotal) * 100;
            var currentC2H4 = (this.current.ethylene / currentGasTotal) * 100;
            var currentCH4 = (this.current.methane / currentGasTotal) * 100;
            this.current.c2h2_pc_tri_1 = currentC2H2.toFixed(2);
            this.current.c2h4_pc_tri_1 = currentC2H4.toFixed(2);
            this.current.ch4_pc_tri_1 = currentCH4.toFixed(2);
            //Calculate current percentage of gases for triangle
            var currentGasTotal = this.current.methane + this.current.ethane + this.current.hydrogen;
            var currentCH4 = (this.current.methane / currentGasTotal) * 100;
            var currentC2H6 = (this.current.ethane / currentGasTotal) * 100;
            var currentH2 = (this.current.hydrogen / currentGasTotal) * 100;
            this.current.ch4_pc_tri_2 = currentCH4.toFixed(2);
            this.current.c2h6_pc_tri_2 = currentC2H6.toFixed(2);
            this.current.h2_pc_tri_2 = currentH2.toFixed(2);
            //Calculate current percentage of gases for triangle
            var currentGasTotal = this.current.ethylene + this.current.ethane + this.current.methane;
            var currentC2H4 = (this.current.ethylene / currentGasTotal) * 100;
            var currentC2H6 = (this.current.ethane / currentGasTotal) * 100;
            var currentCH4 = (this.current.methane / currentGasTotal) * 100;
            this.current.c2h4_pc_tri_3 = currentC2H4.toFixed(2);
            this.current.c2h6_pc_tri_3 = currentC2H6.toFixed(2);
            this.current.ch4_pc_tri_3 = currentCH4.toFixed(2);
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else {
        return;
      }
    },

    generatePDF() {
      this.loading = true;
      setTimeout(() => {
        window.print();
        this.loading = false;
      }, 1000);
    },

    generateCSV() {
      // Set the loading flag to true
      this.loading = true;

      // Show a loading indicator for 1 second
      setTimeout(() => {
        // Create a copy of the original data with formatted timestamp
        const dataWithFormattedTimestamp = this.data.map((item) => {
          // Clone each object in the array to avoid modifying the original objects
          const clonedItem = Object.assign({}, item);

          // Format the timestamp property to a human-readable date format
          clonedItem.timestamp = new Date(item.timestamp).toLocaleString();

          // Delete the timestamp property from the cloned object
          // delete clonedItem.timestamp;
          // Delete the element property, if desired
          delete clonedItem.element;

          return clonedItem;
        });

        // Generate CSV from the modified data array
        const csv = Papa.unparse(dataWithFormattedTimestamp);

        //creating and downloading the CSV
        const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const csvURL = window.URL.createObjectURL(csvData);
        const link = document.createElement("a");
        link.href = csvURL;
        link.setAttribute("download", "exported_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Set the loading flag to false
        this.loading = false;
      }, 1000);
    },

    selectTime(time) {
      this.timerange = time;
      this.timeselector = false;
    },
    switchSymbol(symbol) {
      this.symbol = symbol;

      this.current.interpretation = this.current[this.getSymbolById(this.symbol.id)];
      this.symbols_dialog = false;
    },
    openDatePicker(type) {
      this.date_type = type;
      this.datepicker = true;
    },
    setDate(date, now) {
      if (now) {
        this.date = date;
        this.datepicker = false;
      } else {
        this.date = date;

        if (this.date_type == "date1") {
          var date_val = new Date(this.datetime1);
          var time = date_val.getHours() + ":" + date_val.getMinutes();
          this.time = time;
        }
        if (this.date_type == "date2") {
          var date_val = new Date(this.datetime2);
          var time = date_val.getHours() + ":" + date_val.getMinutes();
          this.time = time;
        }

        this.datepicker = false;
        this.timepicker = true;
      }
    },
    setTime(time) {
      if (this.date_type == "date1") {
        this.datetime1 = this.date + " " + time + ":00";
      } else if (this.date_type == "date2") {
        this.datetime2 = this.date + " " + time + ":00";
      }

      this.timepicker = false;
    },
    closeTimePicker() {
      this.timepicker = false;
    },
    closeDatePicker() {
      this.datepicker = false;
    },
    checkLimitDetails(gas) {
      // console.log(this.gasses[gas]);
      this.gas_limit = this.gasses[gas];
      this.gas_limit_dialog = true;
    },
    legendsDialog(data) {
      loadData(data);
    },
    showInterpretations(item) {
      this.attribute_value_details = item;
      this.showInterpretationsPopup = true;
    },
    hideLogPopup() {
      this.showInterpretationsPopup = false;
      // this.validation_dialog = true;
    },
  },
  components: {
    // DuvalsTriangleOne,
    // DuvalsTriangleTwo,
    // DuvalsTriangleThree,
    // DuvalsTriangleFour,
    // DuvalsTriangleFive,
    // DuvalsTriangleSix,
    // DuvalsTriangleSeven,
    // DuvalsPentagonTwo,
    // DuvalsPentagonOne,
    DatePicker,
    TimePicker,
    // LineChart,
    // LineGraph,
    // Gauge,
    GasLimitDetails,
    SummaryInterpretations,
    InterpretationsDetails,
  },
};
</script>
