<template>
    <v-container>
        <v-card>
            <v-toolbar dark dense color="red">
                Subscriptions List
                <v-spacer></v-spacer>
                <v-btn small color="red" class="darken-4" dark @click="showSubscriptions()">
                    <v-icon>mdi-plus</v-icon>
                    Add Subscription
                </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="company_subscriptions"
                    item-key="id"
                    class="elevation-1"
                    >
                    <template v-slot:item="{item}">
                        <tr>
                            <td class="font-sm">
                                {{ item.created_at}}
                            </td>
                            <td class="font-sm">
                                {{ item.subscription_type.toUpperCase() }}
                            </td>
                            <td class="font-sm">
                                {{ item.total }}
                            </td>
                            <td class="font-sm">
                                {{ item.currency }}
                            </td>
                            <td>{{ item.activation_date }}</td>
                            <td>{{ item.expiration_date }}</td>
                            <td>
                                <v-btn :disabled="!item.activateable" :class="item.activated ? 'red white--text' : ''" x-small>
                                    {{ item.activated == 1 ? 'Activated' : 'Activate' }}
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <template>
            <div class="text-center">
                <v-dialog
                v-model="subscriptions_dialog"
                width="500"
                >

                <v-card>
                    <v-tabs
                    v-model="tab"
                    centered
                    >
                        <v-tab key="demo">
                            Demo
                        </v-tab>
                        <!-- <v-tab key="basic">
                            Basic
                        </v-tab> -->
                        <v-tab key="advanced">
                            Advanced
                        </v-tab>

                        <v-tab-item key="demo">
                            <v-card flat>
                                <v-list dense>
                                    <v-list-item v-for="i, idx in subscriptions.demo.inclusions" :key="idx">
                                        <v-list-item-content class="text-center">
                                            {{ i }}
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-btn block small @click="checkSubscription('demo')">Subscribe</v-btn>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-tab-item>
                        <!-- <v-tab-item key="basic">
                            <v-card flat>
                                <v-list dense>
                                    <v-list-item v-for="i, idx in subscriptions.basic.inclusions" :key="idx">
                                        <v-list-item-content class="text-center">
                                            {{ i }}
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-btn block small color="orange" class="darken-2" 
                                                @click="checkSubscription('basic')"
                                                dark>
                                                BUY BASIC SUBSCRIPTION
                                            </v-btn>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-tab-item> -->
                        <v-tab-item key="advanced">
                            <v-card flat>
                                <v-list dense>
                                    <v-list-item v-for="i, idx in subscriptions.advanced.inclusions" :key="idx">
                                        <v-list-item-content class="text-center">
                                            {{ i }}
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-btn block small color="red" class="darken-2" 
                                                @click="checkSubscription('advanced')"
                                                dark>
                                                BUY ADVANCED SUBSCRIPTION
                                            </v-btn>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </v-card>
                </v-dialog>
            </div>
        </template>
        <template>
            <v-dialog width="350" v-model="current_subscription_dialog">
                <v-card>
                    <v-card-title>Existing Subscription Found</v-card-title>
                    <v-card-text>
                        <div>Seems like you still have an active subscription for this package that will expire on {{ current_subscription_details.expiration_date }}.</div> 
                        <br>
                        <div>Do you want to renew your subscription instead?</div>
                        <div class="red--text">
                            Note : This will be activated once your existing subscription expired.
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" class="darken-2" dark @click="renew()">Renew Now</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
        <v-dialog v-model="validation_dialog" max-width="350" min-width="300">
            <template>
                    <v-card>
                    <div >
                <span>
                    <v-icon color="orange" class="icon ml-3 mt-3">
                    mdi-alert-circle-outline
                    </v-icon>
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
        <template>
            <stripe-checkout
                ref="checkoutRef"
                mode="subscription"
                :pk="key"
                :line-items="items"
                :success-url="success_url"
                :cancel-url="cancel_url"
                :client-reference-id="reference_id"
                @loading="v => loading = v"
                />
        </template>
    </v-container>
</template>
<style scoped>
.v-list-item__content {
    display: unset;
}

