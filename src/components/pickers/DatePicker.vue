<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="460" @click:outside="close()">
      <v-date-picker v-model="selected_date" landscape color="red darken-3" :max="max" @change="getDate()">
        <v-spacer></v-spacer>
        <!-- <v-btn dark color="red" small left @click="setDateNow()" >
                Set To Now
            </v-btn> -->
      </v-date-picker>
    </v-dialog>
  </v-row>
</template>

<script>
import { timeMixin } from "@/mixins/timeMixin.js";
export default {
  name: "DatePicker",
  props: ["dialog", "date", "time"],
  mixins: [timeMixin],
  data() {
    return {
      selected_date: new Date().toISOString().substr(0, 7),
      duvals: null,
      max: null,
    };
  },
  watch: {
    date() {
      this.selected_date = this.date;
    },
  },
  mounted() {
    let dateNow = new Date();
    let y = dateNow.getFullYear();
    let m = parseInt(dateNow.getMonth()) + 1;
    let d = dateNow.getDate();
    this.max = `${y.toString()}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
  },
  methods: {
    setDateNow() {
      this.$emit("setDate", this.formatDate(new Date().toLocaleString()), true);
    },
    getDate() {
      this.$emit("startDate", this.selected_date, false);
    },
    getDate() {
      this.$emit("setDate", this.selected_date, false);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
