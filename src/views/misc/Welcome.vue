<template>
  <div class="background">
    <video autoplay muted loop class="vid-background">
      <source src="@/assets/video-bg.mp4" type="video/mp4" />
    </video>
    <div class="banner" :class="show_ads ? 'expand' : 'collapse'">
      <div class="vid-advertisement">
        <v-container>
          <div class="text-right">
            <v-btn x-small text dark @click="show_ads = !show_ads">Close</v-btn>
          </div>
          <v-row>
            <v-col cols="12" sm="5">
              <div class="white--text text-justify">
                <h3>What is C<span class="red--text">8</span> Vortex?</h3>
                Vortex is an transmission and distribution asset monitoring suite that equips users to monitor and in realtime using built-in analytics, to crucial equipment for
                maintaining high efficiency, productivity and lowering breakdown instances. It provides a monitoring module for dissovled gas analysis, central in which is the
                duval's diagnostic suite which is able to provide critical and accurate insight on your equipment health and help you make decisions on maintenance activities
                before any major issues are encountered!"
              </div>
            </v-col>
            <v-col cols="12" sm="7">
              <video height="300" ref="ads" controls>
                <source src="@/assets/dga.mp4" type="video/mp4" />
              </video>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <!-- <div class="border"></div> -->
      <img src="@/assets/banner.png" height="55" alt="" />
    </div>

    <div class="container pa-10 mt-30">
      <v-row>
        <!-- WHAT IS C8 VORTEX? -->
        <v-col cols="12" sm="4">
          <v-card>
            <v-img height="200" src="@/assets/7.png"> </v-img>
            <v-card-title>WHAT IS C8 VORTEX?</v-card-title>
            <v-card-text>
              <div class="scrollbar text-justify">
                C8 Vortex is a transmission and distribution asset monitoring suite that allows users to monitor and analyze critical equipment in real time using built-in
                analytics to maintain high efficiency, increase productivity, and reduce breakdowns. It includes a monitoring module for dissolved gas analysis, along with Duval's
                diagnostic suite, which can provide critical and accurate insight into your equipment's health and empower you to make maintenance decisions before any major issues
                arise!
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn class="darken-2 mb-1" block outlined color="indigo darken-2" rounded @click="show_ads = !show_ads">
                <v-icon left>mdi-information-variant</v-icon> Explore
              </v-btn>
              <!-- <v-btn small block color="grey" class="darken-2 white--text" outlined rounded @click="show_ads = !show_ads">
                                <v-icon left>mdi-information-variant</v-icon> Explore
                            </v-btn> -->
            </v-card-actions>
          </v-card>
        </v-col>
        <!-- TAKE THE NEXT STEP -->
        <v-col cols="12" sm="4">
          <v-card>
            <v-img height="200" src="@/assets/2.png"> </v-img>
            <v-card-title>TAKE THE NEXT STEP</v-card-title>
            <v-card-text>
              <div class="scrollbar text-justify">
                Improve your transformer maintenance practice today. Unlock operational insights and drive efficiency for your mission-critical processes with our Basic and
                Advanced subscriptions! <br /><br />Not yet ready to commit to a long-term partnership? You try out the demo version to see what works best for your organization.
              </div>
            </v-card-text>
            <div>
              <stripe-checkout
                ref="checkoutRef"
                mode="subscription"
                :pk="key"
                :line-items="items"
                :success-url="success_url"
                :cancel-url="cancel_url"
                :client-reference-id="reference_id"
                :subscription_data:="subscription_data"
                @loading="(v) => (loading = v)"
              />
            </div>
            <!-- <v-btn class="darken-2 mb-1"  block outlined color="orange darken-2" rounded  @click="showSubscriptions()">
                                <v-icon>mdi-gesture-tap</v-icon> Subscribe
                            </v-btn> -->
            <v-card-actions>
              <div></div>
              <v-btn class="darken-2 mb-1" block outlined color="orange darken-2" rounded @click="bookMyDemo()"> <v-icon>mdi-gesture-tap</v-icon> Register my Account </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <!-- GET STARTED -->
        <v-col cols="12" sm="4">
          <v-card>
            <v-img height="200" src="@/assets/3.png"> </v-img>
            <v-card-title>GET STARTED</v-card-title>
            <v-card-text>
              <div class="scrollbar text-justify">
                Welcome to C8 Vortex. Login or Sign up for an account and extend the life of your critical equipment with an intelligent transmission and distribution asset
                monitoring suite.
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn class="darken-2 mb-1" block outlined color="red darken-2" rounded @click="showLogin()" v-if="!authenticated_user">
                <v-icon left>mdi-login</v-icon>
                LOG-IN
              </v-btn>
              <v-btn class="darken-2 mb-1" block outlined color="red darken-2" rounded @click="showLogin()" v-if="authenticated_user">
                <v-icon left>mdi-login</v-icon>
                LOG-IN
              </v-btn>
              <!-- <v-btn class="darken-2 mb-1"  block outlined color="red darken-2" rounded  @click="enter()" v-if="authenticated_user">
                                <v-icon left>mdi-login</v-icon>
                                Enter
                            </v-btn> -->
              <!-- <v-btn block @click="showLogin()" rounded color="red darken-2" dark v-if="!authenticated_user">
                                <v-icon left>mdi-login</v-icon>
                                LOG-IN/SIGN-UP
                            </v-btn>
                            <v-btn block @click="enter()" rounded color="red darken-2" dark v-if="authenticated_user">
                                <v-icon left>mdi-login</v-icon>
                                Enter
                            </v-btn> -->
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-footer absolute class="footer mt-10 mb-1" color="transparent">
      <span class="lighten-2"> &copy; {{ new Date().getFullYear() }} Calibr8 Systems Inc. All Rights Reserved</span>
    </v-footer>
    <v-dialog v-model="validation_dialog" max-width="350" min-width="300">
      <template>
        <v-card>
          <div>
            <span>
              <v-icon color="orange" class="icon ml-3 mt-3"> mdi-alert-circle-outline </v-icon>
              <span class="check">
                {{ dialogMessage }}
              </span>
            </span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn v-if="inactiveSubs_user" dark small color="primary" text @click="manageSub()">Manage Subscription</v-btn>
            <v-btn dark small color="red" text @click="validation_dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog v-model="expiration_dialog" max-width="350" min-width="300">
      <template>
        <v-card>
          <div>
            <span>
              <v-icon color="orange" class="icon ml-3 mt-3"> mdi-alert-circle-outline </v-icon>
              <div class="message">
                Hello <span class="bold">{{ username }}</span
                >,<br />
                your <span class="bold">{{ subscriptiontype }}</span> subscription has been ended.
              </div>
            </span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn dark small color="red" text @click="upgrade()">UPGRADE TO ADVANCE</v-btn>
            <v-btn dark small color="red" text @click="expiration_dialog = false">CANCEL</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog v-model="success_dialog" max-width="350" min-width="300">
      <template>
        <v-card>
          <div>
            <span>
              <v-icon color="green" class="icon ml-3 mt-3"> mdi-check-circle-outline </v-icon>
              <div class="message">
                Hello <span class="bold">{{ username }}</span
                >,<br />
                your account registered successfully.
              </div>
            </span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn dark small color="red" text @click="success_dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <Demo :showDemo="demo_dialog" :demo_dialog.async="demo_dialog" :user="user" :company="company" :loading="loading" @close="closeDemoDialog" @bookDemo="bookDemo" />
    <Login :show="login_dialog" :googleLoading="googleLoading" :microsoftLoading="microsoftLoading" :login_dialog.sync="login_dialog" @authenticate="authenticate" />
    <subscriptions-dialog :dialog="subscriptions_dialog" @close="closeSubscriptionsDialog" @subscribe="subscribe" />
    <company-details-dialog :dialog="company_details_dialog" :details="company_details" @update="updateProfile" />
    <subscription-details @close="closeCurrentSubscriptionDetailsDialog" :dialog="current_subscription_details_dialog" :details="authenticated_user" />
  </div>
