<template>
  <v-dialog v-model="show" max-width="800" min-width="800" persistent>
    <template>
      <v-card>
        <v-card-title>Initialize or Update Sensor</v-card-title>

        <v-card-text class="mb-0">
          <!-- transformer_id bucker_id sensor_type _measurement tags list filters list -->
          <v-row>
            <!-- hidden form: create bucket -->
            <v-col v-if="showSetupBucketForm" cols="12">
              <div>
                <h2 class="mb-2">Setup a Source Bucket Connection</h2>
                <div class="d-flex">
                  <v-text-field class="mx-1" label="org_id" v-model="newBucket.org_id" outlined hide-details dense></v-text-field>
                  <v-text-field class="mx-1" label="influx_bucket_id" v-model="newBucket.influx_bucket_id" outlined hide-details dense></v-text-field>
                  <v-text-field class="mx-1" label="influx_bucket_name" v-model="newBucket.influx_bucket_name" outlined hide-details dense></v-text-field>
                </div>
                <div class="d-flex mt-2">
                  <v-text-field class="mx-1" label="influx_host" v-model="newBucket.influx_host" outlined hide-details dense></v-text-field>
                  <v-text-field class="mx-1" label="token_read" v-model="newBucket.token_read" outlined hide-details dense></v-text-field>
                  <v-text-field class="mx-1" label="token_write" v-model="newBucket.token_write" outlined hide-details dense></v-text-field>
                </div>
                <div class="d-flex mt-2 justify-end">
                  <v-btn small depressed color="orange" @click="saveBucket">Save Bucket</v-btn>
                  <v-btn small text color="red" @click="toggleSetupBucketForm">Cancel</v-btn>
                </div>
                <v-divider class="mt-2"></v-divider>
              </div>
            </v-col>
            <!-- hidden form: create sensor_type -->
            <v-col v-if="showCreateSensorTypeForm" cols="12">
              <div>
                <h2 class="mb-2">Create Sensor Type</h2>
                <v-text-field class="mx-1" label="Type name" v-model="newSensorType.type" outlined hide-details dense></v-text-field>

                <div class="d-flex mt-2 justify-end">
                  <v-btn small depressed color="orange" @click="saveSensorType">Save Sensor Type</v-btn>
                  <v-btn small text color="red" @click="toggleSensorTypeForm">Cancel</v-btn>
                </div>
                <v-divider class="mt-2"></v-divider>
              </div>
            </v-col>

            <v-col cols="4">
              <h2 class="mb-2">Sensor Details</h2>
              <div class="d-flex align-center mb-2">
                <v-select v-model="bucketSelected" :items="buckets" item-text="influx_bucket_name" item-value="id" label="Influx Bucket" outlined hide-details dense></v-select>
                <v-btn class="ml-2" fab depressed color="green lighten-4" x-small @click="toggleSetupBucketForm"><v-icon dark> mdi-plus </v-icon></v-btn>
              </div>
              <div class="d-flex align-center mb-2">
                <!-- this is always h2scan -->
                <v-select v-model="sensorTypeSelected" :items="sensorTypes" item-text="type" item-value="id" label="Sensor Type" outlined hide-details dense></v-select>
                <v-btn class="ml-2" fab depressed color="green lighten-4" x-small @click="toggleSensorTypeForm"><v-icon dark> mdi-plus </v-icon></v-btn>
              </div>
              <!-- this is always singlegasSensor -->
              <v-text-field class="mb-4" v-model="msrmnt" label="_measurement" outlined hide-details dense></v-text-field>

              <h3>Test: {{ test_result.message }}</h3>
              <v-card outlined elevation="0" class="pa-2">{{ test_result.test_output }}</v-card>
            </v-col>
            <v-col cols="8">
              <div class="mb-4">
                <h2 class="mb-2">Filters</h2>

                <!-- table -->
                <v-simple-table v-if="filters.length !== 0" dense height="150" class="mb-2">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Keys</th>
                        <th class="text-left">Values</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in filters" :key="item.key">
                        <td>{{ item.key }}</td>
                        <td>{{ item.value }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <!-- <div v-if="filters.length !== 0">{{ JSON.stringify(filters, null, 2) }}</div> -->

                <div class="d-flex align-center">
                  <v-text-field class="mx-1" label="Key" v-model="newFilter.key" outlined hide-details dense></v-text-field>
                  <v-text-field class="mx-1" label="Value" v-model="newFilter.value" outlined hide-details dense></v-text-field>
                  <v-btn class="mx-1" fab depressed color="green lighten-4" x-small @click="pushFilter"><v-icon dark> mdi-plus </v-icon></v-btn>
                  <v-btn class="mx-1" fab depressed color="red lighten-4" x-small @click="popFilter"><v-icon dark> mdi-minus </v-icon></v-btn>
                </div>
              </div>

              <div class="mb-4">
                <h2 class="mb-2">Tags</h2>

                <!-- table -->
                <v-simple-table v-if="tags.length !== 0" dense height="150" class="mb-2">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Tag Names</th>
                        <th class="text-left">_fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in tags" :key="item.tag_name">
                        <td>{{ item.tag_name }}</td>
                        <td>{{ item._field }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <!-- <div v-if="tags.length !== 0">{{ JSON.stringify(tags, null, 2) }}</div> -->

                <div class="d-flex align-center">
                  <v-text-field class="mx-1" label="Tag name" v-model="newTag.tag_name" outlined hide-details dense></v-text-field>
                  <v-text-field class="mx-1" label="_field" v-model="newTag._field" outlined hide-details dense></v-text-field>
                  <v-btn class="mx-1" fab depressed color="green lighten-4" x-small @click="pushTag"><v-icon dark> mdi-plus </v-icon></v-btn>
                  <v-btn class="mx-1" fab depressed color="red lighten-4" x-small @click="popTag"><v-icon dark> mdi-minus </v-icon></v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="success" depressed @click="testMapping">Test</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" depressed @click="saveMapping">Save</v-btn>
          <v-btn color="error" text @click="close">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "UpsertSensorForm",
  props: ["show", "element"],
  data() {
    return {
      buckets: [],
      newBucket: {
        org_id: "",
        influx_bucket_id: "",
        influx_bucket_name: "",
        influx_host: "",
        token_read: "",
        token_write: "",
      },
      bucketSelected: "",
      sensorTypes: [],
      newSensorType: {
        type: "",
      },
      sensorTypeSelected: "",
      msrmnt: "singlegasSensor",
      filters: [],
      newFilter: {
        key: "",
        value: "",
      },
      tags: [
        { tag_name: "DeltaDay", _field: "DeltaDay" },
        { tag_name: "DeltaWeek", _field: "DeltaWeek" },
        { tag_name: "DeltaMonth", _field: "DeltaMonth" },
        { tag_name: "PCBTemperature", _field: "PCBTemperature" },
        { tag_name: "Hydrogen", _field: "Hydrogen" },
        { tag_name: "OilTemperature", _field: "OilTemperature" },
        { tag_name: "DataAvailable", _field: "DataAvailable" },
        { tag_name: "SensorState", _field: "SensorState" },
        { tag_name: "UnitReady", _field: "UnitReady" },
        { tag_name: "BatteryBackupError", _field: "BatteryBackupError" },
        { tag_name: "ConfigurationDataNotValid", _field: "ConfigurationDataNotValid" },
        { tag_name: "Error", _field: "Error" },
        { tag_name: "HeaterFault", _field: "HeaterFault" },
        { tag_name: "HydrogenSensorFault", _field: "HydrogenSensorFault" },
        { tag_name: "PCBTempOver105C", _field: "PCBTempOver105C" },
        { tag_name: "RequiredDataNA", _field: "RequiredDataNA" },
        { tag_name: "TemperatureSensorFault", _field: "TemperatureSensorFault" },
      ],
      newTag: {
        tag_name: "",
        _field: "",
      },
      test_result: {},
      showSetupBucketForm: false,
      showCreateSensorTypeForm: false,
    };
  },
  mounted() {
    this.getBuckets();
    this.getSensorTypes();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    toggleSetupBucketForm() {
      this.showSetupBucketForm = !this.showSetupBucketForm;
    },
    toggleSensorTypeForm() {
      this.showCreateSensorTypeForm = !this.showCreateSensorTypeForm;
    },
    pushFilter() {
      // console.log(this.newFilter);
      this.filters.push({ key: this.newFilter.key, value: this.newFilter.value });
      this.newFilter.key = "";
      this.newFilter.value = "";
    },
    popFilter() {
      this.filters.pop();
    },
    pushTag() {
      // console.log(this.newFilter);
      this.tags.push({ tag_name: this.newTag.tag_name, _field: this.newTag._field });
      this.newTag.tag_name = "";
      this.newTag._field = "";
    },
    popTag() {
      this.tags.pop();
    },
    testMapping() {
      this.test_result = {};
      axios({
        url: process.env.VUE_APP_BASEURL + "/influx/testMapping",
        method: "POST",
        data: {
          bucket: this.bucketSelected,
          sensorType: this.sensorTypeSelected,
          _measurement: this.msrmnt,
          filters: this.filters,
          tags: this.tags,
        },
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      }).then((res) => {
        console.log(res.data);
        this.test_result = res.data;
      });
    },
    saveMapping() {
      axios({
        url: process.env.VUE_APP_BASEURL + "/influx/saveMapping",
        method: "POST",
        data: {
          element: this.element,
          bucket: this.bucketSelected,
          sensorType: this.sensorTypeSelected,
          _measurement: this.msrmnt,
          filters: this.filters,
          tags: this.tags,
        },
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data);
            this.$emit("close");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getBuckets() {
      // buckets
      axios({
        url: process.env.VUE_APP_BASEURL + "/influx/buckets",
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      }).then((res) => {
        // console.log(res.data);
        this.buckets = res.data;
      });
    },
    saveBucket() {
      axios({
        url: process.env.VUE_APP_BASEURL + "/influx/saveBucket",
        method: "POST",
        data: this.newBucket,
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          if (res.status === 201) {
            // console.log(res);
            this.showSetupBucketForm = false;
            this.newBucket = {
              org_id: "",
              influx_bucket_id: "",
              influx_bucket_name: "",
              influx_host: "",
              token_read: "",
              token_write: "",
            };
            this.getBuckets();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSensorTypes() {
      // sensor types
      axios({
        url: process.env.VUE_APP_BASEURL + "/influx/sensorTypes",
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      }).then((res) => {
        // console.log(res.data);
        this.sensorTypes = res.data;
      });
    },
    saveSensorType() {
      axios({
        url: process.env.VUE_APP_BASEURL + "/influx/sensorType",
        method: "POST",
        data: this.newSensorType,
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          if (res.status === 201) {
            // console.log(res);
            this.showCreateSensorTypeForm = false;
            this.newSensorType = {
              type: "",
            };
            this.getSensorTypes();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