.demo-check{
    font-size: 13px;
    white-space: pre; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    margin-left: 1em; 
    margin-right: 1em;
}
.icon{
    font-size: 25px;
}
</style>
<script>
    import { subscriptionMixin } from '@/mixins/subscriptionMixin.js';
    import { StripeCheckout } from '@vue-stripe/vue-stripe';
  
    import axios from 'axios';
    export default {
        name : 'Subscriptions',
        mixins : [subscriptionMixin],
        components : {StripeCheckout},
        data () {
            return {
                validation_dialog: false,
                dialogMessage: '',
                current_subscription_dialog : false,
                current_subscription_details : {},
                tab : 'advanced',
                subscriptions_dialog : false,
                company_subscriptions : [],
                headers : [
                    {
                        text: 'Date',
                        align: 'start',
                        sortable: true,
                        value: 'created_at',
                    },
                    {
                        text: 'Subscription Type',
                        align: 'start',
                        sortable: true,
                        value: 'subscription_type',
                    },
                    {
                        text: 'Amount Paid',
                        align: 'start',
                        sortable: false,
                        value: 'total',
                    },
                    {
                        text: 'Currency',
                        align: 'start',
                        sortable: false,
                        value: 'currency',
                    },
                    {
                        text: 'Activation Date',
                        align: 'start',
                        sortable: false,
                        value: 'activation_date',
                    },
                    {
                        text: 'Expiration Date',
                        align: 'start',
                        sortable: false,
                        value: 'expiration_date',
                    },
                    {
                        text: 'Status',
                        align: 'start',
                        sortable: false,
                        value: 'activated',
                    }
                ],
                key : process.env.VUE_APP_STRIPE_KEY,
                items : [],
                success_url : null,
                cancel_url : null,
                reference_id : null
            }
        },
        mounted() {
            axios({
                url : process.env.VUE_APP_BASEURL + '/subscriptions',
                method : 'GET',
                headers : {
                    Authorization : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                }
            }).then(res => {
                this.company_subscriptions = res.data.map(sub => {
                    sub.activation_date = new Date(sub.activation_date).toLocaleDateString();
                    sub.expiration_date = new Date(sub.expiration_date).toLocaleDateString();
                    sub.created_at = new Date(sub.created_at).toLocaleString();

                    var current_date = new Date();
                    var activation_date = new Date(sub.activation_date);
                    var expiration_date = new Date(sub.expiration_date);

                    if(current_date >= activation_date && current_date <= expiration_date) {
                        sub.activateable = true;
                    }
                    else {
                        sub.activateable = false;
                    }

                    return sub;
                });
                // console.log(this.company_subscriptions);
            }).catch(err => {
                const statusCode = err.response.status;
                // console.log(statusCode);
               
            });
        },
        methods : {
            showSubscriptions() {
                this.subscriptions_dialog = true;
            },
            checkSubscription(type) {
                axios({
                    url : process.env.VUE_APP_BASEURL + '/subscriptions/check',
                    method : 'GET',
                    params : {type : type},
                    headers : {
                        Authorization : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                    }
                }).then(res => {
                    if(res.data.id != undefined) {
                        this.current_subscription_details = res.data;
                        this.current_subscription_dialog = true;
                    }
                    else {
                        if(type == 'demo') {
                            this.subscribeToDemo(type);
                        }
                        else{
                            this.subscribe(type);
                        }
                    }
                }).catch(err => {
                    alert(JSON.stringify(err));
                })
            },
            renew() {
                this.success_url = process.env.VUE_APP_BASEURL + '/payment/renew?session_id={CHECKOUT_SESSION_ID}';
                this.cancel_url = process.env.VUE_APP_CLIENTURL + '/dashboard/subscription';
                this.reference_id = this.current_subscription_details.id.toString();
                this.items = [
                    {   
                        price : this.subscriptions[this.current_subscription_details.subscription_type].price_id,
                        quantity : 1
                    }
                ];
                
                this.$refs.checkoutRef.redirectToCheckout();
            },
            subscribe(type) {

                // this.validation_dialog = true;
                // this.dialogMessage ='Advance subscription is under development. \nPlease check back later.';
                // return;

                this.success_url = process.env.VUE_APP_BASEURL + '/payment/success?r=subscription&session_id={CHECKOUT_SESSION_ID}';
                this.cancel_url = process.env.VUE_APP_CLIENTURL + '/dashboard/subscription';
                this.reference_id = this.reference_id = JSON.parse(localStorage.getItem('user')).user.id.toString() + ':' + type;

                this.items = [
                    {   
                        price : this.subscriptions[type].price_id,
                        quantity : 1
                    }
                ];
                
                this.$refs.checkoutRef.redirectToCheckout();
            },
            subscribeToDemo() {
                
                // alert('Demo Registration is under development.');
                // return;
                axios({
                    url : process.env.VUE_APP_BASEURL + '/demo-subscription',
                    method : 'POST',
                    data : {
                        type : 'demo'
                    },
                    headers : {
                        Authorization : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                    }
                }).then(response => {
                    this.subscriptions_dialog = false;    
                    window.location.href = process.env.VUE_APP_CLIENTURL + '/thank-you';     
                    // console.log(this.responseDemo);
                }).catch(err => {
                    alert(err)
                });
                
            }
        }
    }
</script>