</template>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 14px;
}
.bold {
  font-weight: bold;
}
.check {
  font-size: 14px;
  white-space: pre;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1em;
  margin-right: 1em;
}
.message {
  font-size: 14px;
  text-align: center;
  margin-left: 1em;
  margin-right: 1em;
}
.icon {
  font-size: 25px;
}
.mt-30 {
  margin-top: 100px;
}
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
.vid-advertisement {
  padding: 30px 0 30px;
  background-image: url(@/assets/advertisement-cont.png);
  background-repeat: repeat;
}

.scrollbar {
  height: 150px;
  overflow-y: scroll;
  font-size: 13px;
  /* Add the ability to scroll */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar {
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
.banner {
  text-align: center;
  position: fixed;
  top: 0px;
  z-index: 10;
  width: 100%;
  transition: 0.5s ease-in-out;
}
.banner.collapse {
  transform: translateY(-385px);
}
.banner.expand {
  transform: translateY(0px);
}
.banner .border {
  background: #000;
  opacity: 0.8;
  height: 20px;
}
</style>
<script>
import { StripeCheckout } from "@vue-stripe/vue-stripe";
import Login from "@/components/Login.vue";
import Demo from "@/components/Demo.vue";
import SubscriptionsDialog from "@/components/popups/SubscriptionsDialog.vue";
import CompanyDetailsDialog from "@/components/popups/CompanyDetailsDialog.vue";
import SubscriptionDetails from "@/components/popups/SubscriptionDetails.vue";
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
  name: "Subscriptions",
  components: {
    Login,
    StripeCheckout,
    SubscriptionsDialog,
    CompanyDetailsDialog,
    SubscriptionDetails,
    Demo,
  },
  watch: {
    show_ads() {
      if (!this.show_ads) {
        this.$refs.ads.pause();
      } else {
        this.$refs.ads.play();
      }
    },
  },
  data() {
    return {
      show_ads: false,
      googleLoading: false,
      microsoftLoading: false,
      login_dialog: false,
      demo_dialog: false,
      loading: false,
      items: [],
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: null,
      success_dialog: false,
      cancel_url: "http://localhost:8080/",
      key: process.env.VUE_APP_STRIPE_KEY,
      subscriptions_dialog: false,
      expiration_dialog: false,
      authenticated_user: null,
      company_details_dialog: false,
      company_details: {},
      reference_id: null,
      current_subscription_details: false,
      current_subscription_details_dialog: false,
      validation_dialog: false,
      responseDemo: [],
      dialogMessage: "",
      formData: {},
      username: {},
      subscriptiontype: {},
      company: {
        company_name: "", // Initialize the field to be reset
        country: null, // Initialize the field to be reset
        hear_aboutus: null,
        industry: null,
      },
      user: {
        name: "", // Initialize the field to be reset
        email: "", // Initialize the field to be reset
        phone_number: "",
      },
      inactiveSubs_user: null,
    };
  },
  mounted() {
    if (localStorage.getItem("user")) {
      axios({
        url: process.env.VUE_APP_BASEURL + "/profile",
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          this.authenticated_user = res.data;
          // console.log(res.data);
        })
        .catch((err) => {
          this.authenticated_user = null;
        });
    }
  },
  methods: {
    goTo(name) {
      this.$router.push({ name: name });
    },
    showLogin() {
      this.login_dialog = true;
    },
    showDemo() {
      this.demo_dialog = true;
    },
    closeDemoDialog() {
      this.demo_dialog = false;
    },
    closeLoginDialog() {
      this.login_dialog = false;
    },

    authenticate(provider, response) {
      this.login_dialog = true;
      this.inactiveSubs_user = null; // prep variable so we can show and hide "manage subscription" button
      const today = new Date();

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so adding 1
      const day = String(today.getDate()).padStart(2, "0");
      const dateToday = `${year}-${month}-${day}`;

      if (provider === "google") {
        this.googleLoading = true;
       // console.log(response);
        let token;
        let refresh_token;

        // if (response.Oc != undefined) {
        //     token = response.Oc.id_token || response.Jc.id_token;
        // } else if (response.Rc != undefined) {
        //     token = response.Rc.id_token || response.Jc.id_token;
        // } else if(response.Sc != undefined){
        //     token = response.Sc.id_token || response.Jc.id_token;
        // } else if(response.Tc != undefined){
        //     token = response.Tc.id_token || response.Jc.id_token;
        // }else if(response.Qc != undefined){
        //     token = response.Qc.id_token || response.Jc.id_token;
        // }
        
        token = response.id_token;

        axios({
            method: "POST",
            url: process.env.VUE_APP_BASEURL + "/google/auth",
            data: { token: token},
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
            .then((res) => {
                // Common logic for both cases
                window.localStorage.setItem("user", JSON.stringify(res.data));
                this.authenticated_user = res.data;
                this.closeLoginDialog();
                this.googleLoading = false;
                console.log(res.data);

                // if (res.data.user.company.updated == 1) {
                //     if (res.data.user.subscription) {
                //         if (this.current_subscription_details) {
                //             this.current_subscription_details_dialog = true;
                //         } else {
                //             if (res.data.user.subscription.expiration_date == dateToday) {
                //                 this.username = res.data.user.name;
                //                 this.subscriptiontype = res.data.user.subscription.subscription_type;
                //                 this.expiration_dialog = true;
                //             } else {
                //                 this.$router.push({ name: "Company" });
                //             }
                //         }
                //     } else {
                //         this.subscriptions_dialog = true;
                //     }
                // } else {
                //     this.company_details = res.data.user;
                //     this.company_details_dialog = true;
                // }
            })
            .catch((err) => {
              // alert(err.response.data.error);
              // alert(err);
                // Common error handling logic
                console.log(err)
                this.validation_dialog = true;
                this.dialogMessage = err.response.data.error || "An error occurred, please try again.";
                this.googleLoading = false;
                this.inactiveSubs_user = err.response.data.user_id;
                // alert(err.response.data);
            });
      } else if (provider === "microsoft") {
      
        this.microsoftLoading = true;
        let token = response.accessToken;
        let token_expiry = response.expiresOn

        // console.log(response)
        axios({
          method: "POST",
          url: process.env.VUE_APP_BASEURL + "/microsoft/auth",
          data: { token: token, token_expiry: token_expiry },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }).then((res) => {
            console.log(res.data);
            window.localStorage.setItem("user", JSON.stringify(res.data));
            this.authenticated_user = res.data;
            this.closeLoginDialog();
            this.googleLoading = false;

            if (res.data.user.company.updated == 1) {
              if (res.data.user.subscription) {
                if (this.current_subscription_details) {
                  this.current_subscription_details_dialog = true;
                } else {
                  if (res.data.user.subscription.expiration_date == dateToday) {
                    this.username = res.data.user.name;
                    this.subscriptiontype = res.data.user.subscription.subscription_type;
                    this.expiration_dialog = true;
                  } else {
                    this.$router.push({ name: "Company" });
                  }
                }
              } else {
                this.subscriptions_dialog = true;
              }
            } else {
              this.company_details = res.data.user;
              this.company_details_dialog = true;
            }
          })
          .catch((err) => {
            // alert(err.response.data);
            // console.log(err.response);
            // this.validation_dialog = true;
            // alert(err.response.data);
            this.validation_dialog = true;
            this.dialogMessage = err.response.data.error;
            this.microsoftLoading = false;
            // alert(JSON.stringify(err));
            // console.log(err.response);
            // alert(err.response.data);
          });
      }
    },
    closeCurrentSubscriptionDetailsDialog() {
      this.current_subscription_details_dialog = false;
    },
    updateProfile(profile) {
      axios({
        url: process.env.VUE_APP_BASEURL + "/profile",
        method: "PUT",
        data: profile,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          this.company_details_dialog = false;
          // this.subscribe("demo");
          window.location.href = process.env.VUE_APP_CLIENTURL + "thank-you";
          // this.subscriptions_dialog = true;
        })
        .catch((err) => {
          // alert(JSON.stringify(err));
          console.log(err.response);
        });
    },
    showSubscriptions() {
      if (this.authenticated_user) {
        this.current_subscription_details_dialog = true;
      } else {
        this.current_subscription_details = true;
        this.showLogin();
      }
    },
    bookMyDemo() {
      this.showDemo();
    },
    closeSubscriptionsDialog() {
      this.subscriptions_dialog = false;
    },
    subscribe(type, price_id) {
      if (type == "demo") {
        // alert('Demo Registration is under development.');
        // return;
        axios({
          url: process.env.VUE_APP_BASEURL + "/demo-subscription",
          method: "POST",
          data: {
            type: "demo",
          },
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
          .then((response) => {
            this.subscriptions_dialog = false;
            window.location.href = process.env.VUE_APP_CLIENTURL + "#/thank-you";
            // console.log(this.responseDemo);
          })
          .catch((err) => {
            // alert(err);
          });
      } else {
        // this.validation_dialog = true;
        // this.dialogMessage = "Advance subscription is under development. \nPlease check back later.";
        // return;
        this.items = [
          {
            price: price_id,
            quantity: 1,
          },
        ];
        this.subscriptions_dialog = false;

        this.success_url = process.env.VUE_APP_BASEURL + "/payment/success?r=thank-you&session_id={CHECKOUT_SESSION_ID}";
        this.cancel_url = process.env.VUE_APP_CLIENTURL + "#/";
        this.reference_id = JSON.parse(localStorage.getItem("user")).user.id.toString() + ":" + type;
        this.$refs.checkoutRef.redirectToCheckout();
      }
    },
    enter() {
      this.$router.push({ name: "Home" });
    },
    upgrade() {
      this.expiration_dialog = false;
      this.validation_dialog = true;
      this.dialogMessage = "Advance subscription is under development. \n                 Please check back later.";
    },

    bookDemo(formData) {
      this.loading = true;
      // Use the formData object received from the child component (optional, see note below)
      axios({
        url: process.env.VUE_APP_BASEURL + "/register",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          // Handle the response if needed
          this.username = response.data.user.name;
          this.success_dialog = true;
          this.closeDemoDialog();
          this.company.company_name = "";
          this.company.country = null;
          this.company.hear_aboutus = null;
          this.company.industry = null;
          this.user.name = "";
          this.user.email = "";
          this.user.phone_number = null;
          this.loading = false;
        })
        .catch((err) => {
          (this.validation_dialog = true), (this.dialogMessage = err);
          this.loading = false;
          // alert(err.response.data.error);
          let errorMessage = err.response.data.error;
          (this.validation_dialog = true), (this.dialogMessage = errorMessage.replace(/\\n/g, "\n                 "));
          this.loading = false;
          this.demo_dialog = true;
        });
    },
    manageSub() {
      // this.loading = true;
      axios({
        url: process.env.VUE_APP_BASEURL + "/subscriptions/check",
        method: "POST",
        data: { user_id: this.inactiveSubs_user },
        // headers: {
        //   Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        // },
      })
        .then((res) => {
          // console.log(res);
          window.open(res.data, "_self");
          // if (res.data.id != undefined) {
          //   this.current_subscription_details = res.data;
          //   this.current_subscription_dialog = true;
          // }
          // this.loading = false;
        })
        .catch((err) => {
          // alert(JSON.stringify(err));
        });
    },
  },
};
</script>