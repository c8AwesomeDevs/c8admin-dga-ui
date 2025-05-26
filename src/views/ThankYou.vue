<template>
  <div class="background">
    <video autoplay muted loop class="vid-background">
      <source src="@/assets/video-bg.mp4" type="video/mp4" />
    </video>
    <template>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8">
          <div class="video-container pt-4">
            <video autoplay muted loop id="background-video"></video>
            <div class="content-container">
              <v-card class="mx-auto text-center" outlined elevation="10" shaped>
                <v-card-text>
                  <h1 class="display-2 font-weight-bold mb-4 thank-you-text">THANK YOU!</h1>
                  <p class="subtitle-1 mb-5">You have successfully subscribed to C8 Vortex.</p>
                  <h3 class="subtitle-2">
                    Your <span class="font-weight-bold text-uppercase subscription-color">{{ profile.subscription ? profile.subscription.subscription_type : "" }}</span> subscription will expire on
                    <span class="subscription-color">{{ dateFormat(profile.subscription.expiration_date)}}.</span>
                  </h3>
                  <h5 class="mt-8">You will be redirected to Dashboard in {{ counter }} seconds</h5>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<style scoped>
.background {
  /* background : url(@/assets/background.jpg) no-repeat; */
  background: #000;
  background-size: cover;
  width: 100%;
  height: 100%;
}
.vid-background {
  position: fixed;
  min-width: 100%;
  min-height: 100%;
  z-index: 0;
  top: 0px;
  opacity: 0.5;
}

.thank-you-text {
  color: #08a045;
}
.subscription-color {
  color: #8b0000;
  font-size: large;
}
</style>

<script>
import axios from "axios";
export default {
  beforeRouteEnter(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ''}`;
    next();
  },
  beforeRouteUpdate(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ''}`;
    next();
  },
  name: "ThankYou",
  data() {
    return {
      profile: {
        company: {},
        subscription: {},
      },
      counter: 4,
    };
  },
  mounted() {
    // this function listens to the URL if there is a 'session_id' appended to it
    let url = window.location.href.split("?");
    let params = new URLSearchParams(url[1]); // URLSearchParams is a class is not an object
    // console.log(url);
    if (url.length > 1 && params.get("session_id")) {
      // window.location.href = process.env.VUE_APP_CLIENTURL + "#/thank-you";
      axios({
        url: process.env.VUE_APP_BASEURL + "/provisionAccess",
        method: "POST",
        data: params,
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          // console.log(res.data.message);
          // the localstorage will be handled in the next if-statement
          this.getAdvanced();
        })
        .catch((err) => {
          console.log(err);
        });
    }else{
      this.getAdvanced();
    }

  },
  methods: {
    
    getAdvanced(){
      axios({
        url: process.env.VUE_APP_BASEURL + "/profile",
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          this.profile = JSON.parse(localStorage.getItem("user")).user
          // console.log(this.profile)

          setInterval((count) => {
            this.counter -= 1;
            if (this.counter == 0) {
              this.$router.push({ name: "Branches" });
            }
          }, 1000);
        })
        .catch((err) => {
          this.profile = null;
        });
    },

    dateFormat(date_str) {
      var date = new Date(date_str);

      if (isNaN(date)) {
        return "";
    }
      return date.toDateString();
    },
  },
};
</script>
