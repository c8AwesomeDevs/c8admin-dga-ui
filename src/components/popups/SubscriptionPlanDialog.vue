<template>
  <v-dialog v-model="dialog" width="800" :persistent="persistent">
    <v-card>
      <v-card-title>
        Subscription Plans
        <v-spacer></v-spacer>
        <span><v-icon @click="closeSubs()">mdi-close</v-icon></span>
      </v-card-title>
      <v-card-text>
        <!-- <v-alert color="green" outlined text type="info">
          You're currently subscribed to
          <b>{{ subscription_type }}</b
          >.
          <v-btn v-if="subscription_type !== 'demo'" text small color="primary" @click="manageSub()">Manage Subscription</v-btn>
        </v-alert> -->

        <!-- DEMO -->
        <v-card class="mb-4" outlined tile>
          <div class="d-flex align-center justify-space-between">
            <div>
              <h3 class="pa-5 pb-1">C8 Vortex Demo</h3>
              <v-card-text class="pt-1">
                <div class="price">
                  <h1>{{ subscriptions.demo.price }}</h1>
                </div>
              </v-card-text>
            </div>
            <div class="pr-4">
              <div v-if="subscription_type == 'demo'">Expiration: {{ expiration_date }}</div>
            </div>
          </div>
          <v-divider></v-divider>

          <v-row class="pa-2" no-gutters>
            <v-col v-for="n in subscriptions.demo.inclusions" :key="n" cols="12" sm="4">
              <div class="d-flex">
                <v-icon color="green" class="mr-3"> mdi-check </v-icon>
                <div class="pa-2" outlined tile>{{ n }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
        <!-- ADVANCE -->
        <v-card class="mb-4" outlined tile>
          <div class="d-flex align-center justify-space-between">
            <div>
              <h3 class="pa-5 pb-1">C8 Vortex Advance</h3>
              <v-card-text class="pt-1">
                <div class="price">
                  <h1>{{ subscriptions.advanced.price }}</h1>
                </div>
              </v-card-text>
            </div>
            <div class="pr-4">
              <!-- <div v-if="subscription_type == 'advanced'">Your next billing date is: asdasdasd</div> -->
              <v-btn v-if="subscription_type == 'advanced'" block :dark="!loading" :disabled="loading" color="orange" @click="manageSub()">{{
                loading ? "Please wait..." : "Manage Subscription"
              }}</v-btn>
              <v-btn v-if="subscription_type != 'advanced'" block dark :disabled="demo_dialog == true" color="orange darken-2" @click="demo_dialog = true;">Get Advance
              </v-btn>
              <div class="pr-4 pt-2">
                <div v-if="subscription_type == 'advanced'">Expiration: {{ expiration_date }}</div>
              </div>
            </div>
          </div>
          <v-divider></v-divider>

          <v-row class="pa-2" no-gutters>
            <v-col v-for="n in subscriptions.advanced.inclusions" :key="n" cols="12" sm="4">
              <div class="d-flex">
                <v-icon color="green" class="mr-3"> mdi-check </v-icon>
                <div class="pa-2" outlined tile>{{ n }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
    </v-card>
    <!-- <v-row no-gutters>
      <v-col>
        <v-card outlined tile class="card-demo">
          <v-card-subtitle class="text-center"> C8 VORTEX DEMO </v-card-subtitle>
          <v-card-text>
            <div class="text-center price">
              <h1>{{ subscriptions.demo.price }}</h1>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn block disabled color="orange" class="lighten-2">{{ subscription_type == "demo" ? "Current Subscription" : "Demo" }}</v-btn>
          </v-card-actions>
          <v-list dense class="font-sm">
            <v-list-item v-for="(inclusion, idx) in subscriptions.demo.inclusions" :key="idx">
              <v-icon color="grey" class="mr-3"> mdi-shield-check-outline </v-icon>
              <v-list-item-content>
                {{ inclusion }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined tile class="card-advanced">
          <v-card-subtitle class="text-center">
            C8 VORTEX ADVANCED
            <span class="right"><v-icon @click="closeSubs()">mdi-close</v-icon></span>
          </v-card-subtitle>
          <v-card-text>
            <div class="text-center price">
              <h1>{{ subscriptions.advanced.price }}</h1>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn v-if="subscription_type == 'advanced'" :disabled="loading" @click="checkSubscription('advanced')" block color="orange darken-2">{{
              loading ? "Checking..." : "Current Subscription"
            }}</v-btn>
            <v-btn v-if="subscription_type == 'demo'" :disabled="loading" block color="orange darken-2" @click="upgrade('advanced')">{{
              loading ? "Loading..." : "Upgrade to Advance"
            }}</v-btn>
          </v-card-actions>
          <v-list dense class="font-sm">
            <v-list-item v-for="(inclusion, idx) in subscriptions.advanced.inclusions" :key="idx">
              <v-icon v-if="subscription_type == 'advanced'" color="green" class="mr-3"> mdi-shield-check </v-icon>
              <v-icon v-if="subscription_type == 'demo'" color="green" class="mr-3"> mdi-shield-check-outline </v-icon>
              <v-list-item-content>
                {{ inclusion }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row> -->
    <template>
      <v-dialog width="350" v-model="current_subscription_dialog">
        <v-card>
          <v-card-title>Your current subscription</v-card-title>
          <v-card-text>
            <div>Your active subscription for this package will expire on {{ expiration_date }}.</div>
            <br />
            <!-- <div>Do you want to renew your subscription instead?</div> -->
            <!-- <div class="red--text">
                            Note : This will be activated once your existing subscription expired.
                        </div> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" class="darken-2" text dark @click="current_subscription_dialog = false">close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template>
      <v-dialog v-model="validation_dialog" max-width="450" min-width="400">
        <template>
          <v-card>
            <div>
              <span>
                <v-icon color="orange" class="icon ml-3 mt-3"> mdi-alert-circle-outline </v-icon>
                <span class="demo-check"> Advanced subscription is under development. </span>
              </span>
            </div>
            <v-card-actions class="justify-end">
              <v-btn dark small color="red" text @click="validation_dialog = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </template>
    <template>
      <v-dialog width="350" v-if="!validation_dialog == true" v-model="demo_dialog" persistent >
        <v-card>
          <v-card-actions>
            <v-card-title>Upgrade to Advance</v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click="demo_dialog = false" text><v-icon>mdi-close</v-icon></v-btn>
          </v-card-actions>
          <v-card-text>
            <div>Note: All of your assets data will be deleted for demo versions.</div>
            <br />
            <!-- <div>Do you want to renew your subscription instead?</div> -->
            <!-- <div class="red--text">
                            Note : This will be activated once your existing subscription expired.
                        </div> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" class="darken-2" :disabled="loading" text  @click="upgrade('advanced')">{{ loading ? 'Loading...' : 'Proceed'}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <!-- <template>
      <stripe-checkout
        ref="checkoutRef"
        mode="subscription"
        :pk="key"
        :line-items="items"
        :success-url="success_url"
        :cancel-url="cancel_url"
        :client-reference-id="reference_id"
        :customer-email="email"
        @loading="(v) => (loading = v)"
      />
    </template> -->
  </v-dialog>
</template>

<style scoped>
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

.right {
  position: absolute;
  padding-left: 5rem;
  cursor: pointer;
}
.font-sm {
  font-size: 14px;
}
.card-demo {
  height: 570px; /* Set the desired height for the DEMO card */
}

.card-advanced {
  height: 570px; /* Set the desired height for the ADVANCED card */
}
</style>
<script>
import axios from "axios";
import { subscriptionMixin } from "@/mixins/subscriptionMixin.js";
import { StripeCheckout } from "@vue-stripe/vue-stripe";
export default {
  name: "SubscriptionsDialog",
  props: ["dialog"],
  mixins: [subscriptionMixin],
  components: { StripeCheckout },
  data() {
    return {
      persistent: true,
      subscription_type: "",
      current_subscription_dialog: false,
      current_subscription_details: {},
      items: [],
      email: null,
      success_url: null,
      cancel_url: null,
      reference_id: null,
      key: process.env.VUE_APP_STRIPE_KEY,
      loading: false,
      demo_dialog: false,
      validation_dialog: false,
      expiration_date: "",
      user:{}
    };
  },
  mounted() {
   
    this.user = JSON.parse(localStorage.getItem("user")).user;
    this.company_id = this.user.company_id;
    // console.log(this.company_id)
    this.subscription_type = this.user.subscription.subscription_type;
    this.expiration_date = this.user.subscription.expiration_date;
    // console.log(this.subscription_type);
    // if (this.subscription_type == "demo") {
    //   this.checkSub("demo");
    // } else {
    //   this.checkSub("advanced");
    // }
  },
  watch: {
    user() {
      // this is needed to dynamically switch the UI elemets
      this.subscription_type = this.user.subscription.subscription_type;
      // listen to this.user prop and check the user's subscription status accordingly
      if (this.user.subscription.subscription_type == "demo") {
        this.checkSub("demo");
      } else {
        this.checkSub("advanced");
      }
    },
  },
  methods: {
    closeSubs() {
      this.$emit("close");
    },
    subscribe(type) {
      this.$emit("subscribe", type, this.subscriptions[type].price_id);
    },
    upgrade(type) {
      // this.demo_dialog = false;
      // this.success_url = process.env.VUE_APP_BASEURL + "/payment/success?r=thank-you&session_id={CHECKOUT_SESSION_ID}";
      // this.cancel_url = process.env.VUE_APP_CLIENTURL + "#/dashboard/assets";
      // this.reference_id = this.reference_id = JSON.parse(localStorage.getItem("user")).user.id.toString() + ":" + type;
      // this.email = this.user.email;
      // this.items = [
      //   {
      //     price: this.subscriptions[type].price_id,
      //     quantity: 1,
      //   },
      // ];

      // this.validation_dialog = true;
      // return

      // this.$refs.checkoutRef.redirectToCheckout();
      //this.validation_dialog = true;
      this.demo_dialog = false;
      this.loading = true;
      axios({
        url: process.env.VUE_APP_BASEURL + "/checkout",
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      }).then((res) => {
        window.open(res.data, "_self");
        this.loading = false;
        // console.log(res.data);
      });
    },
    manageSub() {
      // this.loading = true;
      this.loading = true;
      axios({
        url: process.env.VUE_APP_BASEURL + "/subscriptions/manage",
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          // if (res.data.id != undefined) {
          //   this.current_subscription_details = res.data;
          //   this.current_subscription_dialog = true;
          // }
          if (res.data) {
            window.open(res.data, "_self");
            this.loading = false;
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        });
    },

    checkSub(type) {
      axios({
        url: process.env.VUE_APP_BASEURL + "/subscriptions/check",
        method: "GET",
        params: { type: type, company_id:  this.company_id },
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          // console.log(res.data);
          // window.open(res.data, "_self");
          if (res.data.id != undefined) {
            this.current_subscription_details = res.data;
            // this.current_subscription_dialog = true;
          }
          // this.loading = false;
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        });
    },
  },
};
</script>
