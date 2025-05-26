<template>
  <v-dialog v-model="show" width="1000" persistent>
    <v-card>
    <v-card-title color="red" class="darken-2">How to use C8 VORTEX?
      <v-spacer></v-spacer>
      <span v-if="is_new == '0' || store_is_new == '0'"  class="right"><v-icon @click="close()">mdi-close</v-icon></span>
    </v-card-title>
      <v-card-text>
        <v-expansion-panels focusable>
          <v-expansion-panel v-for="(item, i) in items" :key="i">
            <v-expansion-panel-header>
              {{ item.text }}
              <template v-slot:actions>
                <v-icon color="error"> mdi-menu-down </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <iframe
                width="100%"
                height="315"
                :src="item.url"
                title="C8 Vortex Tutorials"
                frameborder="1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-card class="d-flex mt-4 justify-space-between align-end caption" flat>
          <div>
            <div>For more concerns, contact us:</div>

            <v-card class="d-flex mt-1 align-center" flat @click="openNewTab('https://calibr8.systems/c8-contact-page')">
              <v-icon class="pr-4">mdi-link-variant</v-icon>
              <div>https://calibr8.systems/c8-contact-page</div>
            </v-card>
            <v-card class="d-flex mt-1 align-center" flat @click="expandNoJutsu">
              <v-icon class="pr-4">mdi-email-outline</v-icon>
              <div>C8VortexSupport@calibr8systems.com</div>
            </v-card>
          </div>
          <v-btn v-if="is_new == '1' && store_is_new == '1'" text x-small dark color="red" @click="is_annoying()">Don't show this again</v-btn>
        </v-card>

        <!-- feedback and support textarea -->
        <div v-if="fs_ty">
          <v-alert dense text dismissible type="success"> Thank you for sending us your concerns. This will help us improve our service. </v-alert>
        </div>
        <div v-if="fspanel">
          <v-textarea color="red" v-model="fsstring" class="mt-4" hide-details outlined label="Tell us what you think of Vortex"></v-textarea>
          <v-card class="d-flex justify-end align-end" flat>
            <v-btn :disabled="loading" class="" style="top: -37px; left: -1px" text depressed @click="sendfs()">{{ loading ? "Sending..." : "Send" }}</v-btn>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import store from "@/store";
import axios from "axios";
export default {
  name: "FAQDialog",
  props: ['show', 'user'],
  data() {
    return {
      fspanel: false,
      fs_ty: false,
      items: [
        {
          key: 1,
          text: "How do I create a transformer element?",
          url: "https://www.youtube-nocookie.com/embed/Pw7Ml8-DtK0",
        },
        {
          key: 2,
          text: "How do I add transformer details?",
          url: "https://www.youtube-nocookie.com/embed/sY-BuYIVm5w",
        },
        {
          key: 3,
          text: "How do I update transformer details?",
          url: "https://www.youtube-nocookie.com/embed/yelvk3929Lg",
        },
        {
          key: 4,
          text: "How do I log Dissolved Gas Analysis data?",
          url: "https://www.youtube-nocookie.com/embed/PedmB8IALy4",
        },
        {
          key: 5,
          text: "How do I set dashboard asset and time range?",
          url: "https://www.youtube-nocookie.com/embed/GvUgTHk8jO4",
        },
        {
          key: 6,
          text: "How do I view Dissolved Gas Analysis interpretations?",
          url: "https://www.youtube-nocookie.com/embed/l7m501ZOsVU",
        },
        {
          key: 7,
          text: "How do I export Dissolved Gas Analysis data and interpretations?",
          url: "https://www.youtube-nocookie.com/embed/kxQvtbPyaTY",
        },
      ],
      fsstring: "",
      loading: false,
      store: "",
      is_new: "",
      store_is_new: "1",
      
    };
  },

  
  watch: {
        'user'(){
            this.is_new = this.user.is_new;
            // console.log(this.is_new)
        }
    },

  methods: {
    close() {
      this.$emit("close");
    },
    
    openNewTab(url) {
      window.open(url, "_blank");
    },
    is_annoying() {
      // console.log("annoying amp");
      axios({
        url: process.env.VUE_APP_BASEURL + "/users/" + JSON.parse(localStorage.getItem("user")).user.id + "/tutorial-done",
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          this.store = JSON.parse(localStorage.getItem("user"));
          this.store.user.is_new = "0";
          this.store_is_new = this.store.user.is_new;
          localStorage.setItem("user", JSON.stringify(this.store));
          this.close();
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    expandNoJutsu() {
      this.fspanel = !this.fspanel;
      this.fs_ty = false;
    },
    sendfs() {
      let fromStore = JSON.parse(localStorage.getItem("user"));
      const dateObject = new Date();
      const date = dateObject.toDateString(); // Get date in format like "Sat Jul 27 2023"
      const time = dateObject.toLocaleTimeString(); // Get time in format like "12:30:45 PM"
      let payload = {
        timestamp_sent: date + ' ' + time,
        user_fullname: fromStore.user.name,
        user_email: fromStore.user.email,
        user_phone: fromStore.user.phone_number,
        company_name: fromStore.user.company.company_name,
        company_country: fromStore.user.company.country,
        company_domain: fromStore.user.company.domain,
        user_concern: this.fsstring,
      };
      this.loading = true;
      axios({
        url: process.env.VUE_APP_BASEURL + "/concerns",
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          // console.log(res);
          this.expandNoJutsu();
          this.fs_ty = true;
          this.fsstring = "",
          this.loading = false;
        })
        .catch((err) => {
          // console.log(err);
          this.loading = false;
        });
      // console.log(payload);
    },
  },
};
</script>
