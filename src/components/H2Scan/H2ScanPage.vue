<template>
  <!-- <div v-if="viewReady === false"><v-progress-circular indeterminate></v-progress-circular></div> -->
  <!-- <div v-else-if="viewReady === true" class="pa-2"> -->
  <div class="pa-2">
    <v-row dense>
      <v-col class="mt-1" cols="12" sm="3">
        <v-select :items="sensors" label="Select Sensor" :disabled="loadingH2ScanPage" outlined dense
          color="red"></v-select>
      </v-col>
      <v-col cols="12" sm="8">
        <DateRangePickers storageID="h2scanPicker" @filter="filter" :loadingH2ScanPage="loadingH2ScanPage" />
      </v-col>
      <v-col cols="12" sm="1">


        <!-- <v-btn  @click="refetch">
         {{ loading ? "Loading" : "Reload" }}
        </v-btn> -->

        <v-btn class="mt-2" :loading="loading" :disabled="loading" @click="refetch">
          Reload
          <!-- <v-icon>mdi-refresh</v-icon> -->
          <template v-slot:loader>
            <span class="custom-loader ml-1">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
        <!-- <v-btn text icon @click="toggleInitForm">
          <v-icon>mdi-cog</v-icon>
        </v-btn> -->

      </v-col>

    </v-row>

    <!-- <v-progress-circular v-if="viewReady === false" indeterminate></v-progress-circular> -->
    <!-- <v-row class="pt-0" dense v-if="current.length !== 0 && viewReady === true"> -->

    <v-row v-if="viewReady === true">

      <template v-if="current && current.length > 0"></template>

      <template v-else>
        <v-col cols="12" class="text-center ma-0 pa-0">
          <v-alert dismissible color="red darken-3" border="left" elevation="2" colored-border>
            No data available for the selected time range.
          </v-alert>
        </v-col>
      </template>

      <v-col class="ma-0 pa-0" cols="2">
        <v-row>
          <v-col>
            <FancyGuage canvasID="HydrogenGuage" chartTitle="Hydrogen PPM" :activeTab="analysisTab" tabItem="1"
              type="hydrogen" :latest_data="current && current[0] ? current[0].hydrogen_ppm : 0" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pa-0">
            <FancyGuage canvasID="OilTempGuage" chartTitle="Liquid Temp" :activeTab="analysisTab" tabItem="1"
              type="hydrogen" :latest_data="current && current[0] ? current[0].oil_temperature : 0" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <MultiLineGraph
                canvasID="Hydrogen History"
                chartTitle="Hydrogen PPM vs Liquid Temperature"
                :historical_data="formattedData"
                :showTrends="['timestamp', 'hydrogen_ppm', 'oil_temperature']"
                trendLabels="timestamp"
                :legends="['', 'Hydrogen PPM', 'Oil Temperature']"
                :canvasHeight="173"
              />
      </v-col>


      <v-col cols="4">
        <v-card outlined>
          <v-simple-table dense>
            <thead>
              <tr>
                <th class="text-left">
                  <h3>Service Status</h3>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size: 9pt">Data Available</td>
                <td>
                  <div v-if="current && current[0] && current[0].data_available !== false"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">Unit Ready</td>
                <td>
                  <div v-if="current && current[0] && current[0].unit_ready !== false"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">Error</td>
                <td>
                  <div v-if="current && current[0] && current[0].error !== true"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">Battery Backup Error</td>
                <td>
                  <div v-if="current && current[0] && current[0].battery_backup_error !== true"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">Hydrogen Sensor Fault</td>
                <td>
                  <div v-if="current && current[0] && current[0].hydrogen_sensor_fault !== true"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">Temperature Sensor Fault</td>
                <td>
                  <div v-if="current && current[0] && current[0].temperature_sensor_fault !== true"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">PCB Temp Over 150 °C</td>
                <td>
                  <div v-if="current && current[0] && current[0].pcb_temp_over_105C !== true"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">Heater Fault</td>
                <td>
                  <div v-if="current && current[0] && current[0].heater_fault !== true"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">Config Data Not Valid</td>
                <td>
                  <div v-if="current && current[0] && current[0].config_data_not_valid !== true"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">Required Data NA</td>
                <td>
                  <div v-if="current && current[0] && current[0].required_data_NA !== true"
                    style="height: 20px; width: 20px; background-color: green;"></div>
                  <div v-else style="height: 20px; width: 20px; background-color: purple;"></div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 9pt">Sensor State</td>
                <td>
                  <div style="font-size: 9pt; font-weight: bold;">
                    {{ current && current[0] ? sensorStateDispenser(current[0].sensor_state) : 'No Data' }}
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>




    <!-- <v-row class="pt-0" v-if="current.length !== 0 && viewReady === true"> -->
    <v-row class="mb-5 pa-0" v-if="viewReady === true">
      <!-- Delta Values & PCB Temp Column -->
      <template>
        <v-col cols="8">
          <v-row>
            <v-col v-for="(key, index) in ['delta_day', 'delta_week', 'delta_month']" :key="index">
              <v-card outlined>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th>
                        <h3>{{ key.replace('_', ' ').toUpperCase() }}</h3>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center">
                        <h1>{{ current[0] && current[0][key] !== undefined ? current[0][key] : 0 }}</h1>
                      </td>
                      <td :class="getColorClass(current[0] && current[0][key], current[1] ? current[1][key] : 0)">
                        <v-icon :color="getColor(current[0] && current[0][key], current[1] ? current[1][key] : 0)">
                          {{ getIcon(current[0] && current[0][key], current[1] ? current[1][key] : 0) }}
                        </v-icon>
                        <span>{{ computePercentageChange(current[0] && current[0][key], current[1] ? current[1][key] :
                          0).toFixed(2) }}%</span>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <MultiLineGraph canvasID="pcb_temperature" chartTitle="PCB Temperature" :historical_data="formattedData"
                :showTrends="['timestamp', 'pcb_temperature']" trendLabels="timestamp" :legends="['', 'PCB Temperature']"
            :canvasHeight="100"/>
            </v-col>
          </v-row>
        </v-col>

        <!-- Device Details Column -->
        <v-col cols="4">
          <v-card outlined>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th class="text-left">
                    <h3>Device Details</h3>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-size: 9pt">Device</td>
                  <td><img src="@/assets/h2scan_hy-alerta_5021.png" alt="h2scan-logo" width="150px" /></td>
                </tr>
                <tr>
                  <td style="font-size: 9pt">Dissolved Gas Calibration Date</td>
                  <td style="font-size: 9pt">{{ current[0] && current[0].dissolved_gas_calibration_date || 'N/A' }}</td>
                </tr>
                <tr>
                  <td style="font-size: 9pt">Factory Calibration Date</td>
                  <td style="font-size: 9pt">{{ current[0] && current[0].factory_calibration_date || 'N/A' }}</td>
                </tr>
                <tr>
                  <td style="font-size: 9pt">Firmware Version</td>
                  <td style="font-size: 9pt">{{ current[0] && current[0].firmware_revision || 'N/A' }}</td>
                </tr>
                <tr>
                  <td style="font-size: 9pt">Manufacturing Date</td>
                  <td style="font-size: 9pt">{{ current[0] && current[0].manufacturing_date || 'N/A' }}</td>
                </tr>
                <tr>
                  <td style="font-size: 9pt">Model No.</td>
                  <td style="font-size: 9pt">{{ current[0] && current[0].model_num || 'N/A' }}</td>
                </tr>
                <tr>
                  <td style="font-size: 9pt">Product Serial No.</td>
                  <td style="font-size: 9pt">{{ current[0] && current[0].product_serial_num || 'N/A' }}</td>
                </tr>
                <tr>
                  <td style="font-size: 9pt">Sensor Board Serial No.</td>
                  <td style="font-size: 9pt">{{ current[0] && current[0].sensor_board_serial_num || 'N/A' }}</td>
                </tr>
                <tr>
                  <td style="font-size: 9pt">Timestamp:</td>
                  <td style="font-size: 9pt">{{ current[0] && current[0].timestamp ? new Date(current[0].timestamp).toLocaleString() : 'N/A' }} </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>
      </template>

      <!-- Show No Data message if there's no data -->

    </v-row>




    <!-- Not Included -->
    <v-dialog v-model="showDeviceInfo" persistent max-width="800">
      <v-card>
        <v-card-actions>
          <v-card-title>Device Information</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="showDeviceInfo = false" text><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>
        <v-card-text>
          <v-row>
            <!-- device info table -->
            <v-col cols="12" sm="6">
              <v-card outlined>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th class="text-left">Description</th>
                      <th class="text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="font-size: 9pt">Dissolved Gas Calibration Date</td>
                      <td style="font-size: 9pt">{{ new Date().toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Factory Calibration Date</td>
                      <td style="font-size: 9pt">{{ new Date().toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Firmware Revision</td>
                      <td style="font-size: 9pt">2024</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Manufacturing Date</td>
                      <td style="font-size: 9pt">{{ new Date().toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Model</td>
                      <td style="font-size: 9pt">Gen 5</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Product Serial</td>
                      <td style="font-size: 9pt">002321</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Sensor Board Serial</td>
                      <td style="font-size: 9pt">{{ current.sensor_board_serial_num }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Sensor Serial</td>
                      <td style="font-size: 9pt">AXC00213</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card>

            </v-col>
            <v-col cols="12" sm="6">
              <v-card outlined>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th class="text-left">Faults</th>
                      <th class="text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="font-size: 9pt">Hydrogen Sensor</td>
                      <td
                        :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('HydrogenSensorFault') === 0 ? 'green' : 'red' }">
                        {{ getLatestDatapoint('HydrogenSensorFault') === 0 ? 'No Fault' : 'Has Fault' }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Temperature Sensor</td>
                      <td
                        :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('TemperatureSensorFault') === 0 ? 'green' : 'red' }">
                        {{ getLatestDatapoint('TemperatureSensorFault') === 0 ? 'No Fault' : 'Has Fault' }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">PCB Temp</td>
                      <td
                        :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('PCBTempOver105C') === 0 ? 'green' : 'red' }">
                        {{ getLatestDatapoint('PCBTempOver105C') === 0 ? '105C' : 'Over 105C' }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Heater</td>
                      <td
                        :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('HeaterFault') === 0 ? 'green' : 'red' }">
                        {{ getLatestDatapoint('HeaterFault') === 0 ? 'No Fault' : 'Has Fault' }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Required Data</td>
                      <td
                        :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('RequiredDataNA') === 0 ? 'green' : 'red' }">
                        {{ getLatestDatapoint('RequiredDataNA') === 0 ? 'Not Applicable' : 'Applicable' }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Configuration Data</td>
                      <td
                        :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('ConfigurationDataNotValid') === 0 ? 'green' : 'red' }">
                        {{ getLatestDatapoint('ConfigurationDataNotValid') === 0 ? 'Valid' : 'Not Valid' }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Battery Backup</td>
                      <td
                        :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('BatteryBackupError') === 0 ? 'green' : 'red' }">
                        {{ getLatestDatapoint('BatteryBackupError') === 0 ? 'No Error' : 'Has Error' }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Error</td>
                      <td :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('Error') === 0 ? 'green' : 'red' }">
                        {{
                          getLatestDatapoint('Error') === 0 ? 'No Error' : 'Has Error' }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <!-- <div>Faults</div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('HydrogenSensorFault') === 0 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>HydrogenSensorFault</div>
                </div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('TemperatureSensorFault') === 0 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>TemperatureSensorFault</div>
                </div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('PCBTempOver105C') === 0 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>PCBTempOver105C</div>
                </div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('HeaterFault') === 0 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>HeaterFault</div>
                </div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('RequiredDataNA') === 0 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>RequiredDataNA</div>
                </div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('ConfigurationDataNotValid') === 0 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>ConfigurationDataNotValid</div>
                </div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('BatteryBackupError') === 0 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>BatteryBackupError</div>
                </div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('Error') === 0 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>Error</div>
                </div> -->
                <!-- 
                <div>States</div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('UnitReady') === 1 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>UnitReady</div>
                </div>
                <div class="d-flex">
                  <v-icon :color="getLatestDatapoint('DataAvailable') === 1 ? 'green' : 'red'"> mdi-circle </v-icon>

                  <div>DataAvailable</div>
                </div> -->
                <!-- <div class="d-flex">
                  <div><span style="font-weight: bold;">SensorState: </span>{{ sensorStateDispenser(getLatestDatapoint("SensorState")) }}</div>
                </div>
                <small>{{ new Date(getLatestDatapoint("_time")).toLocaleString() }}</small> -->
              </v-card>
            </v-col>
            <!-- Traffic Lights -->
          </v-row>
          <v-row>


            <v-col cols="12" sm="7">
              <v-card outlined>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th class="text-left">States</th>
                      <th class="text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="font-size: 9pt">Unit</td>
                      <td
                        :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('UnitReady') === 1 ? 'green' : 'red' }">
                        {{ getLatestDatapoint('UnitReady') === 1 ? 'Ready' : 'Not Ready' }}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 9pt">Data</td>
                      <td
                        :style="{ 'font-size': '9pt', 'color': getLatestDatapoint('DataAvailable') === 1 ? 'green' : 'red' }">
                        {{ getLatestDatapoint('DataAvailable') === 1 ? 'Available' : 'Not Available' }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card>
              <v-card outlined class="mt-2">
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th class="text-left">Sensor State</th>
                      <th class="text-left">TimeStamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <!-- <td style="font-size: 9pt">Unit</td> -->
                      <td style="font-size: 9pt; font-weight: bold;"> {{
                        sensorStateDispenser(getLatestDatapoint("SensorState")) }}</td>
                      <td style="font-size: 9pt"> {{ new Date(getLatestDatapoint("_time")).toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card>
            </v-col>
            <v-col cols="12" sm="5">
              <v-card outlined class="pa-2">
                <div class="d-flex justify-center">
                  <img src="@/assets/h2scan_hy-alerta_5021.png" alt="h2scan-logo" width="250px" />
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <AlertDialog :show="showAlertDialog" :dialogMessage="dialogMessage" @close="toggleAlertDialog" />
    <UpsertSensorForm :show="showH2SInitForm" :element="elementID" @close="toggleInitForm" />
  </div>

</template>
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
<script>
import axios from "axios";
import FancyGuage from "@/components/charts/FancyCJSGauge.vue";
import MultiLineGraph from "@/components/charts/CJSLineGraph.vue";
import DateRangePickers from "@/components/home/DateRangePickers.vue";
import AlertDialog from "./AlertDialog.vue";
import UpsertSensorForm from "./UpsertSensorForm.vue";
import EventsDetailsDialog from "@/components/popups/EventsDetailsDialog.vue";
import { format } from "date-fns";

export default {
  name: "H2ScanPage",
  props: ["elementID"],
  components: { AlertDialog, FancyGuage, MultiLineGraph, DateRangePickers, UpsertSensorForm, EventsDetailsDialog },
  data() {
    return {
      analysisTab: "",
      current: [],
      viewReady: false,
      showAlertDialog: false,
      dialogMessage: "",
      showH2SInitForm: false,
      datetime1: null,
      datetime2: null,
      loading: false,
      loadingH2ScanPage: false,
      showDeviceInfo: false,
      events: [],
      events_details: {},
      event_dialog: false,
      sensors: ['Calibr8 US H2Scan Valencia Gas'],
    };
  },
  mounted() {
    // this.getTimeseries();
    // this.dialogMessage = "This view is just a preview and is still under development.";
    // this.toggleAlertDialog();
  },
  watch: {
    elementID() {
      this.viewReady = false;
      this.current = [];
      this.getH2scanData();
      // this.getTimeseries();
    },
  },
  computed: {
    computePercentageChange() {
      return (currentValue, previousValue) => {
        if (previousValue === 0) {
          return 0; // Avoid division by zero
        }
        return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
      };
    },

    getColor() {
      return (currentValue, previousValue) => {
        return currentValue > previousValue ? "green" : "red";
      };
    },

    getIcon() {
      return (currentValue, previousValue) => {
        return currentValue > previousValue ? "mdi-chevron-up" : "mdi-chevron-down";
      };
    },

    getColorClass() {
      return (currentValue, previousValue) => {
        return currentValue > previousValue ? "green--text" : "red--text";
      };
    },

    formattedData() {
      return this.current ? this.current.map(item => ({ ...item, timestamp: format(new Date(item.timestamp), "yyyy-MM-dd hh:mm:ss a") })) : [];
    },

  },


  methods: {
    showEvents(item) {
      this.events_details = item;
      this.event_dialog = true;
    },
    hideLogPopup() {
      this.event_dialog = false;
    },
    dateFormat(date) {
      let d = new Date(date);
      return d.toLocaleString();
    },
    toggleDeviceInfo() {
      let temp = !this.showDeviceInfo;
      this.showDeviceInfo = temp;
    },

    percentageChange() {
      // Percentage Change = ((current - previous) / |previous|) * 100
      if (this.previousDelta === 0) {
        return 0; // Avoid division by zero
      }
      return ((this.current[0].delta_day - this.cuurent[1].delta_day) / Math.abs(this.previousDelta)) * 100;
    },
    getH2scanData() {
      this.loading = true;
      this.loadingH2ScanPage = true;

      // Check if startIndex is less than endIndex and if either of them is null
      if (this.datetime1 === null || this.datetime2 === null) {
        alert("Start index or end index cannot be null.");
        this.loading = false;
        this.loadingH2ScanPage = false;
        return; // Exit the function
      }

      if (this.datetime1 >= this.datetime2) {
        // alert("Start index must be less than end index.");
        this.dialogMessage = "Start index must be less than end index";
        this.toggleAlertDialog();
        this.loading = false;
        this.loadingH2ScanPage = false;
        return; // Exit the function
      }

      axios({
        url: process.env.VUE_APP_BASEURL + "/h2scan-data",
        method: "GET",
        params: {
          // company: JSON.parse(localStorage.getItem("user")).user.company_id,
          // element_id: this.elementID,
          streamID: "Calibr8_US_H2Scan_Valencia_Gas",
          startIndex: this.datetime1,
          endIndex: this.datetime2,
        },
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {

          this.current = res.data;
          this.viewReady = true;
          this.loading = false;
          this.loadingH2ScanPage = false;
        })
        .catch((error) => {
          console.log(error);
          alert("An error occurred: " + error.message);
          this.loading = false;
          this.loadingH2ScanPage = false;
        });
    },


    // if (this.datetime1 !== null && this.datetime2 !== null) {
    //   this.current = [];
    //   this.events = [];
    //   this.viewReady = true;
    //   this.loading = false;
    // console.log("get");
    // axios({
    //   url: process.env.VUE_APP_BASEURL + "/influx/query",
    //   method: "POST",
    //   params: {
    //     // company: JSON.parse(localStorage.getItem("user")).user.company_id,
    //     element_id: this.elementID,
    //     sensor_type: "H2Scan",
    //     start: this.datetime1,
    //     stop: this.datetime2,
    //   },
    //   headers: {
    //     Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    //   },
    // })
    //   .then((res) => {
    //     // console.log(res);
    //     if (res.status === 200) {
    //       this.current = res.data.results_clean;
    //       this.events = res.data.events;
    //       this.viewReady = true;
    //       this.loading = false;
    //     }
    //   })
    //   .catch((err) => {
    //     if (err.response.status === 404) {
    //       // h2scan not initialized
    //       // console.log(err.response.data.message);
    //       this.loading = false;
    //       this.viewReady = true;
    //       this.dialogMessage = err.response.data.message + ". Click the settings button on the top right to update or initialize an H2Scan view for this element.";
    //       this.toggleAlertDialog();
    //     } else {
    //       // "Client error: Query sent might be incorrect" or influx server is down
    //       // console.log(err.response.data.message);
    //       this.loading = false;
    //       this.viewReady = true;
    //       this.dialogMessage = err.response.data.message;
    //       this.toggleAlertDialog();
    //     }
    //   });
    // }

    // getTimeseries() {
    //   this.loading = true;
    //   if (this.datetime1 !== null && this.datetime2 !== null) {
    //     // console.log("get");
    //     axios({
    //       url: process.env.VUE_APP_BASEURL + "/influx/query",
    //       method: "POST",
    //       params: {
    //         // company: JSON.parse(localStorage.getItem("user")).user.company_id,
    //         element_id: this.elementID,
    //         sensor_type: "H2Scan",
    //         start: this.datetime1,
    //         stop: this.datetime2,
    //       },
    //       headers: {
    //         Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    //       },
    //     })
    //       .then((res) => {
    //         // console.log(res);
    //         if (res.status === 200) {
    //           // this.current = res.data.results_clean;
    //           this.events = res.data.events;
    //           this.viewReady = true;
    //           this.loading = false;
    //         }
    //       })
    //       .catch((err) => {
    //         if (err.response.status === 404) {
    //           // h2scan not initialized
    //           // console.log(err.response.data.message);
    //           this.loading = false;
    //           this.viewReady = true;
    //           this.dialogMessage = err.response.data.message + ". Click the settings button on the top right to update or initialize an H2Scan view for this element.";
    //           this.toggleAlertDialog();
    //         } else {
    //           // "Client error: Query sent might be incorrect" or influx server is down
    //           // console.log(err.response.data.message);
    //           this.loading = false;
    //           this.viewReady = true;
    //           this.dialogMessage = err.response.data.message;
    //           this.toggleAlertDialog();
    //         }
    //       });
    //   }
    // },
    toggleAlertDialog() {
      this.showAlertDialog = !this.showAlertDialog;
    },
    refetch() {
      this.loading = true;
      this.loadingH2ScanPage = true;
      this.viewReady = false;
      this.current = [];
      // this.getTimeseries();
      this.getH2scanData();
    },
    twoDecimalPlaces(longFloat) {
      // return two decimal places of the long float
      return Math.round((parseFloat(longFloat) + Number.EPSILON) * 100) / 100;
    },
    getLatestDatapoint() {
      // blind assumption that the lastest value is in the last element.. hehe..
      if (this.current.length === 0) return 0;
      return this.current;
      // console.log(this.current);
    },
    sensorStateDispenser(key) {
      switch (key) {
        case 1:
          return "Hydrogen Measurement Cycle";
        case 2:
          return "Oil Temperature Measurement Cycle";
        case 3:
          return "Auto Calibration Cycle";
        case 4:
          return "Oil Temperature Too High";
        default:
          return "Unidentified State";
      }
    },
    toggleInitForm() {
      this.showH2SInitForm = !this.showH2SInitForm;
    },
    filter(dt1, dt2) {
      // console.log(new Date(dt2).toISOString());
      this.loadingH2ScanPage = true;
      this.datetime1 = new Date(dt1).toISOString();
      this.datetime2 = new Date(dt2).toISOString();
      this.getH2scanData();
      this.viewReady = false;
      // this.getTimeseries();
    },

  },
};
</script>
