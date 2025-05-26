<template>
  <div class="pa-1">
    <!-- <v-row dense>
    <v-col cols="12" md="5">
    <div class="mt-1 mr-2">
      <v-text-field dense color="red" hint="YYYY-MM-DD HH:MM:SS" persistent-hint outlined label="Start" append-icon="mdi-calendar"  @click:append="openDatePicker('date1')" v-model="datetime1">
      </v-text-field>
    </div>
    </v-col>
    <v-col cols="12" md="5">
    <div class="mt-1 mr-2">
      <v-text-field dense color="red" hint="YYYY-MM-DD HH:MM:SS" persistent-hint outlined label="End" append-icon="mdi-calendar"  @click:append="openDatePicker('date2')" v-model="datetime2">
      </v-text-field>
    </div>
    </v-col>
    <v-col cols="12" md="2">
    <v-btn  @click="emitFilter">Filter</v-btn>
    <v-btn :color="realtime ? 'red' : ''" :dark="realtime" @click="setRealTime(!realtime)">Realtime</v-btn>
    </v-col>
    </v-row> -->

    <v-row dense>
      <v-col cols="12" sm="4">
        <v-text-field :disabled="loadingattributevalues || loadingH2ScanPage || getDetailsLoading" dense color="red" hint="YYYY-MM-DD HH:MM:SS" persistent-hint outlined label="Start" append-icon="mdi-calendar"  @click:append="openDatePicker('date1')" v-model="datetime1">
      </v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field :disabled="loadingattributevalues || loadingH2ScanPage || getDetailsLoading" dense color="red" hint="YYYY-MM-DD HH:MM:SS" persistent-hint outlined label="End" append-icon="mdi-calendar"  @click:append="openDatePicker('date2')" v-model="datetime2">
      </v-text-field>
      </v-col>
      <v-col class="mt-1" cols="12" sm="4">
        <v-btn class="mr-1" :disabled="loadingattributevalues || loadingH2ScanPage || getDetailsLoading"  @click="emitFilter">Filter</v-btn>
        <!-- <v-btn :disabled="loading" :color="realtime ? 'red' : ''" :dark="realtime" @click="setRealTime(!realtime)">Realtime</v-btn> -->
      </v-col>
    </v-row>

    <DatePicker :dialog="datepicker" :date="date" @setDate="setDate" @close="closeDatePicker"></DatePicker>
    <TimePicker :dialog="timepicker" @setTime="setTime" @close="closeTimePicker" :current_time="time"></TimePicker>
  </div>
</template>

<script>
import DatePicker from "@/components/pickers/DatePicker.vue";
import TimePicker from "@/components/pickers/TimePicker.vue";
import { timeMixin } from "@/mixins/timeMixin.js";

export default {
  name: "DateRangePickers", 
  props: ["storageID", "loadingattributevalues", "loadingH2ScanPage", "getDetailsLoading"],
  components: { DatePicker, TimePicker },
  mixins: [timeMixin],
  data() {
    return {
      date: null,
      time: null,
      date_type: null,
      datepicker: false,
      timepicker: false,
      datetime1: null,
      datetime2: null,
      realtime: false,
    };
  },
  mounted() {

    var current = this.formatDate(new Date());
    var dt1 = localStorage.getItem(this.storageID) ? JSON.parse(localStorage.getItem(this.storageID)) : this.formatDate(new Date().getTime() - this.getMsByTime("1d"));
    
    this.datetime2 = this.formatDate(current.toLocaleString());
    this.datetime1 = this.formatDate(dt1.toLocaleString());
    this.$emit("filter", this.datetime1, this.datetime2);
  },

  methods: {
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
          this.emitFilter(); // emit everytime
        }, 5000); // 5sec
      } else {
        clearInterval(this.timer);
      }
    },
    closeTimePicker() {
      this.timepicker = false;
    },
    closeDatePicker() {
      this.datepicker = false;
    },
    emitFilter() {
      //   console.log("click");
      localStorage.setItem(this.storageID, JSON.stringify(this.datetime1));
      this.$emit("filter", this.datetime1, this.datetime2);
    },
  },
};
</script>
